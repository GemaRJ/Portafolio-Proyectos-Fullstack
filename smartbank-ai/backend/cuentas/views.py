from rest_framework import viewsets
from .models import Cuenta
from .serializers import CuentaSerializer


class CuentaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cuenta.objects.all().order_by('numero_cuenta')
    serializer_class = CuentaSerializer