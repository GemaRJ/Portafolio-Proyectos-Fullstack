from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator
from django.db import models


class UsuarioManager(BaseUserManager):
    def create_user(self, dni, password=None, **extra_fields):
        if not dni:
            raise ValueError('El DNI es obligatorio.')

        dni = dni.upper()
        user = self.model(dni=dni, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, dni, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self.create_user(dni, password, **extra_fields)


class Usuario(AbstractUser):
    username = None

    dni_validator = RegexValidator(
        regex=r'^[0-9]{8}[A-Za-z]$',
        message='El DNI debe tener 8 números y una letra. Ejemplo: 12345678X'
    )

    dni = models.CharField(
        max_length=9,
        unique=True,
        validators=[dni_validator]
    )

    nombre = models.CharField(max_length=100, blank=True)
    apellidos = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True)
    telefono = models.CharField(max_length=15, blank=True)
    fecha_alta = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'dni'
    REQUIRED_FIELDS = []

    objects = UsuarioManager()

    def save(self, *args, **kwargs):
        if self.dni:
            self.dni = self.dni.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.dni