from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Transferencia
from .serializers import TransferenciaSerializer


class TransferenciaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transferencia.objects.all().order_by('-fecha')
    serializer_class = TransferenciaSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['realizada', 'cuenta_origen', 'cuenta_destino']
    search_fields = [
        'concepto',
        'cuenta_origen__numero_cuenta',
        'cuenta_destino__numero_cuenta',
    ]
    ordering_fields = ['fecha', 'importe', 'realizada']