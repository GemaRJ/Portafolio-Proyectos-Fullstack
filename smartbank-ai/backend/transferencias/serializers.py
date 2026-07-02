from rest_framework import serializers
from .models import Transferencia


class TransferenciaSerializer(serializers.ModelSerializer):
    numero_cuenta_origen = serializers.CharField(
        source='cuenta_origen.numero_cuenta',
        read_only=True
    )
    numero_cuenta_destino = serializers.CharField(
        source='cuenta_destino.numero_cuenta',
        read_only=True
    )

    class Meta:
        model = Transferencia
        fields = (
            'id',
            'cuenta_origen',
            'numero_cuenta_origen',
            'cuenta_destino',
            'numero_cuenta_destino',
            'importe',
            'concepto',
            'fecha',
            'realizada',
        )