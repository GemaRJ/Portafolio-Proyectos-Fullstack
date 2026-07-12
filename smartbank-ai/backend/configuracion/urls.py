from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from usuarios.views import (
    UsuarioViewSet,
    RegistroUsuarioView,
    LoginUsuarioView,
    LogoutUsuarioView,
    UsuarioActualView,
)
from cuentas.views import (
    CuentaViewSet,
    IngresoView,
    GastoView,
    OperacionTransferenciaView,
)
from movimientos.views import MovimientoViewSet
from transferencias.views import TransferenciaViewSet


router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')
router.register(r'cuentas', CuentaViewSet, basename='cuentas')
router.register(r'movimientos', MovimientoViewSet, basename='movimientos')
router.register(r'transferencias', TransferenciaViewSet, basename='transferencias')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Login y logout para la API REST navegable
    path('api-auth/', include('rest_framework.urls')),

    # Endpoints de autenticación para futuro frontend
    path('api/auth/registro/', RegistroUsuarioView.as_view(), name='api-registro'),
    path('api/auth/login/', LoginUsuarioView.as_view(), name='api-login'),
    path('api/auth/logout/', LogoutUsuarioView.as_view(), name='api-logout'),
    path('api/auth/me/', UsuarioActualView.as_view(), name='api-me'),

    # Operaciones bancarias
    path('api/operaciones/ingreso/', IngresoView.as_view(), name='api-ingreso'),
    path('api/operaciones/gasto/', GastoView.as_view(), name='api-gasto'),
    path('api/operaciones/transferencia/', OperacionTransferenciaView.as_view(), name='api-transferencia-operacion'),

    # Documentación de la API
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]