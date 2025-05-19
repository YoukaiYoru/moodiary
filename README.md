

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

* 🔐 **Autenticación Segura** con Clerk
* 😊 **Registro de Emociones** con notas personalizadas
* 📈 **Visualización de Datos** con gráficos interactivos
* 🗓️ **Revisión Histórica** de emociones por fechas
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
* 🔑 Clerk para autenticación
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
* 🔐 Clerk Express para auth en backend

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
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_HOST=localhost
   DB_NAME=moodiary
   DB_PORT=5432
   CLERK_SECRET_KEY=tu_clave_clerk
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
   VITE_CLERK_PUBLISHABLE_KEY=tu_clave_publica_de_clerk
   ```

   Y ejecuta:

   ```bash
   npm run dev
   ```

4. Abre tu navegador en: `http://localhost:5173` 🚀

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

Todas las rutas requieren autenticación con Clerk:

```http
Authorization: Bearer <tu_token>
```

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

* [Clerk](https://clerk.dev/) por hacer la autenticación sencilla
* [Radix UI](https://www.radix-ui.com/) por sus componentes accesibles
* [Tailwind CSS](https://tailwindcss.com/) por la potencia y velocidad para diseñar

