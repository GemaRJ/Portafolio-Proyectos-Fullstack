from django.db.models import Q
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Transferencia
from .serializers import TransferenciaSerializer


class TransferenciaViewSet(viewsets.ReadOnlyModelViewSet):
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

    def get_queryset(self):
        usuario = self.request.user
        transferencias = Transferencia.objects.all().order_by('-fecha')

        if usuario.is_staff or usuario.is_superuser:
            return transferencias

        return transferencias.filter(
            Q(cuenta_origen__usuario=usuario) |
            Q(cuenta_destino__usuario=usuario)
        )