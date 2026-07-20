# Portafolio de Proyectos Full-Stack

Este repositorio contiene una colección de proyectos personales y académicos Full-Stack, mostrando la evolución de mi aprendizaje y mi capacidad para desarrollar aplicaciones web completas con frontend, backend, bases de datos, consumo de APIs, arquitectura modular y despliegue online.

Incluye proyectos desarrollados con diferentes tecnologías como Python, Django, PHP, MySQL, JavaScript, TypeScript, React, Next.js, Angular, Supabase y APIs REST.

## 🌟 Contenido del repositorio

El repositorio incluye proyectos con distintos enfoques y niveles de complejidad:

- Aplicaciones web Full-Stack con PHP, MySQL y arquitectura MVC.
- Aplicaciones frontend modernas con Angular, React, Next.js y TypeScript.
- Proyectos backend con Django y Django REST Framework.
- API REST con autenticación, permisos y operaciones protegidas.
- Proyectos con consumo de APIs externos.
- Aplicaciones con persistencia de datos.
- Despliegues reales en producción.
- Proyecto Final DAW con backend, base de datos, roles, soporte, ranking, PWA y chatbot básico.
- Proyecto backend bancario en desarrollo con futura integración de frontend e inteligencia artificial.

---

## 🏦 SmartBank AI — Aplicación bancaria Full-Stack con Django, Next.js e IA

SmartBank AI es una aplicación bancaria Full-Stack en desarrollo, construida con Django REST Framework, Next.js, TypeScript y Tailwind CSS.

El proyecto simula una banca digital moderna con gestión de usuarios, cuentas, movimientos, transferencias, autenticación por token, operaciones bancarias reales desde frontend, área personal editable y conversor de divisas conectado a una API externa en tiempo real.

Nace como evolución de mis proyectos financieros anteriores, con el objetivo de construir una aplicación más completa, profesional y escalable, aplicando lógica real de backend, seguridad, permisos por usuario, relaciones entre modelos, trazabilidad de operaciones y consumo de APIs externas.

Actualmente forma parte de mi proceso de especialización hacia el desarrollo Full-Stack, APIs REST, backend con Python/Django, frontend moderno e inteligencia artificial aplicada al análisis financiero.

### Estado actual del proyecto

Actualmente SmartBank AI ya cuenta con:

**Backend**
- Proyecto Django configurado.
- Estructura modular para aplicaciones.
- Modelo de usuario personalizado con acceso mediante DNI.
- Panel de administración de Django.
- Modelos de usuarios, cuentas, movimientos y transferencias.
- API REST con Django REST Framework.
- Serializadores, ViewSets, routers y endpoints organizados.
- Filtros, búsquedas y ordenación.
- Permisos por usuario autenticado.
- Autenticación mediante token.
- Registro de clientes desde API.
- Creación automática de cuenta corriente inicial al registrar un cliente.
- Consulta del usuario autenticado.
- Edición de datos personales mediante PATCH.
- Operaciones bancarias desde API:
  - Ingreso.
  - Gasto.
  - Transferencia.
- Actualización automática de saldos.
- Creación automática de movimientos asociados.
- Validaciones de saldo, cuenta activa y permisos.
- Uso de transacciones con `transaction.atomic` para operaciones críticas.
- Documentación de API con Swagger/OpenAPI.

**Interfaz**
- Frontend desarrollado con Next.js, TypeScript y Tailwind CSS.
- Pantalla de acceso conectada con el backend.
- Pantalla de registro conectada con el backend.
- Panel financiero visual e interactivo.
- Navegación por secciones:
  - Resumen.
  - Movimientos.
  - Operaciones.
  - Cambio Divisa.
  - Menú.
- Selección de cuentas.
- Historial de movimientos filtrados por cuenta.
- Operaciones reales desde frontend:
  - Ingresos.
  - Gastos.
  - Transferencias.
  - Transferencias con selección de cuenta de destino mediante desplegable.
- Área personal editable.
- Menú de contratación visual:
  - Préstamo online.
  - Tarjetas.
  - Cuenta adicional.
  - Cuenta de ahorro.
  - Cuenta menor de edad.
- Conversor de divisas conectado a una API externa en tiempo real.
- Servicio centralizado de rutas API en `src/servicios/api.ts`.

**Funcionalidades principales desarrolladas**
- Registro de usuarios con DNI y contraseña.
- Inicio y cierre de sesión mediante token.
- Consulta del usuario autenticado.
- Actualización de datos personales.
- Gestión de cuentas bancarias.
- Gestión de movimientos.
- Gestión de transferencias.
- Restricción de datos según el usuario conectado.
- Operaciones bancarias protegidas.
- Panel financiero conectado a datos reales.
- Conversor de divisas con API externa.
- Panel de administración para supervisar usuarios, cuentas, movimientos, transferencias y tokens.
- Preparación para chatbot financiero inteligente.

**Puntos finales principales**
- `/api/usuarios/`
- `/api/cuentas/`
- `/api/movimientos/`
- `/api/transferencias/`

---

## 🎮 PlayGo — Proyecto Final DAW

Aplicación web desarrollada como Proyecto Final del ciclo de Desarrollo de Aplicaciones Web.

PlayGo es una plataforma web interactiva orientada al entretenimiento y al aprendizaje, con juegos adaptados a diferentes rangos de edad: niños y adultos.

El proyecto combina gestión de usuarios, roles, sesiones, administración, rankings, soporte, traducción multidioma, funcionalidades PWA y despliegue online real.

También incorpora un chatbot básico de ayuda, desarrollado con preguntas predeterminadas e hipervínculos, orientado a guiar al usuario dentro de la aplicación y facilitar el acceso a secciones importantes como login, registro, soporte o navegación principal.

### Funcionalidades principales
- Registro e inicio de sesión de usuarios.
- Roles diferenciados: administrador, adulto, niño e invitado.
- Protección de rutas privadas y redirecciones según rol.
- Panel de administración.
- Gestión de usuarios.
- Sistema de soporte, incidencias y sugerencias.
- Sistema de rankings y evaluación.
- Juegos infantiles y juegos para adultos.
- Chatbot básico de ayuda con preguntas predeterminadas e hipervínculos.
- Sistema multidioma: español e inglés.
- Funcionalidades PWA con `manifest.json` y `service-worker.js`.
- Diseño responsive adaptado a móvil, tableta y escritorio.
- Despliegue online real.

### Juegos incluidos

**Juegos infantiles:**
- Cuenta Números.
- Cuenta Letras.
- Memoria.
- Tres en Raya.
- Niños Triviales.
- Niños Tabú.

**Juegos adultos:**
- Trivial.
- Veintiuna.
- Impostor.
- Tabú.

### Tecnologías utilizadas
- Backend: PHP.
- Base de datos: MySQL.
- Frontend: HTML5, CSS3, JavaScript.
- Herramientas: VS Code, Git, GitHub, XAMPP, InfinityFree, phpMyAdmin.
- Otros: PWA, SweetAlert2, sistema multidioma, chatbot básico.

### Enlaces
- Repositorio: `TFG-PlayGo`
- Despliegue online: https://playgo.rf.gd/
- Despliegue alternativo: https://playgo-space.ct.ws

---

## 🏦 Banco — Gestor Personal y Financiero 360°

Aplicación web de gestión financiera personal desarrollada con Next.js, React y TypeScript, con integración a Supabase y despliegue en Vercel.

El proyecto permite simular funcionalidades relacionadas con la gestión bancaria y financiera, como consulta de movimientos, gestión de saldo, transferencias, organización visual de la información y cambio de divisas mediante consumo de API externa.

### Demo y código
- Demostración en vivo: https://react-eta-red.vercel.app/
- Código del proyecto: `React / banco`

### Credenciales de prueba

```text
DNI: 12345678X
Contraseña: 1234
