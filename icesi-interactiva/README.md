# ICESI INTERACTIVA ⚽ - Simulación de Desarrollo de Software

**Versión:** 0.1.0  
**Tecnologías:** Next.js (App Router), TypeScript, Tailwind CSS, React 19.

## ¿Qué es este proyecto?

"ICESI INTERACTIVA" es una experiencia gamificada donde un partido de fútbol 2D (vista superior) simula el flujo de un equipo de desarrollo de software real.

La simulación muestra un **partido 11 vs 11 en curso**:
- **Equipo A (Azul)**: Los 11 jugadores representan los distintos **roles de ingeniería de software** (Backend, Frontend, QA, DevOps, Arquitecto, Product Owner, Release Manager, Team Manager). Son **interactivos** — al hacer click llevas al reto del rol.
- **Equipo B (Rojo)**: 11 jugadores rivales **solo visuales** (sin roles ni interacción). Representan el equipo contrario.
- **Capitanes**: Cada equipo tiene 1 capitán indicado con el distintivo "C" dorado.

## Requisitos e Instalación

1. **Node.js v20+** y **NPM** deben estar instalados.
2. Instala las dependencias del proyecto:
```bash
npm install
```

## ¿Cómo ejecutarlo?

```bash
npm run dev
```
Luego abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Rutas disponibles:
| Ruta | Descripción |
|------|-------------|
| `/` | Landing page del juego |
| `/game` | Cancha interactiva 11 vs 11 |
| `/game/reto/[rol]` | Página del reto del rol (ej. `/game/reto/backend`) |

## Estructura del Proyecto

| Archivo | Descripción |
|---------|-------------|
| `lib/jugadores.ts` | Fuente de verdad: 22 jugadores (11 A + 11 B), roles, posiciones, capitanes |
| `components/game/Cancha.tsx` | Campo de fútbol 2D (16:9), dibujado en CSS puro + Tailwind |
| `components/game/Jugador.tsx` | Componente por jugador: si es Equipo A → `<Link>` interactivo; si es Equipo B → visual solo |
| `app/game/page.tsx` | Página principal del partido |
| `app/game/reto/[rol]/page.tsx` | Ruta dinámica de reto por rol (placeholder listo para integrar lógica) |

## Próximos Pasos

- Retos reales por rol dentro de `app/game/reto/[rol]/page.tsx`
- Balón dinámico que fluye entre roles
- Animaciones (Framer Motion)
- Puntuación y estado global del partido
- Integración con Blockly / API externa
