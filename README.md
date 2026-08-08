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

## 🏦 SmartBank AI — Aplicación bancaria Full-Stack desplegada con Django REST Framework, Next.js, PostgreSQL y asistente financiero interactivo.

SmartBank AI es una aplicación bancaria Full-Stack desarrollada con Django REST Framework, Next.js, TypeScript y Tailwind CSS, desplegada en producción con frontend en Vercel, backend en Render y base de datos PostgreSQL en Neon.

El proyecto simula una banca digital moderna con gestión de usuarios, cuentas, movimientos, transferencias, autenticación por token, operaciones bancarias desde frontend, área personal editable, contratación de productos bancarios, conversor de divisas conectado a una API externa y asistente financiero interactivo conectado al backend.

Nace como evolución de mis proyectos financieros anteriores y combina lógica bancaria, seguridad, permisos por usuario, relaciones entre modelos, trazabilidad de operaciones, consumo de APIs externas, despliegue cloud, generación de datos ficticios e inteligencia artificial aplicada al análisis financiero.

### 🚀 Demo desplegada

👉 https://smartbank-ai-frontend.vercel.app/

> ⚠️ SmartBank AI es un proyecto académico y demostrativo.
>
> Todos los datos utilizados son ficticios.
>
> Si deseas probar la aplicación o crear una cuenta, utiliza únicamente datos ficticios. No introduzcas información personal, bancaria ni credenciales reales.

### Arquitectura desplegada

Frontend  
Next.js + TypeScript + Tailwind CSS  
↓  
Vercel  
↓  
API REST  
↓  
Django REST Framework  
↓  
Render  
↓  
PostgreSQL  
↓  
Neon

### Estado actual del proyecto

Actualmente SmartBank AI cuenta con una arquitectura Full-Stack funcional y desplegada.

**Backend**

- Proyecto Django organizado mediante aplicaciones modulares.
- Modelo de usuario personalizado con acceso mediante DNI.
- Panel de administración de Django.
- Modelos de usuarios, cuentas, movimientos y transferencias.
- Modelo de solicitudes de productos bancarios.
- API REST con Django REST Framework.
- Serializers, ViewSets, routers y endpoints organizados.
- Filtros, búsquedas y ordenación.
- Permisos por usuario autenticado.
- Autenticación mediante token.
- Registro de clientes desde API.
- Creación automática de cuenta corriente inicial al registrar un cliente.
- Consulta del usuario autenticado.
- Edición de datos personales mediante PATCH.
- Operaciones bancarias desde API:
  - Ingresos.
  - Gastos.
  - Transferencias.
- Actualización automática de saldos.
- Creación automática de movimientos asociados.
- Validación de saldo suficiente.
- Validación de cuentas activas.
- Validación de permisos.
- Uso de `transaction.atomic` en operaciones críticas.
- Backend de contratación de productos bancarios:
  - Préstamo online.
  - Tarjeta.
  - Cuenta adicional.
  - Cuenta de ahorro.
  - Cuenta menor de edad.
- Solicitudes de productos protegidas por usuario.
- Estados de solicitudes.
- Validaciones específicas según el producto.
- Endpoint protegido para el asistente financiero.
- Documentación de API mediante Swagger/OpenAPI.
- Configuración CORS para comunicación con frontend desplegado.
- Conexión con PostgreSQL en producción.
- Gestión de archivos estáticos mediante WhiteNoise.
- Ejecución en producción mediante Gunicorn.

**Frontend**

- Frontend desarrollado con Next.js, React, TypeScript y Tailwind CSS.
- Pantalla de acceso conectada con Django.
- Pantalla de registro conectada con Django.
- Panel financiero visual e interactivo.
- Navegación por:
  - Resumen.
  - Movimientos.
  - Operaciones.
  - Cambio Divisa.
  - Menú.
- Selección de cuentas.
- Historial de movimientos filtrado por cuenta.
- Operaciones desde frontend:
  - Ingresos.
  - Gastos.
  - Transferencias.
- Transferencias con selección de cuenta de destino.
- Área personal editable.
- Gestión de sesión mediante token.
- Menú de contratación conectado al backend.
- Formularios dinámicos según el producto seleccionado.
- Sección `Mis solicitudes`.
- Visualización del estado de las solicitudes.
- Visualización de productos o solicitudes asociadas a una cuenta.
- Conversor de divisas conectado a API externa.
- Chatbot financiero flotante conectado a Django.
- Consultas escritas libremente.
- Accesos rápidos contextuales.
- Animaciones con Framer Motion.
- Iconos mediante Lucide React.
- Servicio centralizado de rutas API en `src/servicios/api.ts`.

### Funcionalidades principales

- Registro de usuarios con DNI y contraseña.
- Inicio y cierre de sesión mediante token.
- Consulta del usuario autenticado.
- Actualización de datos personales.
- Gestión de cuentas bancarias.
- Gestión de movimientos.
- Gestión de transferencias.
- Restricción de datos según el usuario conectado.
- Operaciones bancarias protegidas.
- Panel financiero conectado con datos reales de la base de datos.
- Conversor de divisas mediante API externa.
- Contratación de productos bancarios.
- Registro de solicitudes mediante Django REST Framework.
- Visualización de solicitudes del usuario autenticado.
- Asociación de solicitudes y productos a cuentas concretas.
- Asistente financiero conectado a la información del usuario.
- Consultas sobre saldo, ingresos, gastos, categorías y ahorro.
- Generación automatizada de datos bancarios ficticios.
- Base de datos preparada para análisis posteriores mediante SQL y Power BI.
- Panel de administración para supervisar usuarios, cuentas, movimientos, transferencias, tokens y solicitudes.

### 🤖 Asistente financiero interactivo

SmartBank AI incorpora un asistente financiero conectado directamente con Django REST Framework y con la información bancaria del usuario autenticado.

El usuario puede realizar consultas escritas utilizando diferentes formas de expresión.

Ejemplos:

- ¿Cuánto saldo tengo?
- ¿Cuánto dinero tengo disponible?
- ¿Cuánto he gastado este mes?
- ¿Cuánto he ingresado?
- ¿En qué categoría gasto más?
- Dame un consejo de ahorro.

El flujo de la consulta es:

Usuario  
↓  
Chatbot Next.js / TypeScript  
↓  
API REST  
↓  
Django REST Framework  
↓  
Token del usuario  
↓  
PostgreSQL  
↓  
Consulta financiera  
↓  
Respuesta del asistente

El endpoint está protegido, por lo que cada cliente únicamente puede consultar sus propios datos financieros.

El asistente también incluye:

- Escritura libre de consultas.
- Accesos rápidos.
- Acciones contextuales después de cada respuesta.
- Historial visual.
- Indicador de estado.
- Reinicio de conversación.
- Animaciones.
- Interfaz adaptada al diseño general de SmartBank AI.

### 🗄️ Generación de datos bancarios ficticios

Para disponer de un volumen de información suficiente para pruebas y análisis se desarrolló un comando personalizado de Django:

`usuarios/management/commands/poblar_banco.py`

Permite generar automáticamente:

- Clientes.
- Cuentas.
- Movimientos.
- Ingresos.
- Gastos.
- Transferencias.
- Categorías financieras.
- Histórico de varios meses.

Ejemplo:

`python manage.py poblar_banco --clientes 300 --meses 24 --movimientos-min 80 --movimientos-max 160 --transferencias 2500 --reiniciar-demo`

Estos datos son ficticios y se utilizan exclusivamente con fines académicos, de desarrollo y demostración.

También servirán como base para la siguiente línea del proyecto: análisis mediante SQL y Power BI.

### Endpoints principales

- `/api/usuarios/`
- `/api/cuentas/`
- `/api/movimientos/`
- `/api/transferencias/`
- `/api/operaciones/ingreso/`
- `/api/operaciones/gasto/`
- `/api/operaciones/transferencia/`
- `/api/auth/registro/`
- `/api/auth/login/`
- `/api/auth/logout/`
- `/api/auth/me/`
- `/api/asistente/consulta/`
- `/api/solicitudes-productos/`
- `/api/schema/`
- `/api/docs/`
- `/api/redoc/`

### Tecnologías utilizadas

**Backend**

- Python.
- Django.
- Django REST Framework.
- PostgreSQL.
- django-filter.
- django-cors-headers.
- drf-spectacular.
- Token Authentication.
- Swagger/OpenAPI.
- Gunicorn.
- WhiteNoise.

**Frontend**

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- Framer Motion.
- Lucide React.
- Fetch API.
- localStorage.

**Base de datos y despliegue**

- SQLite en desarrollo.
- PostgreSQL en producción.
- Neon.
- Render.
- Vercel.

**Herramientas**

- Git.
- GitHub.
- Visual Studio Code.
- PowerShell.

### Estado de despliegue

SmartBank AI está actualmente desplegado y funcional.

Frontend:
Vercel

Backend:
Render

Base de datos:
PostgreSQL en Neon

Demo:

👉 https://smartbank-ai-frontend.vercel.app/

### Próximas mejoras

La siguiente evolución del proyecto estará centrada en análisis de datos e inteligencia artificial aplicada.

- Ampliar las capacidades conversacionales del asistente.
- Incorporar comparativas entre meses.
- Consultas por categorías concretas.
- Análisis de tendencias de gasto.
- Recomendaciones financieras más personalizadas.
- Crear modelos específicos de tarjetas activas y otros productos.
- Mejorar pruebas automatizadas.
- Explotar los datos mediante SQL.
- Crear dashboards financieros con Power BI.
- Integrar la parte transaccional de SmartBank AI con una capa analítica de datos.
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

DNI: 12345678X
Contraseña: 1234

### Funcionalidades principales
- Interfaz bancaria desarrollada con Next.js.
- Inicio de sesión simulada con credenciales de prueba.
- Consulta de movimientos.
- Visualización de saldo.
- Registro de transferencias.
- Conversor de divisas con consumo de API externo.
- Gestión visual de información financiera.
- Integración con Supabase.
- Alertas y mensajes visuales con SweetAlert2.
- Despliegue en producción con Vercel.

### Tecnologías utilizadas
- Frontend: Next.js, React, TypeScript, CSS3.
- Backend/Servicios: Supabase.
- API: consumo de API externo para cambio de divisas.
- Herramientas: Git, GitHub, Vercel, SweetAlert2.

---

## 🏠 Sistema de Gestión Inmobiliaria — MVC

Sistema de gestión inmobiliaria desarrollado con PHP y MySQL, estructurado bajo el patrón Modelo-Vista-Controlador.

El proyecto permite la administración integral de propiedades y usuarios mediante un sistema de permisos basado en roles. Está orientado a simular una plataforma interna de gestión inmobiliaria, diferenciando funcionalidades según el tipo de usuario.

### Funcionalidades principales
- Inicio de sesión de usuarios.
- Sistema de roles y permisos.
- Gestión de usuarios.
- Gestión de propiedades inmobiliarias.
- Panel de administración.
- Implementación de tickets de seguridad.
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

**Administrador**
- Correo: ADMINISTRADOR@GEMA.COM
- Contraseña: 1234

**Vendedor**
- Correo: ENZO@ENZO.COM
- Contraseña: 1234

**Comprador**
- Correo: CARLOS@CARLOS.COM
- Contraseña: 1234

### Tecnologías utilizadas
- Backend: PHP.
- Base de datos: MySQL.
- Interfaz: HTML5, CSS3.
- Arquitectura: MVC.
- Herramientas: Git, GitHub, XAMPP, phpMyAdmin.

---

## 🛍️ Tienda Angular — Comercio electrónico SPA

Aplicación completa desarrollada con Angular que simula una tienda online tipo SPA, con catálogo dinámico de productos, filtros, carrito de compra, formulario de contacto y persistencia en el navegador.

El proyecto trabaja conceptos clave del desarrollo frontend moderno, como arquitectura basada en componentes, servicios, comunicación entre componentes, consumo de APIs REST y despliegue en producción.

### Demo y código
- Demostración en producción: https://angular-one-tau-51.vercel.app/productos
- Código del proyecto: `Angular / tienda`

### Funcionalidades principales
- Consumo de API externo con DummyJSON.
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
- Desarrollo frontend: Angular, TypeScript, HTML5, CSS3.
- API: DummyJSON.
- Persistencia: almacenamiento local.
- Herramientas: Git, GitHub, Vercel.

---

## 🛒 Productos con Carrito

Proyecto desarrollado con JavaScript, centrado en la lógica de carrito de compra, consumo de API y manipulación dinámica del DOM.

Permite practicar la gestión de productos, eventos, almacenamiento de datos y actualización dinámica de la interfaz.

### Funcionalidades principales
- Listado dinámico de productos.
- Lógica de carrito de compra.
- Agregar y eliminar productos.
- Cálculo de totales.
- Consumo de API.
- Manipulación dinámica del DOM.
- Gestión de eventos con JavaScript.

### Tecnologías utilizadas
- Desarrollo frontend: JavaScript, HTML5, CSS3.
- Otros: consumo de API, DOM, lógica de carrito.

---

## ☕ Cafetería

Aplicación desarrollada en Python para la gestión de inventario y control de productos, aplicando conceptos de programación orientados a objetos.

### Funcionalidades principales
- Gestión de productos.
- Control de inventario.
- Organización del código mediante clases.
- Aplicación de conceptos de programación orientada a objetos.

### Tecnologías utilizadas
- Lenguaje: Python.
- Conceptos: programación orientada a objetos, gestión de inventario y control de productos.

---

## 🛠 Tecnologías utilizadas en el portafolio

**Interfaz**
- Next.js
- React
- Angular
- JavaScript
- TypeScript
- HTML5
- CSS3

**Backend**
- Python
- Django
- Django REST Framework
- PHP
- Node.js
- Express

**Bases de datos y persistencia**
- MySQL
- SQLite
- Supabase
- SQL
- LocalStorage

**Arquitectura y APIs**
- MVC
- API REST
- Integración frontend-backend
- Consumo de APIs externas

**Despliegue**
- Vercel
- InfinityFree

**Otras herramientas**
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

Actualmente estoy ampliando mi portafolio con proyectos más orientados a backend, APIs REST, datos e inteligencia artificial aplicada, como SmartBank AI, con la intención de seguir evolucionándolo hacia una solución Full-Stack completa con frontend moderno y asistente financiero inteligente.

---

## 📬 Contacto

- 📧 Correo electrónico: gema.rj87@gmail.com
- 💼 LinkedIn: [linkedin.com/in/gema-rj](https://linkedin.com/in/gema-rj)
- 🐙 GitHub: [github.com/GemaRJ](https://github.com/GemaRJ)
