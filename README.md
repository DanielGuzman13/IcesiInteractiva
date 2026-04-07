# ICESI INTERACTIVA ⚽ - Simulación de Desarrollo de Software

**Versión:** 0.1.0  
**Tecnologías:** Next.js (App Router), TypeScript, Tailwind CSS, React 19.

## ¿Qué es este proyecto?

"ICESI INTERACTIVA" es una experiencia gamificada donde un partido de fútbol 2D (vista superior) simula el flujo de un equipo de desarrollo de software real.

La simulación muestra un **partido 11 vs 11 en curso**:
- **Equipo A (Azul)**: Los 11 jugadores representan los distintos **roles de ingeniería de software** con analogías futboleras precisas. Son **interactivos** — al hacer click llevas al reto del rol.
- **Equipo B (Rojo)**: 11 jugadores rivales **solo visuales** (sin roles ni interacción). Representan el equipo contrario.
- **Capitanes**: Cada equipo tiene 1 capitán indicado con el distintivo "C" dorado.

## Distribución de Roles (Equipo A)

### 🥅 Portero — Product Owner
- **Función**: Define la estrategia del producto, decide qué entra y qué no
- **Analogía**: Última línea de decisión (prioridades). Si falla → todo el equipo pierde el rumbo

### 🛡️ Defensas
- **Centrales — QA / Tester (2)**: Validan calidad, detectan errores antes de que "lleguen al usuario"
- **Analogía**: Son los que "evitan el gol" (bugs en producción)
- **Laterales — DevOps (2)**: Automatizan procesos, integran y despliegan, conectan desarrollo con producción
- **Analogía perfecta**: Suben (CI/CD), Bajan (monitoreo, rollback), son puente entre líneas

### ⚙️ Mediocampo
- **Mediocentros — Backend Developers (2)**: Manejan lógica del sistema, conectan frontend con base de datos
- **Analogía**: Son los que distribuyen el juego
- **Volante ofensivo — Tech Lead o Team Manager**: Coordina decisiones técnicas, define cómo se implementa
- **Analogía**: Es el "cerebro" del equipo

### 🎯 Delantera — Frontend Developers (3)
- **Función**: Construyen lo que ve el usuario, interacción directa con el cliente
- **Analogía**: Son los que "meten el gol visible"

### 🧠 Técnico — Arquitecto de Software
- **Función**: Define estructura global, no juega cada jugada pero define cómo juega el equipo
- **Analogía**: Es como un "director invisible" del sistema

## Requisitos e Instalación

1. **Node.js v20+** y **NPM** deben estar instalados.
2. Instala las dependencias del proyecto:
```bash
npm install
```

## ¿Cómo ejecutarlo?

Antes de iniciar, configura tu conexión a PostgreSQL:

1. Crea el archivo `.env.local` con base en `.env.example`.
2. Define `DATABASE_URL` apuntando a tu base de datos.
3. Ejecuta el esquema y datos iniciales:

```bash
psql "$DATABASE_URL" -f lib/database/schema.sql
psql "$DATABASE_URL" -f lib/database/seed-data.sql
```

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

### 📁 Arquitectura Cliente-Servidor
```
📁 models/                    # Entidades de datos
  📄 User.ts                  # Usuario/Estudiante
  📄 GameSession.ts           # Sesión de juego
  📄 Play.ts                  # Jugadas predefinidas
  📄 Challenge.ts             # Retos/Desafíos
  📄 UserPlayProgress.ts      # Progreso del usuario
  📄 UserAnswer.ts            # Respuestas del usuario
  📄 MatchState.ts            # Estado del partido

📁 repositories/              # Capa de datos (Repository Pattern)
  📄 UserRepository.ts        # Gestión de usuarios
  📄 GameSessionRepository.ts  # Sesiones de juego
  📄 index.ts                 # Exports centralizados

📁 controllers/               # Lógica de negocio
  📄 UserController.ts         # Login, perfiles, ranking
  📄 index.ts                 # Exports

📁 app/api/                   # Next.js API Routes
  📁 auth/login/route.ts       # POST /api/auth/login
  📁 users/[userId]/route.ts   # GET/PUT /api/users/[userId]
  📁 ranking/route.ts          # GET /api/ranking

📁 lib/database/              # Base de datos
  📄 schema.sql                # Esquema PostgreSQL
  📄 seed-data.sql             # Datos iniciales
```

### 🎮 Componentes del Juego
| Archivo | Descripción |
|---------|-------------|
| `lib/jugadores.ts` | Fuente de verdad: 22 jugadores con roles actualizados |
| `components/game/Cancha.tsx` | Campo de fútbol 2D (16:9), CSS puro + Tailwind |
| `components/game/Jugador.tsx` | Componente por jugador: Equipo A interactivo, Equipo B visual |
| `app/game/page.tsx` | Página principal del partido |
| `app/game/reto/[rol]/page.tsx` | Ruta dinámica de reto por rol |

### 🔧 Nuevas Características
- **Login simplificado**: Solo nombre de usuario único
- **API REST**: Endpoints para usuarios y ranking
- **Base de datos**: PostgreSQL con esquema completo
- **Arquitectura limpia**: Models, Repositories, Controllers separados
- **Roles actualizados**: Distribución futbolera realista

## 🚀 API Endpoints

### Autenticación
```bash
POST /api/auth/login
Body: { "name": "nombre-usuario" }
```

### Usuarios
```bash
GET /api/users/[userId]           # Perfil
PUT /api/users/[userId]           # Actualizar score
GET /api/ranking?limit=10         # Ranking top jugadores
```

## Próximos Pasos

- [ ] Retos reales por rol dentro de `app/game/reto/[rol]/page.tsx`
- [ ] Balón dinámico que fluye entre roles
- [ ] Animaciones (Framer Motion)
- [ ] Puntuación y estado global del partido
- [ ] Integración con Blockly / API externa
