from rest_framework import serializers

from cuentas.models import Cuenta
from .models import SolicitudProducto


class SolicitudProductoSerializer(serializers.ModelSerializer):
    usuario_dni = serializers.CharField(source='usuario.dni', read_only=True)

    tipo_producto_nombre = serializers.CharField(
        source='get_tipo_producto_display',
        read_only=True
    )

    estado_nombre = serializers.CharField(
        source='get_estado_display',
        read_only=True
    )

    numero_cuenta_asociada = serializers.CharField(
        source='cuenta_asociada.numero_cuenta',
        read_only=True
    )

    class Meta:
        model = SolicitudProducto
        fields = (
            'id',
            'usuario',
            'usuario_dni',
            'tipo_producto',
            'tipo_producto_nombre',
            'estado',
            'estado_nombre',
            'importe_solicitado',
            'plazo_meses',
            'finalidad',
            'cuenta_asociada',
            'numero_cuenta_asociada',
            'datos_extra',
            'fecha_solicitud',
            'fecha_actualizacion',
        )

        read_only_fields = (
            'id',
            'usuario',
            'usuario_dni',
            'estado',
            'estado_nombre',
            'tipo_producto_nombre',
            'numero_cuenta_asociada',
            'fecha_solicitud',
            'fecha_actualizacion',
        )

    def validate_cuenta_asociada(self, cuenta):
        request = self.context.get('request')

        if cuenta and request and not request.user.is_staff:
            pertenece_al_usuario = Cuenta.objects.filter(
                id=cuenta.id,
                usuario=request.user
            ).exists()

            if not pertenece_al_usuario:
                raise serializers.ValidationError(
                    'La cuenta asociada no pertenece al usuario autenticado.'
                )

        return cuenta

    def validate(self, attrs):
        tipo_producto = attrs.get('tipo_producto')
        importe_solicitado = attrs.get('importe_solicitado')
        plazo_meses = attrs.get('plazo_meses')

        if tipo_producto == 'prestamo_online':
            if not importe_solicitado:
                raise serializers.ValidationError({
                    'importe_solicitado': 'El importe es obligatorio para solicitar un préstamo.'
                })

            if not plazo_meses:
                raise serializers.ValidationError({
                    'plazo_meses': 'El plazo es obligatorio para solicitar un préstamo.'
                })

        if tipo_producto == 'tarjeta':
            if not attrs.get('cuenta_asociada'):
                raise serializers.ValidationError({
                    'cuenta_asociada': 'La cuenta asociada es obligatoria para solicitar una tarjeta.'
                })

        return attrs