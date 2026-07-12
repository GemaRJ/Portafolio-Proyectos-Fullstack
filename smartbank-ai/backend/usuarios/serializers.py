from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from cuentas.models import Cuenta
from .models import Usuario


def generar_numero_cuenta_ficticio():
    ultimo = Cuenta.objects.order_by('-id').first()
    siguiente = 1 if ultimo is None else ultimo.id + 1

    while True:
        numero_cuenta = f"ES{siguiente:022d}"

        if not Cuenta.objects.filter(numero_cuenta=numero_cuenta).exists():
            return numero_cuenta

        siguiente += 1


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = (
            'id',
            'dni',
            'nombre',
            'apellidos',
            'email',
            'telefono',
            'fecha_alta',
            'is_active',
        )


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = (
            'id',
            'dni',
            'nombre',
            'apellidos',
            'email',
            'telefono',
            'password',
            'password2',
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                'password': 'Las contraseñas no coinciden.'
            })

        validate_password(attrs['password'])
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')

        usuario = Usuario.objects.create_user(
            dni=validated_data.get('dni'),
            password=password,
            nombre=validated_data.get('nombre', ''),
            apellidos=validated_data.get('apellidos', ''),
            email=validated_data.get('email', ''),
            telefono=validated_data.get('telefono', ''),
        )

        usuario.is_staff = False
        usuario.is_superuser = False
        usuario.save()

        cuenta_inicial = Cuenta.objects.create(
            usuario=usuario,
            numero_cuenta=generar_numero_cuenta_ficticio(),
            tipo_cuenta='corriente',
            saldo=0,
            activa=True,
        )

        usuario.cuenta_inicial = cuenta_inicial

        return usuario


class LoginUsuarioSerializer(serializers.Serializer):
    dni = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        dni = attrs.get('dni')
        password = attrs.get('password')

        usuario = authenticate(
            request=self.context.get('request'),
            username=dni,
            password=password
        )

        if not usuario:
            raise serializers.ValidationError(
                'DNI o contraseña incorrectos.'
            )

        if not usuario.is_active:
            raise serializers.ValidationError(
                'El usuario está desactivado.'
            )

        attrs['usuario'] = usuario
        return attrs