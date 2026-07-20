# SmartBank AI — Aplicación bancaria Full-Stack con Django, Next.js e IA

SmartBank AI es una aplicación bancaria Full-Stack desarrollada con **Django REST Framework**, **Next.js**, **TypeScript** y **Tailwind CSS**.

El proyecto simula una banca digital moderna con autenticación por DNI, gestión de cuentas, movimientos, transferencias, operaciones bancarias reales desde frontend, área personal editable, contratación de productos bancarios, conversor de divisas conectado a una API externa y chatbot financiero conectado al backend.

Forma parte de mi portafolio como desarrolladora Full Stack Junior y está orientado a demostrar conocimientos de backend, frontend, APIs REST, autenticación, permisos, seguridad, lógica bancaria, consumo de servicios externos e integración progresiva de inteligencia artificial aplicada al análisis financiero.

---

## Objetivo del proyecto

El objetivo de SmartBank AI es construir una aplicación bancaria funcional que permita:

- Registrar clientes.
- Iniciar sesión mediante DNI y contraseña.
- Generar y utilizar tokens de autenticación.
- Crear automáticamente una cuenta inicial al registrar un cliente.
- Consultar cuentas, movimientos y transferencias.
- Limitar los datos según el usuario autenticado.
- Realizar ingresos, gastos y transferencias reales desde el frontend.
- Actualizar datos personales desde el área privada.
- Consultar un cambio de divisa en tiempo real mediante una API externa.
- Solicitar productos bancarios desde el área privada.
- Registrar solicitudes de productos en Django REST Framework.
- Consultar el estado de las solicitudes del usuario autenticado.
- Mostrar productos o solicitudes asociadas a una cuenta concreta.
- Utilizar un chatbot financiero conectado al backend.
- Evolucionar el chatbot hacia un asistente inteligente capaz de guiar al usuario por el panel y realizar consultas personalizadas.

---

## Estado actual

### Backend funcional

- Proyecto Django configurado.
- Modelo de usuario personalizado con acceso por DNI.
- Panel de administración de Django.
- API REST con Django REST Framework.
- Autenticación mediante token.
- Permisos por usuario autenticado.
- Filtros, búsquedas y ordenación.
- Registro de cliente con creación automática de cuenta.
- Modelos de usuarios, cuentas, movimientos y transferencias.
- Operaciones bancarias:
  - Ingresos.
  - Gastos.
  - Transferencias.
- Actualización automática de saldos.
- Creación automática de movimientos asociados.
- Validaciones de saldo, cuenta activa y permisos.
- Uso de transacciones con `transaction.atomic` para operaciones críticas.
- Endpoint de usuario autenticado.
- Edición de datos personales mediante `PATCH`.
- Documentación Swagger/OpenAPI.
- App `asistente_ia` para consultas financieras.
- Endpoint propio para el asistente financiero.
- App `contratacion` para solicitudes de productos bancarios.
- Modelo `SolicitudProducto`.
- Serializer y ViewSet para solicitudes de productos.
- Solicitudes protegidas por usuario autenticado.
- Estado inicial automático de solicitudes como `pendiente`.
- Validaciones específicas según el producto solicitado.
- Gestión de solicitudes desde el panel de administración.

### Frontend funcional

- Frontend desarrollado con Next.js, TypeScript y Tailwind CSS.
- Pantalla de acceso conectada al backend.
- Pantalla de registro conectada al backend.
- Panel financiero visual e interactivo.
- Navegación por secciones:
  - Resumen.
  - Movimientos.
  - Operaciones.
  - Cambio Divisa.
  - Menú.
- Selección de cuentas.
- Historial de movimientos por cuenta.
- Operaciones reales desde frontend:
  - Ingresos.
  - Gastos.
  - Transferencias.
- Transferencias con selección de cuenta destino mediante desplegable.
- Área personal editable.
- Gestión de sesión mediante token en `localStorage`.
- Menú de contratación conectado al backend.
- Formularios dinámicos según el producto seleccionado.
- Solicitud de productos bancarios:
  - Préstamo online.
  - Tarjeta asociada a una cuenta.
  - Cuenta adicional.
  - Cuenta de ahorro.
  - Cuenta menor de edad.
- Sección `Mis solicitudes`.
- Visualización del estado de cada solicitud.
- Visualización de productos o solicitudes asociadas a una cuenta desde el resumen.
- Conversor de divisas conectado a API externa.
- Chatbot financiero flotante conectado a Django.
- Servicio centralizado de rutas API en `src/servicios/api.ts`.

---

## Tecnologías utilizadas

### Backend

- Python
- Django
- Django REST Framework
- Django Filter
- Token Authentication
- drf-spectacular
- django-cors-headers
- SQLite en desarrollo
- API REST
- Swagger / OpenAPI

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Fetch API
- LocalStorage

### Herramientas

- Git
- GitHub
- Visual Studio Code
- Swagger / OpenAPI
- Navegador para pruebas de API
- Terminal PowerShell

---

## Estructura del proyecto

```text
smartbank-ai/
│
├── backend/
│   ├── asistente_ia/
│   ├── configuracion/
│   ├── contratacion/
│   ├── cuentas/
│   ├── movimientos/
│   ├── transferencias/
│   ├── usuarios/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── acceso/
│   │   │   ├── panel/
│   │   │   └── registro/
│   │   │
│   │   ├── componentes/
│   │   │   └── ChatbotFinanciero.tsx
│   │   │
│   │   └── servicios/
│   │       └── api.ts
│   │
│   └── package.json
│
├── documentacion/
├── capturas/
└── README.md
```

---

## Funcionalidades principales

### Autenticación y usuarios

- Registro de clientes desde frontend y API.
- Inicio de sesión mediante DNI y contraseña.
- Generación de token de autenticación.
- Cierre de sesión.
- Consulta del usuario autenticado.
- Actualización de datos personales desde el área privada.
- Restricción de datos según el usuario conectado.

### Cuentas bancarias

- Creación automática de cuenta inicial al registrar un cliente.
- Consulta de cuentas del usuario autenticado.
- Selección de cuenta activa desde el panel.
- Visualización de saldo disponible.
- Visualización de saldo total.
- Preparación de saldo contable y retenciones para futuras fases.

### Movimientos

- Consulta de movimientos.
- Filtrado visual de movimientos por cuenta.
- Clasificación por tipo:
  - Ingreso.
  - Gasto.
  - Transferencia.
  - Bizum.
  - Liquidación de cuenta.
- Visualización de fecha, concepto, categoría e importe.

### Operaciones bancarias

- Ingreso real desde frontend.
- Gasto real desde frontend.
- Transferencia real entre cuentas.
- Selección de cuenta origen.
- Selección de cuenta destino mediante desplegable.
- Validación de importe.
- Validación de saldo suficiente.
- Validación de cuenta activa.
- Actualización automática de saldos.
- Registro automático de movimientos asociados.

### Área personal

- Visualización de datos del cliente.
- DNI como campo de solo lectura.
- Edición de:
  - Nombre.
  - Apellidos.
  - Email.
  - Teléfono.
- Actualización mediante petición `PATCH` al backend.

### Contratación de productos bancarios

El menú de contratación permite solicitar productos desde el área privada del cliente.

Productos disponibles:

- Préstamo online.
- Tarjeta.
- Cuenta adicional.
- Cuenta de ahorro.
- Cuenta menor de edad.

Cada producto muestra un formulario adaptado a sus necesidades.

Por ejemplo:

- El préstamo solicita importe, plazo y finalidad.
- La tarjeta solicita tipo de tarjeta, cuenta asociada y límite opcional.
- La cuenta adicional solicita motivo de apertura.
- La cuenta de ahorro solicita objetivo de ahorro y aportación inicial.
- La cuenta menor solicita datos del menor y relación con el titular.

Las solicitudes se registran en el backend mediante Django REST Framework y quedan asociadas al usuario autenticado.

También se muestra una sección llamada `Mis solicitudes`, donde el usuario puede consultar:

- Tipo de producto solicitado.
- Número de solicitud.
- Fecha de solicitud.
- Estado.
- Importe, si existe.
- Plazo, si existe.
- Cuenta asociada, si existe.

Los estados disponibles son:

- Pendiente.
- En estudio.
- Aprobada.
- Rechazada.
- Cancelada.

### Productos asociados en resumen

El resumen del panel muestra también solicitudes o productos asociados a la cuenta seleccionada.

Esto permite visualizar, por ejemplo, una solicitud de tarjeta asociada a una cuenta concreta.

Actualmente las tarjetas se representan como solicitudes de producto. En una futura fase se podrá crear un modelo específico de tarjetas activas.

### Cambio de divisa

El panel incluye un conversor de divisas conectado a una API externa.

Permite convertir desde EUR a:

- USD.
- GBP.
- MXN.

El conversor obtiene el tipo de cambio disponible desde un servicio externo y muestra el valor estimado en tiempo real.

### Chatbot financiero

SmartBank AI incluye un chatbot financiero flotante conectado al backend de Django.

El chatbot permite realizar consultas sobre:

- Saldo total.
- Gastos del mes.
- Ingresos del mes.
- Categoría con mayor gasto.
- Recomendaciones básicas de ahorro.

Actualmente funciona como primera versión de asistente financiero propio.

La siguiente evolución será permitir que el chatbot pueda guiar al usuario por las distintas secciones del panel y realizar consultas más personalizadas.

---

## Endpoints principales

```text
/api/usuarios/
/api/cuentas/
/api/movimientos/
/api/transferencias/
/api/operaciones/ingreso/
/api/operaciones/gasto/
/api/operaciones/transferencia/
/api/auth/registro/
/api/auth/login/
/api/auth/logout/
/api/auth/me/
/api/asistente/consulta/
/api/solicitudes-productos/
/api/schema/
/api/docs/
/api/redoc/
```

---

## Documentación de API

La API está documentada mediante Swagger/OpenAPI.

En entorno local se puede consultar desde:

```text
http://127.0.0.1:8000/api/docs/
```

También existe documentación alternativa en Redoc:

```text
http://127.0.0.1:8000/api/redoc/
```

---

## Ejecución en local

### Backend

Desde la carpeta del backend:

```powershell
cd C:\Users\gr\Documents\GitHub\Portafolio-Proyectos-Fullstack\smartbank-ai\backend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

El backend queda disponible en:

```text
http://127.0.0.1:8000/
```

### Frontend

Desde la carpeta del frontend:

```powershell
cd C:\Users\gr\Documents\GitHub\Portafolio-Proyectos-Fullstack\smartbank-ai\frontend
npm run dev
```

El frontend queda disponible en:

```text
http://localhost:3000/
```

---

## Comprobaciones útiles

### Comprobar backend

```powershell
python manage.py check
```

### Crear migraciones

```powershell
python manage.py makemigrations
```

### Aplicar migraciones

```powershell
python manage.py migrate
```

### Compilar frontend

```powershell
npm run build
```

---

## Seguridad y buenas prácticas

Este proyecto incluye varias medidas básicas de seguridad y organización:

- Autenticación mediante token.
- Protección de endpoints con permisos.
- Restricción de datos por usuario autenticado.
- Validación de operaciones bancarias.
- Validación de solicitudes de productos.
- Uso de transacciones en operaciones críticas.
- Separación entre frontend y backend.
- Servicio centralizado de rutas API.
- Documentación de endpoints.
- Preparación para variables de entorno en despliegue.
- Exclusión de archivos sensibles mediante `.gitignore`.

No deben subirse al repositorio archivos como:

```text
backend/db.sqlite3
backend/.venv
frontend/node_modules
frontend/.next
frontend/.env.local
__pycache__/
.env
```

---

## Estado de despliegue

Actualmente el proyecto se encuentra en desarrollo local y preparación para despliegue.

La arquitectura prevista para producción es:

```text
Frontend Next.js → Vercel
Backend Django REST Framework → Render
Base de datos → PostgreSQL
```

---

## Próximas mejoras previstas

- Despliegue completo del frontend y backend.
- Migración de SQLite a PostgreSQL para producción.
- Configuración de variables de entorno.
- Mejora del chatbot financiero para navegar por las secciones del panel.
- Consultas inteligentes más completas sobre movimientos, ingresos, gastos y productos.
- Recomendaciones financieras personalizadas.
- Modelo específico de tarjetas activas.
- Modelo de retenciones de tarjeta.
- Activación de productos cuando una solicitud sea aprobada.
- Mejora de pruebas.
- Preparación avanzada para producción.

---

## Relación con mi perfil profesional

SmartBank AI conecta mi experiencia profesional previa en banca digital con mi evolución hacia el desarrollo Full Stack.

Durante años he trabajado en soporte técnico y funcional en entorno bancario, resolviendo incidencias, gestionando información sensible y acompañando a usuarios. Este proyecto me permite trasladar esa experiencia a una aplicación propia, trabajando lógica bancaria, permisos, seguridad, APIs REST, arquitectura frontend-backend y una primera capa de inteligencia artificial aplicada.

---

## Enlace al repositorio principal

Este proyecto forma parte de mi portafolio Full-Stack:

```text
https://github.com/GemaRJ/Portafolio-Proyectos-Fullstack
```
