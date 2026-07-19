from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django_filters.rest_framework import DjangoFilterBackend

from cuentas.serializers import CuentaSerializer
from .models import Usuario
from .serializers import (
    UsuarioSerializer,
    RegistroUsuarioSerializer,
    LoginUsuarioSerializer,
)


class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_staff']
    search_fields = ['dni', 'nombre', 'apellidos', 'email', 'telefono']
    ordering_fields = ['dni', 'nombre', 'apellidos', 'fecha_alta']

    def get_queryset(self):
        usuario = self.request.user

        if usuario.is_staff or usuario.is_superuser:
            return Usuario.objects.all().order_by('dni')

        return Usuario.objects.filter(id=usuario.id)


class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistroUsuarioSerializer(data=request.data)

        if serializer.is_valid():
            usuario = serializer.save()
            token, created = Token.objects.get_or_create(user=usuario)

            cuenta_inicial = getattr(usuario, 'cuenta_inicial', None)

            return Response(
                {
                    'mensaje': 'Usuario registrado correctamente.',
                    'token': token.key,
                    'usuario': UsuarioSerializer(usuario).data,
                    'cuenta_inicial': CuentaSerializer(cuenta_inicial).data if cuenta_inicial else None,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUsuarioView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginUsuarioSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            usuario = serializer.validated_data['usuario']
            token, created = Token.objects.get_or_create(user=usuario)

            return Response(
                {
                    'mensaje': 'Login correcto.',
                    'token': token.key,
                    'usuario': UsuarioSerializer(usuario).data,
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response(
                {'mensaje': 'Sesión cerrada correctamente.'},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {'mensaje': 'No había token activo o ya fue eliminado.'},
                status=status.HTTP_200_OK
            )


class UsuarioActualView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UsuarioSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)