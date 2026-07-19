# Portafolio de Proyectos Full-Stack

Este repositorio contiene una colección de proyectos personales y académicos Full-Stack, mostrando la evolución de mi aprendizaje y mi capacidad para desarrollar aplicaciones web completas con frontend, backend, bases de datos, consumo de APIs, arquitectura modular y despliegue online.

Incluye proyectos desarrollados con diferentes tecnologías como **Python, Django, PHP, MySQL, JavaScript, TypeScript, React, Next.js, Angular, Supabase y APIs REST**.

---

## 🌟 Contenido del repositorio

El repositorio incluye proyectos con distintos enfoques y niveles de complejidad:

- Aplicaciones web Full-Stack con PHP, MySQL y arquitectura MVC.
- Aplicaciones frontend modernas con Angular, React, Next.js y TypeScript.
- Proyectos backend con Django y Django REST Framework.
- APIs REST con autenticación, permisos y operaciones protegidas.
- Proyectos con consumo de APIs externas.
- Aplicaciones con persistencia de datos.
- Despliegues reales en producción.
- Proyecto Final DAW con backend, base de datos, roles, soporte, ranking, PWA y chatbot básico.
- Proyecto backend bancario en desarrollo con futura integración de frontend e inteligencia artificial.

---

## 🏦 SmartBank AI — Aplicación bancaria Full-Stack con Django, Next.js e IA

**SmartBank AI** es una aplicación bancaria Full-Stack en desarrollo, construida con **Django REST Framework**, **Next.js**, **TypeScript** y **Tailwind CSS**.

El proyecto simula una banca digital moderna con gestión de usuarios, cuentas, movimientos, transferencias, autenticación por token, operaciones bancarias reales desde frontend, área personal editable y conversor de divisas conectado a una API externa en tiempo real.

Nace como evolución de mis proyectos financieros anteriores, con el objetivo de construir una aplicación más completa, profesional y escalable, aplicando lógica real de backend, seguridad, permisos por usuario, relaciones entre modelos, trazabilidad de operaciones y consumo de APIs externas.

Actualmente forma parte de mi proceso de especialización hacia el desarrollo **Full-Stack**, APIs REST, backend con Python/Django, frontend moderno e inteligencia artificial aplicada al análisis financiero.

---

### Estado actual del proyecto

Actualmente SmartBank AI ya cuenta con:

#### Backend

- Proyecto Django configurado.
- Estructura modular por aplicaciones.
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
- Edición de datos personales mediante `PATCH`.
- Operaciones bancarias desde API:
  - Ingreso.
  - Gasto.
  - Transferencia.
- Actualización automática de saldos.
- Creación automática de movimientos asociados.
- Validaciones de saldo, cuenta activa y permisos.
- Uso de transacciones con `transaction.atomic` en operaciones críticas.
- Documentación de API con Swagger/OpenAPI.

#### Frontend

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
- Historial de movimientos filtrado por cuenta.
- Operaciones reales desde frontend:
  - Ingresos.
  - Gastos.
  - Transferencias.
- Transferencias con selección de cuenta destino mediante desplegable.
- Área personal editable.
- Menú de contratación visual:
  - Préstamo online.
  - Tarjetas.
  - Cuenta adicional.
  - Cuenta de ahorro.
  - Cuenta menor de edad.
- Conversor de divisas conectado a una API externa en tiempo real.
- Servicio centralizado de rutas API en `src/servicios/api.ts`.

---

### Funcionalidades principales desarrolladas

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

---

### Endpoints principales

```text
/api/usuarios/
/api/cuentas/
/api/movimientos/
/api/transferencias/

---

## 🎮 PlayGo — Proyecto Final DAW

Aplicación web desarrollada como Proyecto Final del ciclo de **Desarrollo de Aplicaciones Web**.

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

Juegos infantiles:

- Cuenta Números.
- Cuenta Letras.
- Memoria.
- Tres en Raya.
- Niños Triviales.
- Niños Tabú.

Juegos adultos:

- Trivial.
- Veintiuna.
- Impostor.
- Tabú.

### Tecnologías utilizadas

- Backend: PHP.
- Base de datos: MySQL.
- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5.
- Herramientas: VS Code, Git, GitHub, XAMPP, InfinityFree, phpMyAdmin.
- Otros: PWA, SweetAlert2, sistema multidioma, chatbot básico.

### Enlaces

- Repositorio: `TFG-PlayGo`
- Despliegue online: https://playgo.rf.gd/
- Despliegue alternativo: https://playgo-space.ct.ws

---

## 🏦 Banco — Gestor Personal y Financiero 360°

Aplicación web de gestión financiera personal desarrollada con **Next.js, React y TypeScript**, con integración a Supabase y despliegue en Vercel.

El proyecto permite simular funcionalidades relacionadas con la gestión bancaria y financiera, como consulta de movimientos, gestión de saldo, transferencias, organización visual de la información y cambio de divisas mediante consumo de API externa.

### Demo y código

- Demostración en vivo: https://react-eta-red.vercel.app/
- Código del proyecto: `React / banco`

### Credenciales de prueba

```text
DNI: 12345678X
Contraseña: 1234
```

### Funcionalidades principales

- Interfaz bancaria desarrollada con Next.js.
- Inicio de sesión simulado con credenciales de prueba.
- Consulta de movimientos.
- Visualización de saldo.
- Registro de transferencias.
- Conversor de divisas con consumo de API externa.
- Gestión visual de información financiera.
- Integración con Supabase.
- Alertas y mensajes visuales con SweetAlert2.
- Despliegue en producción con Vercel.

### Tecnologías utilizadas

- Frontend: Next.js, React, TypeScript, Bootstrap.
- Backend/Servicios: Supabase.
- API: consumo de API externa para cambio de divisas.
- Herramientas: Git, GitHub, Vercel, SweetAlert2.

---

## 🏠 Sistema de Gestión Inmobiliaria — MVC

Sistema de gestión inmobiliaria desarrollado con **PHP y MySQL**, estructurado bajo el patrón **Modelo-Vista-Controlador**.

El proyecto permite la administración integral de propiedades y usuarios mediante un sistema de permisos basado en roles. Está orientado a simular una plataforma interna de gestión inmobiliaria, diferenciando funcionalidades según el tipo de usuario.

### Funcionalidades principales

- Inicio de sesión de usuarios.
- Sistema de roles y permisos.
- Gestión de usuarios.
- Gestión de propiedades inmobiliarias.
- Panel de administración.
- Separación de responsabilidades mediante arquitectura MVC.
- Conexión con base de datos MySQL.
- Validaciones básicas.
- Control de acceso según rol.
- Interfaz organizada para la administración de datos.

### Roles implementados

- Administrador: acceso completo a la gestión del sistema.
- Vendedor: gestión relacionada con propiedades.
- Comprador: acceso limitado a funcionalidades de consulta.

### Credenciales de acceso demo

```text
Administrador
Correo: ADMINISTRADOR@GEMA.COM
Contraseña: 1234

Vendedor
Correo: ENZO@ENZO.COM
Contraseña: 1234

Comprador
Correo: CARLOS@CARLOS.COM
Contraseña: 1234
```

### Tecnologías utilizadas

- Backend: PHP.
- Base de datos: MySQL.
- Interfaz: HTML5, CSS3.
- Arquitectura: MVC.
- Herramientas: Git, GitHub, XAMPP, phpMyAdmin.

---

## 🛍️ Tienda Angular — Comercio electrónico SPA

Aplicación completa desarrollada con **Angular** que simula una tienda online tipo SPA, con catálogo dinámico de productos, filtros, carrito de compra, formulario de contacto y persistencia en el navegador.

El proyecto trabaja conceptos clave del desarrollo frontend moderno, como arquitectura basada en componentes, servicios, comunicación entre componentes, consumo de APIs REST y despliegue en producción.

### Demo y código

- Demo en producción: https://angular-one-tau-51.vercel.app/productos
- Código del proyecto: `Angular / tienda`

### Funcionalidades principales

- Consumo de API externa con DummyJSON.
- Catálogo de productos dinámicos.
- Filtros por categoría, marca y precio.
- Carrito de compra con estado compartido.
- Cálculo automático de totales.
- Formulario de contacto con validación.
- Historial persistente con localStorage.
- Navegación SPA sin recargas.
- Diseño responsive.
- Despliegue en producción con Vercel.

### Conceptos aplicados

- Arquitectura basada en componentes.
- Servicios para gestión de estado.
- Comunicación entre componentes.
- Consumo de API REST.
- Formularios y validación.
- Persistencia en el cliente.
- Despliegue frontend en producción.

### Tecnologías utilizadas

- Frontend: Angular, TypeScript, HTML5, CSS3.
- API: DummyJSON.
- Persistencia: localStorage.
- Herramientas: Git, GitHub, Vercel.

---

## 🛒 Productos con Carrito

Proyecto desarrollado con **JavaScript**, centrado en la lógica de carrito de compra, consumo de API y manipulación dinámica del DOM.

Permite practicar la gestión de productos, eventos, almacenamiento de datos y actualización dinámica de la interfaz.

### Funcionalidades principales

- Listado dinámico de productos.
- Lógica de carrito de compra.
- Añadir y eliminar productos.
- Cálculo de totales.
- Consumo de API.
- Manipulación dinámica del DOM.
- Gestión de eventos con JavaScript.

### Tecnologías utilizadas

- Frontend: JavaScript, HTML5, CSS3.
- Otros: consumo de API, DOM, lógica de carrito.

---

## ☕ Cafetería

Aplicación desarrollada en **Python** para la gestión de inventario y control de productos, aplicando conceptos de programación orientada a objetos.

### Funcionalidades principales

- Gestión de productos.
- Control de inventario.
- Organización del código mediante clases.
- Aplicación de conceptos de programación orientada a objetos.

### Tecnologías utilizadas

- Lenguaje: Python.
- Conceptos: programación orientada a objetos, gestión de inventario y control de productos.

---

## 🛠 Tecnologías utilizadas en el portfolio

### Frontend

- Next.js
- React
- Angular
- JavaScript
- TypeScript
- HTML5
- CSS3
- Bootstrap

### Backend

- Python
- Django
- Django REST Framework
- PHP
- Node.js
- Express

### Bases de datos y persistencia

- MySQL
- SQLite
- Supabase
- SQL
- localStorage

### Arquitectura y APIs

- MVC
- APIs REST
- Django REST Framework
- Integración frontend-backend
- Consumo de APIs externas

### Despliegue

- Vercel
- InfinityFree

### Otras herramientas

- Git
- GitHub
- Visual Studio Code
- XAMPP
- phpMyAdmin
- SweetAlert2

---

## 🚀 Objetivo

Este repositorio tiene como objetivo demostrar habilidades Full-Stack a través de proyectos prácticos, mostrando tanto la lógica de programación como la organización modular, la conexión con bases de datos, el consumo de APIs, el despliegue online y la progresiva evolución hacia proyectos más completos.

También refleja mi capacidad para trabajar con diferentes tecnologías, adaptar soluciones a distintos contextos y desarrollar aplicaciones web completas desde la parte visual hasta la lógica de backend y base de datos.

Actualmente estoy ampliando mi portfolio con proyectos más orientados a **backend, APIs REST, datos e inteligencia artificial aplicada**, como SmartBank AI, con la intención de seguir evolucionándolo hacia una solución Full-Stack completa con frontend moderno y asistente financiero inteligente.

---

## 📬 Contacto

- 📧 Correo electrónico: gema.rj87@gmail.com
- 💼 LinkedIn: linkedin.com/in/gema-rj
- 🐙 GitHub: github.com/GemaRJ
