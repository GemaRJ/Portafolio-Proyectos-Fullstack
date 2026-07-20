from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import SolicitudProducto
from .serializers import SolicitudProductoSerializer


class SolicitudProductoViewSet(viewsets.ModelViewSet):
    serializer_class = SolicitudProductoSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        'tipo_producto',
        'estado',
        'finalidad',
        'usuario__dni',
    ]

    ordering_fields = [
        'fecha_solicitud',
        'estado',
        'tipo_producto',
        'importe_solicitado',
    ]

    ordering = ['-fecha_solicitud']

    def get_queryset(self):
        usuario = self.request.user

        if usuario.is_staff:
            return SolicitudProducto.objects.all()

        return SolicitudProducto.objects.filter(usuario=usuario)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user, estado='pendiente')