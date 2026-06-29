from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario

    list_display = ('dni', 'nombre', 'apellidos', 'telefono', 'email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('dni', 'nombre', 'apellidos', 'telefono', 'email')
    ordering = ('dni',)

    fieldsets = (
        (None, {'fields': ('dni', 'password')}),
        ('Datos personales', {'fields': ('nombre', 'apellidos', 'telefono', 'email')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('dni', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )