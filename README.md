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

## 🏦 SmartBank AI — Backend bancario con Django REST Framework

Proyecto backend en desarrollo construido con **Django** y **Django REST Framework**, orientado a simular una aplicación bancaria con gestión de usuarios, cuentas, movimientos, transferencias, autenticación por token y operaciones bancarias desde API.

Este proyecto nace como evolución de mis proyectos financieros anteriores, con el objetivo de construir una aplicación más completa, profesional y escalable, aplicando lógica real de backend, seguridad, control de permisos, relaciones entre modelos y trazabilidad de operaciones.

Actualmente el proyecto se encuentra en desarrollo activo y forma parte de mi proceso de especialización hacia **backend, APIs REST, datos e inteligencia artificial aplicada**.

La idea es continuar ampliándolo hasta convertirlo en una solución Full-Stack completa, construyendo posteriormente un **frontend moderno** y una capa de **inteligencia artificial** que permita analizar movimientos, gastos, ingresos y hábitos financieros del usuario.

### Estado actual del proyecto

Actualmente el backend ya cuenta con:

- Proyecto Django configurado.
- Estructura modular por aplicaciones.
- Modelo de usuario personalizado con acceso mediante DNI.
- Panel de administración de Django.
- Modelos de usuarios, cuentas, movimientos y transferencias.
- API REST con Django REST Framework.
- Serializers, ViewSets, routers y endpoints organizados.
- Filtros, búsquedas y ordenación.
- Permisos por usuario autenticado.
- Autenticación mediante token.
- Registro de clientes desde API.
- Creación automática de cuenta corriente inicial al registrar un cliente.
- Consulta del usuario autenticado.
- Operaciones bancarias desde API:
  - Ingreso.
  - Gasto.
  - Transferencia.
- Actualización automática de saldos.
- Creación automática de movimientos asociados.
- Validaciones de saldo, cuenta activa y permisos.
- Uso de transacciones con `transaction.atomic` para operaciones críticas.

### Funcionalidades principales desarrolladas

- Registro de usuarios con DNI y contraseña.
- Login y logout mediante token.
- Consulta del usuario autenticado.
- Gestión de cuentas bancarias.
- Gestión de movimientos.
- Gestión de transferencias.
- Restricción de datos según el usuario conectado.
- Operaciones bancarias protegidas.
- Panel de administración para supervisar usuarios, cuentas, movimientos, transferencias y tokens.

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

### Tecnologías utilizadas

- Python
- Django
- Django REST Framework
- Django Filter
- Token Authentication
- SQLite en desarrollo
- CORS Headers
- Git / GitHub
- Visual Studio Code

### Próximos pasos del proyecto

El objetivo es seguir ampliando SmartBank AI hasta convertirlo en una aplicación bancaria completa con frontend, dashboard financiero e inteligencia artificial aplicada.

Próximas mejoras previstas:

- Crear frontend con React o Next.js.
- Diseñar un dashboard visual para clientes.
- Añadir historial avanzado de operaciones.
- Añadir paginación.
- Añadir tests unitarios.
- Documentar la API con Swagger/OpenAPI.
- Preparar integración con inteligencia artificial.
- Crear un asistente financiero inteligente.
- Analizar ingresos, gastos y hábitos de consumo.
- Generar recomendaciones financieras personalizadas.
- Conectar el proyecto con un dashboard complementario en Power BI.
- Evolucionar el proyecto hacia una solución Full-Stack completa.

### Objetivo profesional del proyecto

SmartBank AI está pensado para demostrar conocimientos prácticos de backend y desarrollo Full-Stack en un contexto cercano al sector bancario, aprovechando mi experiencia profesional previa en soporte técnico y funcional dentro de banca digital.

El proyecto muestra mi capacidad para diseñar una arquitectura backend, trabajar con modelos relacionados, proteger endpoints, aplicar permisos, validar operaciones, mantener trazabilidad de datos y construir una API preparada para ser consumida por un futuro frontend.

### Enlace al proyecto

- Código del proyecto: `smartbank-ai`
- README técnico del proyecto: `smartbank-ai/README.md`

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
