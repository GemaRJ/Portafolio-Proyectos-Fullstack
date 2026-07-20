from django.contrib import admin

from .models import SolicitudProducto


@admin.register(SolicitudProducto)
class SolicitudProductoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'usuario',
        'tipo_producto',
        'estado',
        'importe_solicitado',
        'plazo_meses',
        'fecha_solicitud',
    )

    list_filter = (
        'tipo_producto',
        'estado',
        'fecha_solicitud',
    )

    search_fields = (
        'usuario__dni',
        'usuario__nombre',
        'usuario__apellidos',
        'finalidad',
    )

    readonly_fields = (
        'fecha_solicitud',
        'fecha_actualizacion',
    )