from django.db import models
from django.contrib.auth.models import User


class Cuenta(models.Model):
    TIPO_CUENTA_CHOICES = [
        ('corriente', 'Cuenta corriente'),
        ('ahorro', 'Cuenta de ahorro'),
    ]

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='cuentas'
    )
    numero_cuenta = models.CharField(max_length=24, unique=True)
    tipo_cuenta = models.CharField(
        max_length=20,
        choices=TIPO_CUENTA_CHOICES,
        default='corriente'
    )
    saldo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.numero_cuenta} - {self.usuario.username}"