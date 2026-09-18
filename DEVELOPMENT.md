# Moodiary — guía de desarrollo

Documento operativo para desarrollar, probar y desplegar Moodiary sin exponer secretos ni mezclar entornos.

## Arquitectura

~~~text
Vercel (React/Vite)
        |
        v
API Express + sesiones locales
   |              |
   v              v
Supabase       Ollama
PostgreSQL     gemma3:4b
~~~

- client/: React 19, TypeScript, Vite, Tailwind y Radix.
- server/: Express 5, Sequelize 6, PostgreSQL y autenticación local.
- server/db/: modelos y migraciones Sequelize.
- server/services/: lógica de negocio y generación de frases IA.
- docker-compose.prod.yml: Ollama, descarga del modelo, backend y migraciones.
- design-system-moodiary/: tokens y documentación visual.

## Requisitos

- Node.js 20 LTS recomendado.
- npm.
- PostgreSQL local o Supabase.
- Ollama local para generar frases durante desarrollo.

~~~bash
node --version
npm --version
ollama --version
~~~

## Instalación

~~~bash
cd server && npm install
cd ../client && npm install
~~~

El cliente contiene dependencias con peer dependencies antiguas. El Dockerfile usa legacy-peer-deps para resolverlas. No uses npm install --force como solución habitual.

## Variables de entorno

Los archivos reales .env* están ignorados por Git. Usa:

- server/.env.example
- client/.env.example
- server/.env.development
- server/.env.production

### Backend local

~~~env
NODE_ENV=development
PORT=5001
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@HOST:5432/postgres
DB_SSL=true
DB_IP_FAMILY=4
AUTH_COOKIE_SAME_SITE=lax
AUTH_COOKIE_SECURE=false
FRONTEND_URLS=http://localhost:5173,http://localhost:3000
ADMIN_USER_IDS=
GEMINI_API_KEY=REEMPLAZAR
GEMINI_MODEL=gemini-2.0-flash
GEMINI_TIMEOUT_MS=12000
~~~

### Frontend local

~~~env
VITE_API_URL=http://localhost:5001/api/v1
~~~

Solo las variables con prefijo VITE_ llegan al navegador. Nunca pongas allí claves secretas, contraseñas, DATABASE_URL u OLLAMA_BASE_URL.

### Producción

Backend, en server/.env.production:

~~~env
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@aws-0-us-west-2.pooler.supabase.com:5432/postgres
DB_SSL=true
DB_IP_FAMILY=4
DB_HOST=aws-0-us-west-2.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.project_ref
DB_PASSWORD=REEMPLAZAR
AUTH_COOKIE_SAME_SITE=none
AUTH_COOKIE_SECURE=true
FRONTEND_URLS=https://moodiary.vercel.app,https://moodiary.com
ADMIN_USER_IDS=user_xxx
GEMINI_API_KEY=REEMPLAZAR
GEMINI_MODEL=gemini-2.0-flash
GEMINI_TIMEOUT_MS=12000
~~~

Frontend, en Vercel:

~~~env
VITE_API_URL=https://api.tudominio.com/api/v1
~~~

Si la contraseña de PostgreSQL contiene caracteres especiales, codifícala en la URL: @ → %40, # → %23, ! → %21.

## Seguridad de secretos

- Nunca subas archivos .env, contraseñas ni URLs de base de datos reales.
- No uses DATABASE_URL, GEMINI_API_KEY ni OLLAMA_BASE_URL en el cliente.
- Como frontend y API están en dominios distintos, producción usa `AUTH_COOKIE_SAME_SITE=none` junto con `AUTH_COOKIE_SECURE=true`.

~~~bash
git check-ignore -v server/.env server/.env.production client/.env .env.prod
git diff --check
~~~

## Desarrollo local

Ollama:

~~~bash
ollama serve
ollama pull gemma3:4b
ollama list
curl http://127.0.0.1:11434/api/tags
~~~

Backend:

~~~bash
cd server
npm run migrations:run
npm run dev
~~~

Frontend, en otra terminal:

~~~bash
cd client
npm run dev
~~~

Health check:

~~~bash
curl http://localhost:5001/health
~~~

## Scripts

### Server

~~~bash
npm run dev
npm start
npm run lint
npm run migrations:run
npm run migrations:generate -- nombre-de-migracion
npm run migrations:revert
~~~

### Client

~~~bash
npm run dev
npm run build
npm run preview
npm run lint
~~~

migrations:delete revierte todas las migraciones: úsalo únicamente en una base local.

## Base de datos

Las tablas se administran con migraciones; no se usa sequelize.sync() en producción. La URL debe tener una sola asignación:

~~~env
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@HOST:5432/postgres
~~~

Nunca:

~~~env
DATABASE_URL=DATABASE_URL=postgresql://...
~~~

Las migraciones incluyen tablas base, datos iniciales, normalización de emociones, índices de estadísticas y campos message/source para frases IA.

## Ollama

Local:

~~~text
http://127.0.0.1:11434/api/chat
~~~

Docker:

~~~text
http://ollama:11434/api/chat
~~~

El backend envía al modelo únicamente datos agregados: promedio, emoción predominante y cantidad de registros. No envía notas personales.

Modelo recomendado:

~~~env
OLLAMA_MODEL=gemma3:4b
~~~

Alternativa para menos memoria:

~~~env
OLLAMA_MODEL=gemma3:1b
~~~

Si Ollama falla, el backend usa una frase almacenada o un fallback. El dashboard no debería depender de la disponibilidad de IA.

## API principal

Base URL:

~~~text
/api/v1
~~~

Las rutas protegidas requieren la cookie HttpOnly `moodiary_session`. El cliente
usa Axios con `withCredentials: true`.

| Método | Ruta | Uso |
|---|---|---|
| GET | /moods/all | Entradas del usuario |
| POST | /moods | Crear entrada |
| PUT/DELETE | /moods/:entryId | Editar/eliminar entrada propia |
| GET | /moods/average/today | Promedio y cantidad del día |
| GET | /moods/average/by-date | Promedios agrupados |
| GET | /moods/dates | Días registrados |
| GET | /moods/chart | Datos del gráfico |
| GET | /motivationalQuotes/today | Frase del día/IA |
| GET/PATCH | /profile | Perfil propio |
| PATCH | /profile/password | Cambiar contraseña y revocar sesiones anteriores |
| DELETE | /profile/data | Borrar notas y frases personales, conservando la cuenta |
| DELETE | /profile | Eliminar cuenta y datos asociados |
| POST | /auth/register | Crear cuenta e iniciar sesión |
| POST | /auth/login | Iniciar sesión |
| GET | /auth/me | Consultar sesión actual |
| POST | /auth/logout | Revocar sesión |

Los catálogos de emociones, tags y frases son de lectura pública, pero su escritura requiere un ID incluido en ADMIN_USER_IDS.

## Seguridad implementada

- CORS y el guard de origen se configuran con FRONTEND_URLS.
- Se desactiva X-Powered-By y se agregan cabeceras HTTP defensivas.
- Body JSON limitado a 2 MB para permitir fotos de perfil pequeñas.
- Rate limiting básico por IP con respuesta 429.
- Errores CORS responden 403.
- En producción no se imprime el objeto completo de error con SQL y parámetros.
- Rutas globales de escritura requieren administrador.
- Consultas de entradas se filtran por user_id.
- Las fotos de perfil aceptan solo JPG, PNG o WebP de máximo 1 MB y se guardan en PostgreSQL.
- Las acciones de borrado y cambio de contraseña requieren la contraseña actual.
- Ollama no se expone fuera de Docker.
- Migraciones se ejecutan antes del backend.
- Supabase utiliza SSL.

## Docker de producción

El Compose incluye:

~~~text
ollama       → modelo persistente
ollama-init  → descarga inicial
backend      → migraciones + Express
frontend     → opcional; no hace falta usando Vercel
~~~

En el VPS:

~~~bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d --build ollama ollama-init backend
docker-compose --env-file .env.prod -f docker-compose.prod.yml ps
docker-compose --env-file .env.prod -f docker-compose.prod.yml logs -f backend
docker-compose --env-file .env.prod -f docker-compose.prod.yml exec ollama ollama list
~~~

El volumen ollama_data contiene el modelo. No lo elimines al actualizar.

Para producción, enlaza el backend al loopback si Caddy/Nginx actúa como proxy:

~~~yaml
ports:
  - "127.0.0.1:$BACKEND_PORT:5001"
~~~

No publiques el puerto 11434.

## Vercel

~~~text
Root Directory: client
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
~~~

Después de obtener el dominio definitivo, añádelo a `FRONTEND_URLS` y verifica que la cookie pueda viajar entre frontend y API.

## VPS Oracle

~~~text
Image: Ubuntu 24.04 ARM64
Shape: VM.Standard.A1.Flex
Capacity: On-demand
Processor: Ampere ARM
OCPU: 2
Memory: 12 GB
Boot volume: 50–100 GB
Performance: Balanced / 10 VPUs
Encryption: Oracle-managed key
Backups: ninguno automático
~~~

Abre únicamente:

~~~text
22/tcp  SSH
80/tcp  HTTP
443/tcp HTTPS
~~~

Usa Caddy para api.tudominio.com y deja Ollama en la red interna de Docker. Verifica Always Free-eligible y no actualices a Pay As You Go si no aceptas riesgo de cobro.

## Flujo de frase diaria

~~~text
Frontend → /motivationalQuotes/today
        → la cookie HttpOnly identifica la sesión
        → backend calcula estadísticas
        → reutiliza caché IA o llama a Ollama
        → guarda message + source=gemini
        → fallback si Gemini no está disponible
~~~

## Checklist antes de release

~~~bash
cd server
npm run lint
npm run migrations:run

cd ../client
npm run lint
npm run build

cd ..
git diff --check
docker-compose -f docker-compose.prod.yml config --quiet
~~~

Confirma además:

- no hay secretos en el diff;
- Supabase Pooler conecta por SSL;
- La migración `add-local-auth` fue ejecutada en la base de datos;
- FRONTEND_URLS coincide exactamente con Vercel;
- el modelo existe en el VPS;
- Ollama no tiene puerto público;
- el volumen de Ollama persiste;
- la API usa HTTPS.

## Pendientes de código

### Alta prioridad

- Añadir pruebas automatizadas de registro/login, expiración de sesión y aislamiento por usuario.
- Validar con Joi todos los params y query numéricos.
- Añadir esquemas Joi para tags, perfiles, frases y relaciones.
- Sustituir el rate limiter en memoria por Redis si se despliegan varias réplicas.
- Fijar versiones de imágenes Docker; evitar ollama/ollama:latest.
- Configurar rotación y retención de logs.

### Prioridad media

- Añadir helmet cuando se gestione formalmente la dependencia.
- Añadir métricas de latencia sin registrar contenido privado.
- Añadir paginación para entradas e historial.
- Añadir CI para lint, build, migraciones y npm audit.
- Aplicar lazy loading al dashboard y gráficos.

### Prioridad baja

- Documentar OpenAPI.
- Añadir tests E2E con Playwright.
- Definir backup y recuperación de producción.
- Añadir recuperación de contraseña y verificación de correo si el producto las necesita.

## Diagnóstico rápido

### Supabase: ENETUNREACH

Usa el Pooler y:

~~~env
DB_IP_FAMILY=4
~~~

### Foreign key de usuario

Ejecuta la migración `20260917113000-add-local-auth.js` antes de usar el modal.

### Dashboard sin datos

Comprueba por separado:

~~~text
/moods/average/today
/moods/dates
/motivationalQuotes/today
~~~

El frontend usa Promise.allSettled, por lo que una caída de Ollama no debería ocultar el promedio ni el calendario.

### Backend en Docker no inicia

~~~bash
docker-compose -f docker-compose.prod.yml logs backend
~~~

Revisa variables obligatorias, migraciones y conexión con Supabase.
