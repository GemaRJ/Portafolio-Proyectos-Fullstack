from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from .models import Cuenta
from movimientos.models import Movimiento
from transferencias.models import Transferencia


class CuentaSerializer(serializers.ModelSerializer):
    usuario_dni = serializers.CharField(source='usuario.dni', read_only=True)

    class Meta:
        model = Cuenta
        fields = (
            'id',
            'usuario',
            'usuario_dni',
            'numero_cuenta',
            'tipo_cuenta',
            'saldo',
            'activa',
            'fecha_creacion',
        )


class IngresoSerializer(serializers.Serializer):
    cuenta_id = serializers.IntegerField()
    importe = serializers.DecimalField(max_digits=12, decimal_places=2)
    concepto = serializers.CharField(max_length=150)
    categoria = serializers.CharField(max_length=30, default='otros', required=False)

    def validate_importe(self, value):
        if value <= 0:
            raise serializers.ValidationError('El importe debe ser mayor que cero.')
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        usuario = request.user

        try:
            cuenta = Cuenta.objects.get(id=attrs['cuenta_id'])
        except Cuenta.DoesNotExist:
            raise serializers.ValidationError('La cuenta indicada no existe.')

        if not cuenta.activa:
            raise serializers.ValidationError('La cuenta no está activa.')

        if not usuario.is_staff and not usuario.is_superuser and cuenta.usuario != usuario:
            raise serializers.ValidationError('No puedes operar con una cuenta que no es tuya.')

        attrs['cuenta'] = cuenta
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        cuenta = validated_data['cuenta']
        importe = validated_data['importe']

        cuenta.saldo += importe
        cuenta.save()

        movimiento = Movimiento.objects.create(
            cuenta=cuenta,
            concepto=validated_data['concepto'],
            importe=importe,
            tipo='ingreso',
            categoria=validated_data.get('categoria', 'otros'),
        )

        return {
            'cuenta': cuenta,
            'movimiento': movimiento,
        }


class GastoSerializer(serializers.Serializer):
    cuenta_id = serializers.IntegerField()
    importe = serializers.DecimalField(max_digits=12, decimal_places=2)
    concepto = serializers.CharField(max_length=150)
    categoria = serializers.CharField(max_length=30, default='otros', required=False)

    def validate_importe(self, value):
        if value <= 0:
            raise serializers.ValidationError('El importe debe ser mayor que cero.')
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        usuario = request.user

        try:
            cuenta = Cuenta.objects.get(id=attrs['cuenta_id'])
        except Cuenta.DoesNotExist:
            raise serializers.ValidationError('La cuenta indicada no existe.')

        if not cuenta.activa:
            raise serializers.ValidationError('La cuenta no está activa.')

        if not usuario.is_staff and not usuario.is_superuser and cuenta.usuario != usuario:
            raise serializers.ValidationError('No puedes operar con una cuenta que no es tuya.')

        if cuenta.saldo < attrs['importe']:
            raise serializers.ValidationError('Saldo insuficiente para realizar la operación.')

        attrs['cuenta'] = cuenta
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        cuenta = validated_data['cuenta']
        importe = validated_data['importe']

        cuenta.saldo -= importe
        cuenta.save()

        movimiento = Movimiento.objects.create(
            cuenta=cuenta,
            concepto=validated_data['concepto'],
            importe=importe,
            tipo='gasto',
            categoria=validated_data.get('categoria', 'otros'),
        )

        return {
            'cuenta': cuenta,
            'movimiento': movimiento,
        }


class OperacionTransferenciaSerializer(serializers.Serializer):
    cuenta_origen_id = serializers.IntegerField()
    cuenta_destino_id = serializers.IntegerField()
    importe = serializers.DecimalField(max_digits=12, decimal_places=2)
    concepto = serializers.CharField(max_length=150, required=False, allow_blank=True)

    def validate_importe(self, value):
        if value <= 0:
            raise serializers.ValidationError('El importe debe ser mayor que cero.')
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        usuario = request.user

        try:
            cuenta_origen = Cuenta.objects.get(id=attrs['cuenta_origen_id'])
        except Cuenta.DoesNotExist:
            raise serializers.ValidationError('La cuenta origen no existe.')

        try:
            cuenta_destino = Cuenta.objects.get(id=attrs['cuenta_destino_id'])
        except Cuenta.DoesNotExist:
            raise serializers.ValidationError('La cuenta destino no existe.')

        if cuenta_origen == cuenta_destino:
            raise serializers.ValidationError('La cuenta origen y destino no pueden ser la misma.')

        if not cuenta_origen.activa or not cuenta_destino.activa:
            raise serializers.ValidationError('Ambas cuentas deben estar activas.')

        if not usuario.is_staff and not usuario.is_superuser and cuenta_origen.usuario != usuario:
            raise serializers.ValidationError('No puedes transferir dinero desde una cuenta que no es tuya.')

        if cuenta_origen.saldo < attrs['importe']:
            raise serializers.ValidationError('Saldo insuficiente para realizar la transferencia.')

        attrs['cuenta_origen'] = cuenta_origen
        attrs['cuenta_destino'] = cuenta_destino
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        cuenta_origen = validated_data['cuenta_origen']
        cuenta_destino = validated_data['cuenta_destino']
        importe = validated_data['importe']
        concepto = validated_data.get('concepto', 'Transferencia')

        cuenta_origen.saldo -= importe
        cuenta_destino.saldo += importe

        cuenta_origen.save()
        cuenta_destino.save()

        transferencia = Transferencia.objects.create(
            cuenta_origen=cuenta_origen,
            cuenta_destino=cuenta_destino,
            importe=importe,
            concepto=concepto,
            realizada=True,
        )

        movimiento_origen = Movimiento.objects.create(
            cuenta=cuenta_origen,
            concepto=f'Transferencia enviada: {concepto}',
            importe=importe,
            tipo='transferencia',
            categoria='transferencia',
        )

        movimiento_destino = Movimiento.objects.create(
            cuenta=cuenta_destino,
            concepto=f'Transferencia recibida: {concepto}',
            importe=importe,
            tipo='transferencia',
            categoria='transferencia',
        )

        return {
            'transferencia': transferencia,
            'cuenta_origen': cuenta_origen,
            'cuenta_destino': cuenta_destino,
            'movimiento_origen': movimiento_origen,
            'movimiento_destino': movimiento_destino,
        }