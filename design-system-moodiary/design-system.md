# Moodiary Calm Active

## Dirección

Moodiary es una herramienta de registro emocional de uso frecuente. El diseño debe sentirse seguro, ligero y fácil de escanear: una acción principal por pantalla, texto legible y espacio suficiente para escribir sin que el panel se sienta vacío.

La dirección prioriza blanco, celeste suave y grises para que el diario se sienta limpio y fácil de leer. El azul pizarra sostiene las acciones principales y el celeste se reserva para superficies de apoyo, selección y foco. Las emociones siguen usando emoji porque son el contenido del producto, no un reemplazo de iconos de navegación.

## Auditoría de diseño

**Evidencia:** revisión de código y estructura local. No se contó con capturas ni analítica de uso.

| Prioridad | Hallazgo | Consecuencia | Decisión |
|---|---|---|---|
| P0 | Las cards de notas tenían `w-[110%]` y el contenido no estaba aislado con `min-w-0`. | El expandido podía crecer horizontalmente y romper el viewport. | Card `w-full`, contenido vertical, `overflow-wrap:anywhere` y control explícito de expansión. |
| P1 | La escala tipográfica mezclaba `text-5xl`, `text-6xl`, Dosis, Delius y valores ad hoc. | En móvil el prompt y las emociones competían con la acción de escribir. | Escala fluida y un solo display para el prompt; cuerpo estable en 16px. |
| P1 | El dashboard tenía navegación persistente, pero sin una jerarquía clara entre check-in, historial y estadísticas. | El usuario debía interpretar demasiado antes de registrar su estado. | Check-in primero, historial como navegación secundaria, estadísticas como lectura posterior. |
| P1 | Varias pantallas usan cards y sombras distintas. | La interfaz no comunica un sistema único. | Radios de 12/16/20px, sombras suaves y un solo acento. |
| P2 | La navegación y algunos iconos dependían de contexto visual, mientras que los estados vacíos/error eran mínimos. | Menor descubribilidad para teclado, touch y lectores de pantalla. | Nombres de acción explícitos, live regions y estados de recuperación. |

## Tokens

Los valores canónicos viven en `design-tokens.json` y `design-system.css`.

### Color

- `#FFFFFF` Fondo de aplicación.
- `#FFFFFF` Superficie de lectura.
- `#455763` Acción primaria. Debe llevar texto blanco.
- `#9CCDD8` Foco, selección y apoyo celeste.
- `#3F4B52` Texto principal.
- `#68777D` Texto secundario, con contraste suficiente.
- `#D8E3E6` Borde y separación.
- `#B64242` Error.

No añadir nuevos colores de marca por componente. El rojo queda reservado a error, el celeste a selección y el azul pizarra a acciones principales.

### Tipografía

- Dosis: títulos de página y prompt de check-in.
- Delius: lectura, labels y notas.
- Lobster: frases motivacionales breves, nunca para botones o instrucciones.
- El texto de lectura parte de 1rem con `line-height: 1.5`.
- El prompt usa `clamp()` y no supera 3.5rem.

### Layout y responsive

- Base de espaciado de 4px, usando principalmente 8, 12, 16, 20 y 24px.
- Padding de página: `clamp(12px, 3vw, 32px)`.
- Un solo flujo vertical en menos de 768px.
- Targets táctiles de al menos 44px.
- Las cards nunca usan anchos superiores al contenedor.
- El contenido principal usa `min-width: 0` para evitar overflow por texto, gráficos o flex children.

## Contratos de componentes

### Check-in emocional

Debe tener un H1 claro, un `fieldset` con `legend` para las emociones, cinco botones con `aria-pressed`, un textarea con límite visible y una acción primaria deshabilitada durante el envío. El Enter envía solo cuando no se está usando Shift.

### NoteCard

Anatomía: hora, emoción, texto y control de expansión. El cuerpo se recorta verticalmente, nunca horizontalmente. La acción debe anunciar si está expandida y usar `aria-controls`. En móvil la emoción queda arriba a la derecha y el botón ocupa el ancho disponible.

### Estadísticas

Primero el promedio y la frase, después el gráfico y finalmente el calendario. Loading conserva las dimensiones del contenido. Empty state explica que se debe registrar una emoción. Error ofrece recuperación y no expone detalles técnicos.

### Navegación

Sidebar en desktop; drawer accesible en móvil. Los labels son funcionales: `Inicio`, `Estadísticas`, `Notas`. El calendario filtra la lista sin borrar el contexto del usuario.

## Referencias de patrón

Se revisaron referencias de Pinterest de mood trackers y chat mobile para estudiar patrones de selección rápida, lectura por capas e historial:

- [Mood Tracker Mobile App UI Design](https://uk.pinterest.com/pin/mood-tracker-mobile-app-ui-design--1060527412252395473/)
- [Clean Chat app mobile UX/UI](https://in.pinterest.com/pin/clean-chat-app-mobile-uxui--12244230229890671/)
- [Mood Tracker App ideas](https://www.pinterest.com/pin/mood-tracker-app--417990409140676278/)

Se toman como referencias de interacción y densidad, no como instrucciones para copiar marcas, layouts exactos o assets.

## Instrucciones para agentes de código

1. Usa los tokens de `design-tokens.json`; no inventes colores por componente.
2. Conserva un único acento ámbar. Usa rojo solo para errores.
3. Mantén el check-in como acción primaria y no lo escondas detrás de navegación.
4. Toda card debe ser `w-full`, tener `min-w-0` en hijos flex y declarar su comportamiento menor a 768px.
5. Todo control debe tener nombre visible o `aria-label`, foco visible y estado disabled/loading.
6. No uses hover como única forma de descubrir una acción.
7. Respeta `prefers-reduced-motion` y evita animar propiedades de layout.
