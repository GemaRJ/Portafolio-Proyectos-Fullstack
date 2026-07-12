from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Cuenta
from .serializers import (
    CuentaSerializer,
    IngresoSerializer,
    GastoSerializer,
    OperacionTransferenciaSerializer,
)
from movimientos.serializers import MovimientoSerializer
from transferencias.serializers import TransferenciaSerializer


class CuentaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CuentaSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo_cuenta', 'activa', 'usuario']
    search_fields = ['numero_cuenta', 'usuario__dni']
    ordering_fields = ['numero_cuenta', 'saldo', 'fecha_creacion']

    def get_queryset(self):
        usuario = self.request.user
        cuentas = Cuenta.objects.all().order_by('numero_cuenta')

        if usuario.is_staff or usuario.is_superuser:
            return cuentas

        return cuentas.filter(usuario=usuario)


class IngresoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = IngresoSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            resultado = serializer.save()

            return Response(
                {
                    'mensaje': 'Ingreso realizado correctamente.',
                    'cuenta': CuentaSerializer(resultado['cuenta']).data,
                    'movimiento': MovimientoSerializer(resultado['movimiento']).data,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GastoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GastoSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            resultado = serializer.save()

            return Response(
                {
                    'mensaje': 'Gasto registrado correctamente.',
                    'cuenta': CuentaSerializer(resultado['cuenta']).data,
                    'movimiento': MovimientoSerializer(resultado['movimiento']).data,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OperacionTransferenciaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OperacionTransferenciaSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            resultado = serializer.save()

            return Response(
                {
                    'mensaje': 'Transferencia realizada correctamente.',
                    'transferencia': TransferenciaSerializer(resultado['transferencia']).data,
                    'cuenta_origen': CuentaSerializer(resultado['cuenta_origen']).data,
                    'cuenta_destino': CuentaSerializer(resultado['cuenta_destino']).data,
                    'movimiento_origen': MovimientoSerializer(resultado['movimiento_origen']).data,
                    'movimiento_destino': MovimientoSerializer(resultado['movimiento_destino']).data,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)