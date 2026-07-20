from django.conf import settings
from django.db import models

from cuentas.models import Cuenta


class SolicitudProducto(models.Model):
    TIPO_PRODUCTO_CHOICES = [
        ('prestamo_online', 'Préstamo online'),
        ('tarjeta', 'Tarjeta'),
        ('cuenta_adicional', 'Cuenta adicional'),
        ('cuenta_ahorro', 'Cuenta de ahorro'),
        ('cuenta_menor', 'Cuenta menor de edad'),
    ]

    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_estudio', 'En estudio'),
        ('aprobada', 'Aprobada'),
        ('rechazada', 'Rechazada'),
        ('cancelada', 'Cancelada'),
    ]

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='solicitudes_productos'
    )

    tipo_producto = models.CharField(
        max_length=30,
        choices=TIPO_PRODUCTO_CHOICES
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='pendiente'
    )

    importe_solicitado = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    plazo_meses = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    finalidad = models.CharField(
        max_length=200,
        blank=True
    )

    cuenta_asociada = models.ForeignKey(
        Cuenta,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='solicitudes_productos'
    )

    datos_extra = models.JSONField(
        default=dict,
        blank=True
    )

    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-fecha_solicitud']
        verbose_name = 'Solicitud de producto'
        verbose_name_plural = 'Solicitudes de productos'

    def __str__(self):
        return f"{self.get_tipo_producto_display()} - {self.usuario.dni} - {self.estado}"