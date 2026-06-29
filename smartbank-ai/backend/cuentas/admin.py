from django.contrib import admin
from .models import Cuenta


@admin.register(Cuenta)
class CuentaAdmin(admin.ModelAdmin):
    list_display = ('numero_cuenta', 'usuario', 'tipo_cuenta', 'saldo', 'activa', 'fecha_creacion')
    list_filter = ('tipo_cuenta', 'activa')
    search_fields = ('numero_cuenta', 'usuario__username')