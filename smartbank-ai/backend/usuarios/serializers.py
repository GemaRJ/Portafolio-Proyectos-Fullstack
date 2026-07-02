from rest_framework import serializers
from .models import Usuario


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