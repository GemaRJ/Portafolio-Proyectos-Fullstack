# SmartBank AI — Aplicación bancaria Full-Stack con Django, Next.js e IA

SmartBank AI es una aplicación bancaria Full-Stack desarrollada con **Django REST Framework**, **Next.js**, **TypeScript** y **Tailwind CSS**.

El proyecto simula una banca digital moderna con autenticación por DNI, gestión de cuentas, movimientos, transferencias, operaciones bancarias reales desde frontend, área personal editable, conversor de divisas conectado a una API externa y preparación para un chatbot financiero inteligente.

Forma parte de mi portafolio como desarrolladora Full Stack Junior y está orientado a demostrar conocimientos de backend, frontend, APIs REST, autenticación, seguridad, lógica bancaria, consumo de servicios externos e integración progresiva de inteligencia artificial.

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
- Preparar un chatbot financiero inteligente conectado al backend.

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
- Operaciones bancarias: ingresos, gastos y transferencias.
- Endpoint de usuario autenticado.
- Edición de datos personales mediante PATCH.
- Documentación Swagger/OpenAPI.
- App reservada para asistente financiero inteligente.

### Frontend funcional

- Frontend desarrollado con Next.js, TypeScript y Tailwind CSS.
- Pantalla de acceso conectada al backend.
- Pantalla de registro conectada al backend.
- Panel financiero visual e interactivo.
- Navegación por secciones.
- Selección de cuentas.
- Historial de movimientos por cuenta.
- Operaciones reales desde frontend.
- Área personal editable.
- Menú de contratación visual.
- Conversor de divisas conectado a API externa.
- Gestión de sesión mediante token en localStorage.

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
│   ├── src/
│   │   ├── app/
│   │   │   ├── acceso/
│   │   │   ├── panel/
│   │   │   └── registro/
│   │   └── servicios/
│   │       └── api.ts
│   │
│   └── package.json
│
├── documentacion/
├── capturas/
└── README.md
