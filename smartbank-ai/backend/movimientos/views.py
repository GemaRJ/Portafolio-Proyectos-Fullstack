from rest_framework import viewsets
from .models import Movimiento
from .serializers import MovimientoSerializer


class MovimientoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movimiento.objects.all().order_by('-fecha')
    serializer_class = MovimientoSerializer