from rest_framework import serializers
from .models import Movimiento


class MovimientoSerializer(serializers.ModelSerializer):
    numero_cuenta = serializers.CharField(source='cuenta.numero_cuenta', read_only=True)

    class Meta:
        model = Movimiento
        fields = (
            'id',
            'cuenta',
            'numero_cuenta',
            'concepto',
            'importe',
            'tipo',
            'categoria',
            'fecha',
        )