

# 🧠 Moodiary

<img src="./client/public/moodiary.svg" alt="Moodiary Logo" width="200"/>

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**Moodiary** es tu diario emocional digital 📔. Con esta app podrás registrar cómo te sientes, visualizar tu estado de ánimo a lo largo del tiempo y descubrir patrones emocionales. ¡Todo esto desde una interfaz moderna y amigable!

✨ Frontend en React 19, backend en Express.js, y base de datos en PostgreSQL.

---

## 🧭 Índice

* [🎯 Funcionalidades](#-funcionalidades)
* [🖥️ Demo](#-demo)
* [🛠️ Tecnologías](#-tecnologías)
* [🚀 Primeros Pasos](#-primeros-pasos)
* [📁 Estructura del Proyecto](#-estructura-del-proyecto)
* [💻 Desarrollo](#-desarrollo)
* [📊 Modelos de Datos](#-modelos-de-datos)
* [🔌 API](#-api)
* [🤝 Contribuir](#-contribuir)
* [📄 Licencia](#-licencia)
* [👥 Colaboradores](#-colaboradores)
* [🌟 Agradecimientos](#-agradecimientos)

---

## 🎯 Funcionalidades

* 🔐 **Autenticación Segura** con sesiones HttpOnly y contraseñas protegidas
* 😊 **Registro de Emociones** con notas personalizadas
* 📈 **Visualización de Datos** con gráficos interactivos
* 🗓️ **Revisión Histórica** de emociones por fechas
* 🤖 **Frases personalizadas** generadas con Gemini
* 📱 **Diseño Responsivo** para escritorio y móvil
* 🌙☀️ **Modo Oscuro/Claro** adaptable a tus preferencias

---

## 🖥️ Demo

¡Una imagen vale más que mil palabras! 👇

![screenshot](https://github.com/user-attachments/assets/0ffd4381-2530-4e08-a828-2287765ac423)
![dashboard](https://github.com/user-attachments/assets/a86a9787-606c-4cdc-952b-af598ff4b8c9)

---

## 🛠️ Tecnologías

### 🔧 Cliente

* ⚛️ React 19 + JavaScript
* 🛣️ React Router v7
* 🔐 Context API + modal de autenticación propio
* 🎨 Tailwind CSS v4
* 🧱 Radix UI + Lucide React
* 🧠 Context API de React 19
* 🔗 Axios para llamadas HTTP
* 📊 Recharts para gráficos
* ⚡ Vite para desarrollo rápido

### 🖥️ Servidor

* 🟢 Node.js + Express
* 🧮 PostgreSQL + Sequelize
* ✅ Validación con Joi
* 💥 Manejo de errores con @hapi/boom
* 🔐 Sesiones opacas y cookies HttpOnly en backend
* 🤖 Gemini API para frases diarias

---

## 🚀 Primeros Pasos

### 📋 Requisitos

* Node.js v18 o superior
* npm o yarn
* PostgreSQL instalado

### 📦 Instalación

1. Clona el proyecto:

   ```bash
   git clone https://github.com/YoukaiYoru/moodiary.git
   cd moodiary
   ```

2. Configura el servidor:

   ```bash
   cd server
   npm install
   ```

   Crea un archivo `.env` con:

   ```
   DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/moodiary
   DB_SSL=false
   AUTH_COOKIE_SAME_SITE=lax
   AUTH_COOKIE_SECURE=false
   ```

   Luego ejecuta:

   ```bash
   npm run migrations:run
   npm run dev
   ```

3. Configura el cliente:

   ```bash
   cd ../client
   npm install
   ```

   Crea un archivo `.env` con:

   ```
   VITE_API_URL=http://localhost:5001/api/v1
   ```

   Y ejecuta:

   ```bash
   npm run dev
   ```

4. Abre tu navegador en: `http://localhost:5173` 🚀

### 🤖 Frases con Gemini

Moodiary usa Gemini desde el backend para generar una frase personalizada según
el promedio y la cantidad de registros del día. No se envía la nota personal a
Google; solo se envían estadísticas agregadas.

El servidor usa estas variables (incluidas en `server/.env.example`):

```env
GEMINI_API_KEY=REEMPLAZAR
GEMINI_MODEL=gemini-2.0-flash
GEMINI_TIMEOUT_MS=12000
```

Si Gemini no está disponible, el backend utiliza una frase almacenada en
PostgreSQL como fallback. La frase generada se guarda una vez por usuario y
fecha en `user_daily_quote`.

### 🐳 Producción con Docker Compose

El archivo `docker-compose.prod.yml` está preparado para usar Supabase como
base de datos externa y Ollama como servicio privado interno:

```bash
VITE_API_URL=https://api.tu-dominio.com/api/v1 \
docker-compose -f docker-compose.prod.yml up -d --build
```

Ollama queda conservado pero desconectado del arranque normal. El compose
ejecuta las migraciones y levanta el backend y frontend en el orden correcto.
Antes de ejecutar el
comando, configura `server/.env.production` con tus variables reales y no
subas ese archivo al repositorio.

---

## 📁 Estructura del Proyecto

### 🧩 Cliente

```
client/
├── public/           # Archivos estáticos
├── src/
│   ├── components/   # Componentes reutilizables
│   ├── contexts/     # Proveedores de contexto
│   ├── lib/          # Funciones auxiliares
│   ├── pages/        # Páginas de la app
│   └── main.tsx      # Punto de entrada
```

### 🖧 Servidor

```
server/
├── db/
│   ├── config/       # Configuración de la DB
│   ├── migrations/   # Migraciones
│   └── models/       # Modelos de datos
├── middlewares/      # Middlewares de Express
├── routes/           # Rutas API
├── services/         # Lógica de negocio
└── index.js          # Entrada del servidor
```

---

## 💻 Desarrollo

### 🖥️ Cliente

```bash
cd client
npm run dev
```

Comandos útiles:

* `npm run build`: Compilar para producción
* `npm run lint`: Analizar código con ESLint
* `npm run preview`: Previsualizar la build

### 🧪 Servidor

```bash
cd server
npm run dev
```

Comandos útiles:

* `npm run start`: Servidor en producción
* `npm run migrations:generate`: Crear nueva migración
* `npm run migrations:run`: Ejecutar migraciones pendientes
* `npm run migrations:revert`: Revertir la última migración
* `npm run migrations:delete`: Borrar todas las migraciones

---

## 🎨 Sistema de Estilos

Moodiary utiliza Tailwind CSS con variables CSS personalizadas para mantener una apariencia coherente en modo claro y oscuro. 🌈

Todo el diseño es fácilmente configurable a través del sistema de temas.

---

## 📊 Modelos de Datos

* `MoodEntry`: Representa una emoción registrada en un momento determinado.
* `MoodType`: Define tipos de emociones con emojis y puntajes.

---

## 🔌 API

Las rutas protegidas usan la cookie de sesión HttpOnly `moodiary_session`.
El navegador envía credenciales con `withCredentials: true`; el token nunca se
guarda en `localStorage`.

En producción, si el frontend y el API están en dominios distintos, configura
`AUTH_COOKIE_SAME_SITE=none` y `AUTH_COOKIE_SECURE=true`.

### 📅 `GET /moods/dates`

Obtiene las fechas con entradas de emociones del usuario autenticado.

---

## 🤝 Contribuir

¡Toda ayuda es bienvenida! 🛠️

1. Haz un fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz tus cambios y commitea (`git commit -m "Agrega nueva funcionalidad"`)
4. Haz push y abre un Pull Request

---

## 📄 Licencia

Este proyecto está licenciado bajo la [ISC License](https://opensource.org/licenses/ISC).

---

## 👥 Colaboradores

* [YoukaiYoru](https://github.com/YoukaiYoru)
* [samwich11](https://github.com/samwich11)

---

## 🌟 Agradecimientos

* [Node.js crypto](https://nodejs.org/api/crypto.html) para proteger contraseñas y sesiones
* [Radix UI](https://www.radix-ui.com/) por sus componentes accesibles
* [Tailwind CSS](https://tailwindcss.com/) por la potencia y velocidad para diseñar
