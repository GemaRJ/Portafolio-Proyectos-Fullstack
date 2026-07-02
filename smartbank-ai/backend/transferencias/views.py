from rest_framework import viewsets
from .models import Transferencia
from .serializers import TransferenciaSerializer


class TransferenciaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transferencia.objects.all().order_by('-fecha')
    serializer_class = TransferenciaSerializer