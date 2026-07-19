# SmartBank AI — Backend bancario con Django REST Framework

SmartBank AI es un proyecto backend desarrollado con **Django** y **Django REST Framework** que simula una aplicación bancaria con gestión de usuarios, cuentas, movimientos, transferencias, autenticación por token y operaciones bancarias desde API.

El proyecto forma parte de mi portfolio como desarrolladora Full Stack Junior y está orientado a demostrar conocimientos de backend, APIs REST, seguridad, relaciones entre modelos y lógica bancaria.

---

## Objetivo del proyecto

El objetivo de SmartBank AI es construir un backend bancario funcional y escalable que permita:

- Registrar clientes.
- Autenticar usuarios mediante DNI y contraseña.
- Generar tokens de autenticación.
- Crear automáticamente una cuenta inicial al registrar un cliente.
- Consultar usuarios, cuentas, movimientos y transferencias.
- Aplicar filtros, búsquedas y ordenación en la API.
- Limitar los datos según el usuario autenticado.
- Realizar operaciones bancarias desde la API.
- Registrar trazabilidad mediante movimientos y transferencias.

---

## Estado actual

Backend funcional con:

- Proyecto Django configurado.
- Modelo de usuario personalizado con acceso por DNI.
- Panel de administración de Django.
- API REST con Django REST Framework.
- Autenticación mediante token.
- Permisos por usuario autenticado.
- Filtros, búsquedas y ordenación.
- Registro de cliente con creación automática de cuenta.
- Operaciones bancarias: ingresos, gastos y transferencias.

Frontend funcional con:
- Frontend iniciado con Next.js, TypeScript y Tailwind CSS.
- Portada personalizada de SmartBank AI.
- Rutas base creadas:
  - `/acceso`
  - `/registro`
  - `/panel`
- Panel financiero inicial en construcción.
- Servicio centralizado de rutas API en `src/servicios/api.ts`.
- Preparación inicial para conectar el frontend con Django REST Framework.

---

## Tecnologías utilizadas

- Python
- Django
- Django REST Framework
- Django Filter
- Token Authentication
- SQLite en desarrollo
- CORS Headers
- Git / GitHub
- Visual Studio Code

---

## Estructura del proyecto

```text
smartbank-ai/
│
├── backend/
│   ├── asistente_ia/
│   ├── configuracion/
│   ├── cuentas/
│   ├── movimientos/
│   ├── transferencias/
│   ├── usuarios/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
├── documentacion/
├── capturas/
└── README.md
```

---

## Aplicaciones del backend

### usuarios

Gestiona el usuario personalizado del proyecto.

Características principales:

- Login mediante DNI.
- Registro de clientes.
- Validación de contraseña.
- Token de autenticación.
- Consulta del usuario autenticado.
- Diferenciación entre usuario normal y administrador.

### cuentas

Gestiona las cuentas bancarias.

Características principales:

- Cuenta corriente.
- Cuenta de ahorro.
- Saldo.
- Estado activo/inactivo.
- Relación con usuario.
- Operaciones bancarias desde API.

### movimientos

Gestiona los movimientos bancarios.

Tipos de movimiento:

- Ingreso.
- Gasto.
- Transferencia.
- Bizum.
- Liquidación de cuenta.

Categorías:

- Nómina.
- Alimentación.
- Transporte.
- Ocio.
- Compras.
- Suministros.
- Transferencia.
- Otros.

### transferencias

Gestiona operaciones entre cuentas.

Características principales:

- Cuenta origen.
- Cuenta destino.
- Importe.
- Concepto.
- Estado de realización.
- Trazabilidad mediante movimientos asociados.

### asistente_ia

Aplicación reservada para futuras funcionalidades de inteligencia artificial aplicada al análisis financiero.

---

## Modelo de usuario personalizado

El proyecto utiliza un modelo de usuario personalizado basado en DNI.

En lugar de usar `username`, el campo principal de autenticación es:

```python
USERNAME_FIELD = 'dni'
```

Esto permite un comportamiento más realista para una aplicación bancaria, donde el usuario accede con:

```text
DNI + contraseña
```

---

## API REST

La API permite consultar los principales recursos del sistema.

### Endpoints principales

```text
/api/usuarios/
/api/cuentas/
/api/movimientos/
/api/transferencias/
```

### Endpoints de autenticación

```text
/api/auth/registro/
/api/auth/login/
/api/auth/logout/
/api/auth/me/
```

### Endpoints de operaciones bancarias

```text
/api/operaciones/ingreso/
/api/operaciones/gasto/
/api/operaciones/transferencia/
```

---

## Autenticación

El proyecto utiliza autenticación mediante token.

Cuando un usuario inicia sesión correctamente desde:

```text
/api/auth/login/
```

la API devuelve una respuesta con:

```json
{
  "mensaje": "Login correcto.",
  "token": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "usuario": {
    "id": 1,
    "dni": "12345678A",
    "nombre": "Cliente",
    "apellidos": "Prueba"
  }
}
```

El token se utilizará más adelante desde el frontend para acceder a rutas protegidas.

---

## Registro de cliente

El endpoint:

```text
/api/auth/registro/
```

permite registrar un nuevo cliente.

Ejemplo de petición:

```json
{
  "dni": "11223344C",
  "nombre": "Laura",
  "apellidos": "Garcia Prueba",
  "email": "laura.prueba@example.com",
  "telefono": "600000003",
  "password": "ClienteNuevo2026!",
  "password2": "ClienteNuevo2026!"
}
```

Al registrarse correctamente, el backend:

- Crea el usuario.
- Lo marca como cliente normal.
- Genera un token.
- Crea automáticamente una cuenta corriente inicial.
- Devuelve los datos del usuario y de la cuenta creada.

---

## Permisos por usuario

El proyecto diferencia entre usuarios administradores y usuarios normales.

### Administrador

Puede consultar:

- Todos los usuarios.
- Todas las cuentas.
- Todos los movimientos.
- Todas las transferencias.

### Usuario normal

Solo puede consultar:

- Su propio usuario.
- Sus propias cuentas.
- Los movimientos de sus cuentas.
- Las transferencias donde participe como cuenta origen o destino.

Esto se controla mediante `get_queryset()` en las vistas de la API.

---

## Filtros, búsquedas y ordenación

La API incorpora filtros, búsquedas y ordenación mediante `django-filter` y filtros de Django REST Framework.

Ejemplos:

```text
/api/cuentas/?search=12345678A
/api/cuentas/?tipo_cuenta=corriente
/api/cuentas/?ordering=-saldo
/api/movimientos/?tipo=gasto
/api/movimientos/?categoria=alimentacion
/api/movimientos/?search=nomina
/api/movimientos/?ordering=-importe
/api/transferencias/?realizada=true
/api/transferencias/?search=ahorro
```

---

## Operaciones bancarias

### Ingreso

Endpoint:

```text
/api/operaciones/ingreso/
```

Ejemplo:

```json
{
  "cuenta_id": 5,
  "importe": "500.00",
  "concepto": "Ingreso de prueba",
  "categoria": "otros"
}
```

Resultado:

- Suma el importe al saldo.
- Crea un movimiento de tipo ingreso.

---

### Gasto

Endpoint:

```text
/api/operaciones/gasto/
```

Ejemplo:

```json
{
  "cuenta_id": 5,
  "importe": "75.50",
  "concepto": "Compra online prueba",
  "categoria": "compras"
}
```

Resultado:

- Comprueba saldo suficiente.
- Resta el importe al saldo.
- Crea un movimiento de tipo gasto.

---

### Transferencia

Endpoint:

```text
/api/operaciones/transferencia/
```

Ejemplo:

```json
{
  "cuenta_origen_id": 5,
  "cuenta_destino_id": 1,
  "importe": "100.00",
  "concepto": "Transferencia de prueba"
}
```

Resultado:

- Resta saldo de la cuenta origen.
- Suma saldo a la cuenta destino.
- Crea un registro de transferencia.
- Crea un movimiento en la cuenta origen.
- Crea un movimiento en la cuenta destino.

---

## Seguridad y buenas prácticas

El proyecto aplica varias buenas prácticas:

- Contraseñas gestionadas con el sistema seguro de Django.
- No se exponen contraseñas en la API.
- Registro con validación de contraseña.
- Usuarios registrados como clientes, no como administradores.
- Autenticación mediante token.
- Endpoints protegidos con `IsAuthenticated`.
- Permisos por usuario autenticado.
- Validación de saldo suficiente.
- Validación de cuentas activas.
- Uso de `transaction.atomic` en operaciones críticas.
- Base de datos local excluida de GitHub.
- Datos ficticios para pruebas.

---

## Instalación del proyecto en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/GemaRJ/Portafolio-Proyectos-Fullstack.git
```

### 2. Entrar en la carpeta del backend

```bash
cd Portafolio-Proyectos-Fullstack/smartbank-ai/backend
```

### 3. Crear entorno virtual

```bash
python -m venv .venv
```

### 4. Activar entorno virtual

En Windows:

```bash
.venv\Scripts\activate
```

### 5. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 6. Ejecutar migraciones

```bash
python manage.py migrate
```

### 7. Crear superusuario

```bash
python manage.py createsuperuser
```

El sistema solicitará un DNI y una contraseña.

### 8. Arrancar servidor

```bash
python manage.py runserver
```

Abrir en el navegador:

```text
http://127.0.0.1:8000/
```

---

## Panel de administración

El panel de administración está disponible en:

```text
http://127.0.0.1:8000/admin/
```

Desde ahí se pueden gestionar:

- Usuarios.
- Cuentas.
- Movimientos.
- Transferencias.
- Tokens de autenticación.

---

## Pruebas realizadas

Se han probado correctamente:

- Creación del backend Django.
- Modelo de usuario personalizado.
- Acceso al panel admin con DNI.
- API REST de usuarios, cuentas, movimientos y transferencias.
- Filtros, búsquedas y ordenación.
- Permisos por usuario autenticado.
- Registro de cliente desde API.
- Creación automática de cuenta inicial.
- Login con token.
- Consulta de usuario autenticado.
- Ingreso desde API.
- Gasto desde API.
- Transferencia desde API.
- Actualización automática de saldos.
- Creación automática de movimientos.

---

## Fases del desarrollo

### Fase 1

Creación del backend con Django, entorno virtual, dependencias, apps internas y configuración inicial.

### Fase 2

Creación de modelos bancarios, usuario personalizado por DNI y panel de administración.

### Fase 3

Creación de API REST con serializers, views, routers y URLs.

### Fase 4

Añadidos filtros, búsquedas, ordenación y permisos básicos.

### Fase 5

Limitación de datos por usuario autenticado.

### Fase 6

Registro, login, logout y usuario autenticado mediante Token Authentication.

### Fase 7

Registro de cliente con creación automática de cuenta corriente inicial.

### Fase 8

Operaciones bancarias desde API: ingreso, gasto y transferencia.

---

## Próximas mejoras

Posibles mejoras futuras:

- Crear frontend con React o Next.js.
- Añadir dashboard visual para clientes.
- Añadir historial de operaciones.
- Mejorar endpoints de transferencia.
- Añadir paginación.
- Añadir tests unitarios.
- Añadir documentación con Swagger/OpenAPI.
- Añadir integración de IA para análisis financiero.
- Conectar con Power BI en un proyecto complementario SmartBank BI.

---

## Proyecto complementario futuro

Más adelante, este proyecto podrá conectarse con **SmartBank BI**, un dashboard financiero con SQL + Power BI para analizar ingresos, gastos, saldo, ahorro mensual, categorías de consumo y evolución financiera.

---

## Autora

**Gema Rodríguez Jorge**

Desarrolladora Full Stack Junior en formación continua, con experiencia previa en soporte técnico y funcional en entorno bancario, actualmente orientando su perfil profesional hacia desarrollo web, backend, APIs, datos e inteligencia artificial aplicada.
