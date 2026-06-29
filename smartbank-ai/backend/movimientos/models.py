from django.db import models
from cuentas.models import Cuenta


class Movimiento(models.Model):
    TIPO_MOVIMIENTO_CHOICES = [
        ('ingreso', 'Ingreso'),
        ('gasto', 'Gasto'),
        ('transferencia', 'Transferencia'),
        ('bizum', 'Bizum'),
        ('liquidacion_cuenta', 'Liquidación de cuenta'),
    ]

    CATEGORIA_CHOICES = [
        ('nomina', 'Nómina'),
        ('alimentacion', 'Alimentación'),
        ('transporte', 'Transporte'),
        ('ocio', 'Ocio'),
        ('compras', 'Compras'),
        ('suministros', 'Suministros'),
        ('transferencia', 'Transferencia'),
        ('otros', 'Otros'),
    ]

    cuenta = models.ForeignKey(
        Cuenta,
        on_delete=models.CASCADE,
        related_name='movimientos'
    )
    concepto = models.CharField(max_length=150)
    importe = models.DecimalField(max_digits=12, decimal_places=2)
    tipo = models.CharField(max_length=30, choices=TIPO_MOVIMIENTO_CHOICES)
    categoria = models.CharField(
        max_length=30,
        choices=CATEGORIA_CHOICES,
        default='otros'
    )
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.concepto} - {self.importe} €"