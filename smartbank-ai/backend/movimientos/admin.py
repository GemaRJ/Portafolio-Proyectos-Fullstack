from django.contrib import admin
from .models import Movimiento


@admin.register(Movimiento)
class MovimientoAdmin(admin.ModelAdmin):
    list_display = ('concepto', 'cuenta', 'importe', 'tipo', 'categoria', 'fecha')
    list_filter = ('tipo', 'categoria', 'fecha')
    search_fields = ('concepto', 'cuenta__numero_cuenta')