# ICESI INTERACTIVA ⚽ - Simulación de Desarrollo de Software

**Versión:** 0.1.0  
**Tecnologías:** Next.js (App Router), TypeScript, Tailwind CSS, React 19, PostgreSQL.

## 📋 Requisitos Previos

Antes de instalar y ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** v20 o superior ([descargar aquí](https://nodejs.org/))
- **NPM** (viene incluido con Node.js)
- **PostgreSQL** v14 o superior ([descargar aquí](https://www.postgresql.org/download/))

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd IcesiInteractiva
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar PostgreSQL

Tienes tres opciones: instalación local, Docker, o script de automatización.

#### Opción A: Script de Automatización (Recomendado)

Esta opción configura automáticamente la base de datos y el archivo de configuración.

```bash
# Usar configuración por defecto (postgres/postgres)
npm run setup-db

# O especificar contraseña, usuario, host y puerto personalizados
node setup-database.js <contraseña> <usuario> <host> <puerto>

# Ejemplo con configuración personalizada
node setup-database.js mi_contraseña postgres localhost 5432
```

El script:
- ✅ Crea la base de datos `icesi_interactiva`
- ✅ Ejecuta el schema.sql automáticamente
- ✅ Crea el archivo `.env.local` con la configuración correcta
- ✅ Verifica que PostgreSQL esté ejecutándose

#### Opción B: Instalación Local

##### 3.1. Crear la base de datos

Abre una terminal o usa pgAdmin para crear la base de datos:

```bash
# Acceder a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE icesi_interactiva;

# Salir de PostgreSQL
\q
```

##### 3.2. Ejecutar el esquema de la base de datos

```bash
psql -U postgres -d icesi_interactiva -f lib/database/schema.sql
```

##### 3.3. Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/icesi_interactiva
```

#### Opción C: Docker (Recomendado)

Si prefieres usar Docker para PostgreSQL, ejecuta:

```bash
# Crear y ejecutar contenedor de PostgreSQL
docker run --name icesi-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=icesi_interactiva \
  -p 5433:5432 \
  -d postgres:14

# Esperar unos segundos para que el contenedor inicie

# Ejecutar el esquema de la base de datos
docker exec -i icesi-postgres psql -U postgres -d icesi_interactiva < lib/database/schema.sql
```

**Comandos útiles de Docker:**

```bash
# Ver logs del contenedor
docker logs icesi-postgres

# Detener el contenedor
docker stop icesi-postgres

# Iniciar el contenedor
docker start icesi-postgres

# Eliminar el contenedor
docker rm icesi-postgres
```

Esto creará todas las tablas necesarias incluyendo:
- `users` - Usuarios/Estudiantes
- `game_sessions` - Sesiones de juego
- `user_answers` - Respuestas de usuarios
- `challenges` - Retos/Desafíos
- Y más tablas de soporte

### 4. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/icesi_interactiva
```

**Importante:** Reemplaza `tu_password` con la contraseña de tu usuario de PostgreSQL.

### 5. Ejecutar el proyecto

```bash
npm run dev
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

## 🎮 Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page del juego |
| `/game` | Cancha interactiva 11 vs 11 |
| `/game/reto/[rol]` | Página del reto del rol (ej. `/game/reto/backend`) |
| `/admin/ranking` | Ranking en vivo por salón (requiere contraseña) |

## 🔐 Ranking de Administración

El ranking en tiempo real está disponible en `/admin/ranking` con las siguientes características:

- **Contraseña de acceso:** `icesi2024`
- **Funcionalidades:**
  - Ranking por salón (205M y 206M)
  - Actualización automática cada 3 segundos
  - Visualización de puntajes en tiempo real mientras los jugadores juegan

## 🏆 Distribución de Roles (Equipo A)

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

## 🚀 API Endpoints

### Autenticación
```bash
POST /api/auth/login
Body: { "name": "nombre-usuario", "salon": "205M" }
```

### Usuarios
```bash
GET /api/auth/me                    # Usuario actual
GET /api/ranking?limit=10          # Ranking global
GET /api/ranking-salon?salon=205M   # Ranking por salón
```

### Sesiones de Juego
```bash
POST /api/sessions                 # Crear sesión
GET /api/sessions?userId=xxx       # Obtener sesión activa
```

### Respuestas de Usuario
```bash
POST /api/answers                  # Guardar respuesta
GET /api/answers?userId=xxx        # Obtener respuestas
```

## 📁 Estructura del Proyecto

```
📁 app/
  📁 api/                          # Next.js API Routes
    📁 auth/login/route.ts         # Login
    📁 auth/me/route.ts            # Usuario actual
    📁 sessions/route.ts           # Sesiones de juego
    📁 answers/route.ts            # Respuestas de usuario
    📁 ranking/route.ts           # Ranking global
    📁 ranking-salon/route.ts      # Ranking por salón
  📁 admin/ranking/page.tsx       # Página de ranking admin
  📁 game/                         # Páginas del juego

📁 components/game/                # Componentes del juego
  � Cancha.tsx                   # Campo de fútbol 2D
  📄 HUD.tsx                      # HUD con puntaje y tiempo
  📄 reto/arquitecto/             # Retos del arquitecto

� models/                        # Entidades de datos
  📄 User.ts                      # Usuario
  📄 GameSession.ts               # Sesión de juego
  📄 UserAnswer.ts                # Respuestas

📁 repositories/                  # Capa de datos
  📄 UserRepository.ts            # Gestión de usuarios
  📄 GameSessionRepository.ts     # Sesiones de juego
  📄 UserAnswerRepository.ts      # Respuestas de usuario

📁 controllers/                   # Lógica de negocio
  📄 UserController.ts            # Login, perfiles, ranking

� lib/database/                  # Base de datos
  � schema.sql                    # Esquema PostgreSQL
  � postgres.ts                  # Configuración de conexión

📁 hooks/                         # React hooks
  📄 useGamePersistence.ts        # Hook de persistencia
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## � Notas Importantes

- El proyecto usa **cookies httpOnly** para autenticación
- El puntaje se guarda en **PostgreSQL** y se actualiza en tiempo real
- El ranking de administración usa **polling** cada 3 segundos para actualización en tiempo real
- Los usuarios pueden seleccionar su salón (205M o 206M) al iniciar sesión

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté ejecutándose
- Verifica que la base de datos `icesi_interactiva` exista
- Verifica que la contraseña en `.env.local` sea correcta

### Error de dependencias
- Elimina `node_modules` y `package-lock.json`
- Ejecuta `npm install` nuevamente

## 📄 Licencia

Este proyecto es propiedad del Programa de Ingeniería de Sistemas de la Universidad Icesi.
