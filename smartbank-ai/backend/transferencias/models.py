from django.db import models
from cuentas.models import Cuenta


class Transferencia(models.Model):
    cuenta_origen = models.ForeignKey(
        Cuenta,
        on_delete=models.CASCADE,
        related_name='transferencias_enviadas'
    )
    cuenta_destino = models.ForeignKey(
        Cuenta,
        on_delete=models.CASCADE,
        related_name='transferencias_recibidas'
    )
    importe = models.DecimalField(max_digits=12, decimal_places=2)
    concepto = models.CharField(max_length=150, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    realizada = models.BooleanField(default=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.cuenta_origen} → {self.cuenta_destino} | {self.importe} €"