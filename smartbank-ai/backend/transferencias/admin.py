from django.contrib import admin
from .models import Transferencia


@admin.register(Transferencia)
class TransferenciaAdmin(admin.ModelAdmin):
    list_display = ('cuenta_origen', 'cuenta_destino', 'importe', 'concepto', 'fecha', 'realizada')
    list_filter = ('realizada', 'fecha')
    search_fields = ('cuenta_origen__numero_cuenta', 'cuenta_destino__numero_cuenta', 'concepto')