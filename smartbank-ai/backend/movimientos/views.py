from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Movimiento
from .serializers import MovimientoSerializer


class MovimientoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movimiento.objects.all().order_by('-fecha')
    serializer_class = MovimientoSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'categoria', 'cuenta']
    search_fields = ['concepto', 'cuenta__numero_cuenta', 'cuenta__usuario__dni']
    ordering_fields = ['fecha', 'importe', 'tipo', 'categoria']