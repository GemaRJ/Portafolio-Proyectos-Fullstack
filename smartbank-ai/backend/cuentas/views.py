from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse

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

    @extend_schema(
        tags=['operaciones'],
        summary='Realizar ingreso',
        description='Permite realizar un ingreso de dinero en una cuenta bancaria. Actualiza el saldo y crea un movimiento asociado.',
        request=IngresoSerializer,
        responses={
            201: OpenApiResponse(description='Ingreso realizado correctamente.'),
            400: OpenApiResponse(description='Error de validación.'),
            401: OpenApiResponse(description='Usuario no autenticado.'),
        },
        examples=[
            OpenApiExample(
                'Ejemplo de ingreso',
                value={
                    'cuenta_id': 5,
                    'importe': '500.00',
                    'concepto': 'Ingreso de prueba fase 9',
                    'categoria': 'otros',
                },
                request_only=True,
            ),
        ],
    )
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

    @extend_schema(
        tags=['operaciones'],
        summary='Registrar gasto',
        description='Permite registrar un gasto en una cuenta bancaria. Comprueba saldo suficiente, actualiza el saldo y crea un movimiento asociado.',
        request=GastoSerializer,
        responses={
            201: OpenApiResponse(description='Gasto registrado correctamente.'),
            400: OpenApiResponse(description='Error de validación o saldo insuficiente.'),
            401: OpenApiResponse(description='Usuario no autenticado.'),
        },
        examples=[
            OpenApiExample(
                'Ejemplo de gasto',
                value={
                    'cuenta_id': 5,
                    'importe': '75.50',
                    'concepto': 'Compra online prueba fase 9',
                    'categoria': 'compras',
                },
                request_only=True,
            ),
        ],
    )
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

    @extend_schema(
        tags=['operaciones'],
        summary='Realizar transferencia',
        description='Permite realizar una transferencia entre dos cuentas. Actualiza los saldos, crea un registro de transferencia y genera movimientos asociados en origen y destino.',
        request=OperacionTransferenciaSerializer,
        responses={
            201: OpenApiResponse(description='Transferencia realizada correctamente.'),
            400: OpenApiResponse(description='Error de validación o saldo insuficiente.'),
            401: OpenApiResponse(description='Usuario no autenticado.'),
        },
        examples=[
            OpenApiExample(
                'Ejemplo de transferencia',
                value={
                    'cuenta_origen_id': 5,
                    'cuenta_destino_id': 1,
                    'importe': '100.00',
                    'concepto': 'Transferencia prueba fase 9',
                },
                request_only=True,
            ),
        ],
    )
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