# Hotfix — autenticación cross-site

Fecha: 2026-09-17

## Problema

El frontend y el API se sirven desde dominios completamente distintos. La
cookie de sesión con `SameSite=Lax` no viajaba en las peticiones `fetch`/Axios
cross-site, por lo que el usuario parecía cerrar sesión inmediatamente o las
rutas protegidas respondían `401`.

## Cambio aplicado

- Producción usa `SameSite=None; Secure` para `moodiary_session`.
- Axios mantiene `withCredentials: true`.
- CORS conserva `credentials: true` y limita los orígenes a `FRONTEND_URLS`.
- El backend bloquea peticiones de escritura cuyo `Origin` no esté permitido.
- El valor por defecto de desarrollo sigue siendo `SameSite=Lax` para permitir
  trabajar sobre HTTP local.

## Configuración obligatoria de producción

```env
AUTH_COOKIE_SAME_SITE=none
AUTH_COOKIE_SECURE=true
FRONTEND_URLS=https://tu-frontend.com
```

El API debe exponerse por HTTPS. `SameSite=None` será rechazado por el
navegador si la cookie no incluye `Secure`.

## Despliegue

1. Actualizar `server/.env.production`.
2. Ejecutar la migración de autenticación si aún no se ejecutó:

   ```bash
   cd server
   npm run migrations:run
   ```

3. Reconstruir y reiniciar el backend y el frontend.
4. Confirmar en DevTools que `moodiary_session` aparece con `HttpOnly`,
   `Secure` y `SameSite=None`.

## Validación

El cambio fue validado con lint y compilación del cliente, lint y comprobación
de sintaxis del servidor, y revisión visual del modal en escritorio y móvil.

## Cambio IA — Gemini

Ollama queda conservado pero desconectado del flujo normal. Sus archivos, imagen
Docker y volumen no se eliminan; los servicios tienen el perfil opcional
`ollama-disabled` y no arrancan por defecto. El proveedor activo es Gemini vía
`GEMINI_API_KEY` en el backend.

No guardes la clave en Git ni en variables `VITE_*`. Como la clave fue pegada en
un chat, revócala y genera una nueva antes de usar producción.
