from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Cuenta
from .serializers import CuentaSerializer


class CuentaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cuenta.objects.all().order_by('numero_cuenta')
    serializer_class = CuentaSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo_cuenta', 'activa', 'usuario']
    search_fields = ['numero_cuenta', 'usuario__dni']
    ordering_fields = ['numero_cuenta', 'saldo', 'fecha_creacion']