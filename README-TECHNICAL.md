# ICESI INTERACTIVA - Documentación Técnica

## 🏗️ Arquitectura del Sistema

### Patrón Arquitectural
- **Cliente-Servidor** con Next.js Full-Stack
- **Repository Pattern** para acceso a datos
- **Model-View-Controller** separado en carpetas
- **API Routes** de Next.js para backend

### 📊 Base de Datos

#### Esquema PostgreSQL
```sql
-- Tablas principales
users                     -- Usuarios/Estudiantes
game_sessions            -- Sesiones de juego
plays                    -- Jugadas predefinidas
play_steps              -- Pasos de jugada
challenges              -- Retos/Desafíos
user_play_progress      -- Progreso del usuario
user_answers            -- Respuestas del usuario
match_states            -- Estado del partido
game_config             -- Configuración global
```

#### Relaciones Clave
- `users` → `game_sessions` (1:N)
- `plays` → `play_steps` (1:N)
- `play_steps` → `challenges` (1:1)
- `users` → `user_play_progress` (1:N)
- `users` → `user_answers` (1:N)

### 🔧 Tecnologías

#### Frontend
- **Next.js 16.2.1** (App Router)
- **React 19.2.4**
- **TypeScript 5**
- **Tailwind CSS 4**

#### Backend
- **Next.js API Routes**
- **TypeScript**
- **PostgreSQL** (recomendado)
- **Prisma/Drizzle** (por implementar)

#### Estado Global
- **Zustand** (recomendado para cliente)
- **Base de datos** (estado persistente)

## 🎮 Lógica del Juego

### Flujo de Usuario
1. **Login** → `POST /api/auth/login` (nombre único)
2. **Crear sesión** → `GameSession` activa
3. **Seleccionar jugada** → `Play` predefinida
4. **Ejecutar flujo** → `PlaySteps` secuenciales
5. **Resolver retos** → `Challenge` por rol
6. **Actualizar progreso** → `UserPlayProgress`
7. **Registrar respuestas** → `UserAnswer`

### Estados del Sistema
- **MatchState**: Posición del balón, puntaje, tiempo
- **BallState**: Coordenadas, movimiento actual
- **UserPlayProgress**: Paso actual, completados

### Roles y Posiciones
```
🥅 Portero (Product Owner)
🛡️ Defensas (QA/Tester x2, DevOps x2)
⚙️ Mediocampo (Backend x2, Team Manager)
🎯 Delantera (Frontend x3)
🧠 Técnico (Arquitecto) - Fuera de campo
```

## 🔌 API Design

### Endpoints
```
POST   /api/auth/login           # Login usuario
GET    /api/users/[userId]       # Perfil usuario
PUT    /api/users/[userId]       # Actualizar score
GET    /api/ranking              # Ranking jugadores
```

### Response Patterns
```typescript
// Success
{ user: { id, name, totalScore, currentLevel } }

// Error
{ error: "Mensaje descriptivo" } // Status 400/404/500
```

## 📁 Estructura de Código

### Models (Entidades)
- **User**: Usuario del sistema
- **GameSession**: Sesión individual
- **Play**: Flujo completo
- **PlayStep**: Paso individual
- **Challenge**: Reto específico
- **UserPlayProgress**: Progreso en jugada
- **UserAnswer**: Respuesta a reto
- **MatchState**: Estado del partido

### Repositories (Acceso a Datos)
```typescript
abstract class BaseRepository<T> {
  abstract create(data: Partial<T>): Promise<T>
  abstract findById(id: string): Promise<T | null>
  abstract update(id: string, data: Partial<T>): Promise<T>
  abstract delete(id: string): Promise<boolean>
  abstract findAll(filters?: Partial<T>): Promise<T[]>
}
```

### Controllers (Lógica de Negocio)
- **UserController**: Autenticación, perfiles, ranking
- **GameSessionController**: Sesiones, progreso
- **ChallengeController**: Retos, validaciones

## 🔄 Flujo de Datos

### Login Flow
```
Client → POST /api/auth/login
UserController.login()
→ UserRepository.findByName()
→ UserRepository.create() (si no existe)
→ UserRepository.updateLastLogin()
→ Response: { user }
```

### Game Flow
```
Client → Seleccionar jugada
→ GameSessionRepository.create()
→ MatchStateRepository.create()
→ Iniciar secuencia de PlaySteps
→ Mostrar retos según rol
→ Actualizar UserPlayProgress
→ Registrar UserAnswer
```

## 🚀 Deployment Considerations

### Variables de Entorno
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NODE_ENV="production"
```

### Base de Datos
- **PostgreSQL** recomendado para producción
- **Migraciones automáticas con Prisma/Drizzle**
- **Seed data para desarrollo**

### Performance
- **Caching**: Redis para sesiones activas
- **CDN**: Assets estáticos
- **API Rate Limiting**: Prevenir abuso

## 🧪 Testing Strategy

### Unit Tests
- **Models**: Validaciones de datos
- **Repositories**: Mock de base de datos
- **Controllers**: Lógica de negocio

### Integration Tests
- **API Routes**: End-to-end
- **Database**: Migraciones y seeds

### E2E Tests
- **Playwright**: Flujo completo del juego
- **Login → Jugar → Ranking**

## 📈 Escalabilidad

### Horizontal Scaling
- **Stateless API Routes**
- **Database connection pooling**
- **Load balancing**

### Vertical Scaling
- **Database indexing optimizado**
- **Caching strategies**
- **Background jobs para estadísticas**

## 🔒 Seguridad

### Consideraciones
- **Input validation** en todos los endpoints
- **SQL injection prevention** con ORM
- **Rate limiting** por usuario/IP
- **CORS** configurado apropiadamente

### Datos Sensibles
- **Sin passwords** (login por nombre único)
- **Datos anónimos** para estadísticas
- **GDPR compliance** si aplica
