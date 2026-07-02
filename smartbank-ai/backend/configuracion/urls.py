from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from usuarios.views import UsuarioViewSet
from cuentas.views import CuentaViewSet
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
]