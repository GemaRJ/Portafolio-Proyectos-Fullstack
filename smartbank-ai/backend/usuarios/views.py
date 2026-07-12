from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Usuario
from .serializers import UsuarioSerializer


class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Usuario.objects.all().order_by('dni')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_staff']
    search_fields = ['dni', 'nombre', 'apellidos', 'email', 'telefono']
    ordering_fields = ['dni', 'nombre', 'apellidos', 'fecha_alta']