from rest_framework import viewsets
from .models import Usuario
from .serializers import UsuarioSerializer


class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Usuario.objects.all().order_by('dni')
    serializer_class = UsuarioSerializer