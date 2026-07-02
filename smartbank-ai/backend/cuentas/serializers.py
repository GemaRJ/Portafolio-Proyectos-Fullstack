from rest_framework import serializers
from .models import Cuenta


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