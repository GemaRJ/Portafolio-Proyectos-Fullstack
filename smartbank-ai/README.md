# 🏦 SmartBank

### Aplicación bancaria Full-Stack desplegada con Django REST Framework, Next.js, PostgreSQL y asistente financiero interactivo

SmartBank AI es una aplicación de banca digital desarrollada como proyecto Full-Stack, conectando mi experiencia profesional en banca digital con mi evolución hacia el desarrollo de software.

El proyecto reproduce funcionalidades propias de una banca online: autenticación de clientes, cuentas, movimientos, operaciones bancarias, contratación de productos, conversión de divisas y un asistente financiero interactivo conectado a los datos del usuario.

La aplicación se encuentra desplegada en producción con frontend en Vercel, backend en Render y base de datos PostgreSQL alojada en Neon.

Además, se ha desarrollado un generador automático de datos bancarios ficticios para disponer de un volumen de información suficiente para pruebas, consultas y futuras fases de análisis.

---

## 🚀 Demo online

👉 https://smartbank-ai-frontend.vercel.app/

> ⚠️ **Proyecto académico y demostrativo**
>
> Todos los datos utilizados en SmartBank AI son ficticios.
>
> Si deseas probar la aplicación o crear una cuenta para navegar por el proyecto, utiliza únicamente datos ficticios.
>
> **No introduzcas información personal, bancaria ni credenciales reales.**

---

## 🏗️ Arquitectura

SmartBank AI utiliza una arquitectura frontend-backend desacoplada:

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

---

## ✨ Funcionalidades principales

### 🔐 Autenticación y usuarios

- Registro de clientes.
- Inicio de sesión mediante DNI y contraseña.
- Autenticación mediante token.
- Cierre de sesión.
- Consulta del usuario autenticado.
- Área personal editable.
- Actualización de datos mediante `PATCH`.
- Restricción de información según el usuario autenticado.

### 💳 Cuentas bancarias

- Creación automática de una cuenta inicial al registrar un cliente.
- Consulta de cuentas.
- Selección de cuenta activa.
- Visualización de saldo disponible y saldo total.
- Información individualizada por cliente.

### 📊 Movimientos

- Historial de movimientos.
- Filtrado por cuenta.
- Visualización de fecha, concepto, categoría e importe.
- Diferenciación entre:
  - Ingresos.
  - Gastos.
  - Transferencias.
  - Bizum.
  - Liquidaciones.

### 💸 Operaciones bancarias

La aplicación permite realizar operaciones desde el frontend:

- Ingresos.
- Gastos.
- Transferencias entre cuentas.
- Selección de cuenta origen y destino.
- Validación de saldo suficiente.
- Validación de cuentas activas.
- Actualización automática de saldos.
- Generación automática de movimientos asociados.

Las operaciones críticas del backend utilizan transacciones mediante `transaction.atomic`.

### 🧾 Contratación de productos

Desde el área privada se pueden solicitar diferentes productos bancarios:

- Préstamo online.
- Tarjeta.
- Cuenta adicional.
- Cuenta de ahorro.
- Cuenta para menor de edad.

Los formularios se adaptan dinámicamente al producto seleccionado.

Las solicitudes quedan almacenadas en el backend y asociadas al usuario autenticado.

El cliente puede consultar posteriormente su estado desde la sección **Mis solicitudes**.

### 💱 Cambio de divisa

SmartBank AI incorpora un conversor conectado a una API externa para consultar cambios de divisa.

Permite realizar conversiones desde EUR hacia diferentes monedas y mostrar el valor estimado utilizando información obtenida mediante un servicio externo.

---

## 🤖 Asistente financiero interactivo

SmartBank AI incorpora un asistente financiero conectado directamente con el backend de Django.

El usuario puede escribir consultas relacionadas con sus datos financieros y el asistente interpreta diferentes formas de realizar una misma pregunta.

Ejemplos:

- ¿Cuánto saldo tengo?
- ¿Cuál es mi saldo total?
- ¿Cuánto he gastado este mes?
- ¿Cuánto he ingresado?
- ¿En qué categoría gasto más?
- Dame una recomendación de ahorro.

El flujo de una consulta es:

Usuario  
↓  
Chatbot React / TypeScript  
↓  
API REST  
↓  
Django REST Framework  
↓  
Usuario autenticado  
↓  
PostgreSQL  
↓  
Información financiera  
↓  
Respuesta del asistente

El endpoint del asistente está protegido mediante autenticación.

De esta forma, cada usuario únicamente puede consultar la información financiera asociada a sus propios datos.

El chatbot también incorpora:

- Escritura libre de consultas.
- Consultas rápidas.
- Acciones contextuales según la respuesta.
- Historial visual de conversación.
- Reinicio de conversación.
- Estado visual del asistente.
- Animaciones mediante Framer Motion.
- Iconografía mediante Lucide React.

---

## 🗄️ Generación de datos bancarios ficticios

Para realizar pruebas con un volumen de información más realista se desarrolló un comando personalizado de Django capaz de generar automáticamente datos bancarios ficticios.

El generador permite configurar:

- Número de clientes.
- Número de cuentas.
- Histórico en meses.
- Cantidad mínima y máxima de movimientos.
- Transferencias.
- Ingresos.
- Gastos.
- Categorías financieras.

Ejemplo:

```bash
python manage.py poblar_banco \
  --clientes 300 \
  --meses 24 \
  --movimientos-min 80 \
  --movimientos-max 160 \
  --transferencias 2500 \
  --reiniciar-demo

## 📊 Fase final en desarrollo — Análisis de datos con SQL y Power BI

La fase final de SmartBank AI estará orientada al análisis y explotación de los datos bancarios generados por la propia aplicación.

El objetivo es ampliar el proyecto más allá de la parte transaccional Full-Stack y utilizar la información almacenada en PostgreSQL para construir una capa de análisis de datos mediante **SQL y Power BI**.

Esta fase se encuentra actualmente en desarrollo.

### ¿Cómo se gestionará?

La aplicación continuará funcionando como hasta ahora:

SmartBank AI  
↓  
Usuarios, cuentas, movimientos y transferencias  
↓  
Django REST Framework  
↓  
PostgreSQL / Neon

A partir de estos datos se desarrollará una segunda capa orientada al análisis:

PostgreSQL / Neon  
↓  
Consultas SQL  
↓  
Preparación y transformación de datos  
↓  
Modelo de datos analítico  
↓  
Power BI  
↓  
Dashboard financiero interactivo

### SQL

SQL se utilizará para consultar, relacionar, filtrar y preparar la información almacenada en PostgreSQL.

Se trabajará sobre los datos generados por SmartBank AI, principalmente:

- Clientes.
- Cuentas.
- Movimientos.
- Ingresos.
- Gastos.
- Transferencias.
- Categorías financieras.
- Fechas y periodos.

Entre las consultas previstas se encuentran:

- Ingresos y gastos por cliente.
- Evolución mensual de ingresos y gastos.
- Saldo por cuenta y cliente.
- Gastos agrupados por categoría.
- Categorías con mayor volumen de gasto.
- Transferencias realizadas por periodo.
- Número de operaciones por cliente.
- Comparativas entre meses.
- Evolución del ahorro.
- Clientes o cuentas con mayor actividad.

SQL servirá como base para preparar información estructurada antes de llevarla a Power BI.

### Power BI

Power BI se utilizará para transformar los datos de SmartBank AI en información visual e indicadores financieros.

El objetivo será desarrollar un dashboard interactivo que permita analizar la evolución de los datos bancarios ficticios generados por la aplicación.

Entre los indicadores previstos se encuentran:

- Saldo total.
- Ingresos totales.
- Gastos totales.
- Ahorro neto.
- Tasa de ahorro.
- Número de clientes.
- Número de cuentas.
- Número de movimientos.
- Número y volumen de transferencias.
- Saldo medio por cliente.
- Ingreso medio.
- Gasto medio.
- Evolución mensual de ingresos.
- Evolución mensual de gastos.
- Distribución de gastos por categorías.
- Categorías con mayor gasto.
- Evolución del ahorro.

También se podrán incorporar filtros por:

- Cliente.
- Cuenta.
- Año.
- Mes.
- Tipo de movimiento.
- Categoría.

### Modelo de datos

La intención es aprovechar las relaciones que ya existen en SmartBank AI:

Cliente  
↓  
Cuenta  
↓  
Movimiento

y:

Cuenta origen  
↓  
Transferencia  
↓  
Cuenta destino

Estas relaciones permitirán construir un modelo analítico en Power BI sobre la misma información utilizada por la aplicación Full-Stack.

Además, se podrán crear tablas auxiliares, como una tabla calendario, y medidas mediante DAX para calcular indicadores y comparativas temporales.

### Objetivo de esta fase

Esta fase permitirá conectar en un mismo proyecto tres áreas:

**Desarrollo Full-Stack + Bases de datos y SQL + Business Intelligence**

De esta forma, SmartBank AI no se limitará a crear y gestionar operaciones bancarias, sino que permitirá también analizar la información generada por la aplicación y convertirla en indicadores útiles para la toma de decisiones.

La evolución completa del proyecto quedará planteada como:

SmartBank AI — Aplicación Full-Stack  
↓  
Django REST Framework  
↓  
PostgreSQL  
↓  
Generación de datos bancarios ficticios  
↓  
SQL  
↓  
Power BI  
↓  
Análisis y dashboard financiero

Esta fase final se encuentra actualmente en desarrollo.
