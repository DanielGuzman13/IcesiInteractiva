import { GameSession, CreateGameSessionInput, UpdateGameSessionInput } from '../models/GameSession';
import { BaseRepository } from './UserRepository';
import { getPostgresPool } from '../lib/database/postgres';

interface GameSessionRow {
  id: string;
  user_id: string;
  started_at: Date;
  current_play_id: string | null;
  score: number;
  completed_challenges: number;
  status: string;
  completed_at: Date | null;
}

const hasDatabaseConfig = (): boolean => Boolean(process.env.DATABASE_URL);

const globalForSessionRepo = globalThis as typeof globalThis & {
  __icesiSessionsById?: Map<string, GameSession>;
};

const inMemorySessionsById = globalForSessionRepo.__icesiSessionsById ?? new Map<string, GameSession>();

if (process.env.NODE_ENV !== 'production') {
  globalForSessionRepo.__icesiSessionsById = inMemorySessionsById;
}

const mapGameSession = (row: GameSessionRow): GameSession => ({
  id: row.id,
  userId: row.user_id,
  startedAt: row.started_at,
  currentPlayId: row.current_play_id,
  score: row.score,
  completedChallenges: row.completed_challenges,
  status: row.status as 'active' | 'paused' | 'completed' | 'abandoned',
  completedAt: row.completed_at || undefined,
});

export class GameSessionRepository extends BaseRepository<GameSession> {
  async create(sessionData: CreateGameSessionInput): Promise<GameSession> {
    if (!hasDatabaseConfig()) {
      const session: GameSession = {
        id: crypto.randomUUID(),
        userId: sessionData.userId,
        startedAt: new Date(),
        currentPlayId: sessionData.currentPlayId || null,
        score: 0,
        completedChallenges: 0,
        status: 'active',
      };
      inMemorySessionsById.set(session.id, session);
      return session;
    }

    const pool = getPostgresPool();
    const result = await pool.query<GameSessionRow>(
      `
        INSERT INTO game_sessions (user_id, current_play_id)
        VALUES ($1, $2)
        RETURNING id, user_id, started_at, current_play_id, score, completed_challenges, status, completed_at
      `,
      [sessionData.userId, sessionData.currentPlayId || null]
    );

    return mapGameSession(result.rows[0]);
  }

  async findById(id: string): Promise<GameSession | null> {
    if (!hasDatabaseConfig()) {
      return inMemorySessionsById.get(id) ?? null;
    }

    const pool = getPostgresPool();
    const result = await pool.query<GameSessionRow>(
      `
        SELECT id, user_id, started_at, current_play_id, score, completed_challenges, status, completed_at
        FROM game_sessions
        WHERE id = $1
        LIMIT 1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return mapGameSession(result.rows[0]);
  }

  async update(id: string, data: UpdateGameSessionInput): Promise<GameSession> {
    if (!hasDatabaseConfig()) {
      const existing = inMemorySessionsById.get(id);
      if (!existing) throw new Error('Sesión de juego no encontrada');
      
      const updated: GameSession = {
        ...existing,
        currentPlayId: data.currentPlayId !== undefined ? data.currentPlayId : existing.currentPlayId,
        score: typeof data.score === 'number' ? data.score : existing.score,
        completedChallenges: typeof data.completedChallenges === 'number' ? data.completedChallenges : existing.completedChallenges,
        status: data.status ? (data.status as any) : existing.status,
        completedAt: data.completedAt !== undefined ? data.completedAt : existing.completedAt,
      };
      
      inMemorySessionsById.set(id, updated);
      return updated;
    }

    const pool = getPostgresPool();
    const updates: string[] = [];
    const values: Array<string | number | Date | null> = [];

    if (data.currentPlayId !== undefined) {
      values.push(data.currentPlayId);
      updates.push(`current_play_id = $${values.length}`);
    }

    if (typeof data.score === 'number') {
      values.push(data.score);
      updates.push(`score = $${values.length}`);
    }

    if (typeof data.completedChallenges === 'number') {
      values.push(data.completedChallenges);
      updates.push(`completed_challenges = $${values.length}`);
    }

    if (data.status) {
      values.push(data.status);
      updates.push(`status = $${values.length}`);
    }

    if (data.completedAt !== undefined) {
      values.push(data.completedAt);
      updates.push(`completed_at = $${values.length}`);
    }

    if (updates.length === 0) {
      const existingSession = await this.findById(id);
      if (!existingSession) {
        throw new Error('Sesión de juego no encontrada');
      }
      return existingSession;
    }

    values.push(id);

    const result = await pool.query<GameSessionRow>(
      `
        UPDATE game_sessions
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING id, user_id, started_at, current_play_id, score, completed_challenges, status, completed_at
      `,
      values
    );

    if (result.rowCount === 0) {
      throw new Error('Sesión de juego no encontrada');
    }

    return mapGameSession(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    if (!hasDatabaseConfig()) {
      return inMemorySessionsById.delete(id);
    }

    const pool = getPostgresPool();
    const result = await pool.query('DELETE FROM game_sessions WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findAll(filters?: Partial<GameSession>): Promise<GameSession[]> {
    if (!hasDatabaseConfig()) {
      let sessions = Array.from(inMemorySessionsById.values());
      if (filters?.userId) sessions = sessions.filter(s => s.userId === filters.userId);
      if (filters?.status) sessions = sessions.filter(s => s.status === filters.status);
      return sessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    }

    const pool = getPostgresPool();
    const conditions: string[] = [];
    const values: Array<string | number> = [];

    if (filters?.userId) {
      values.push(filters.userId);
      conditions.push(`user_id = $${values.length}`);
    }

    if (filters?.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query<GameSessionRow>(
      `
        SELECT id, user_id, started_at, current_play_id, score, completed_challenges, status, completed_at
        FROM game_sessions
        ${whereClause}
        ORDER BY started_at DESC
      `,
      values
    );

    return result.rows.map(mapGameSession);
  }

  // Métodos específicos
  async findActiveSessions(): Promise<GameSession[]> {
    if (!hasDatabaseConfig()) {
      return Array.from(inMemorySessionsById.values())
        .filter(s => s.status === 'active')
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    }

    const pool = getPostgresPool();
    const result = await pool.query<GameSessionRow>(
      `
        SELECT id, user_id, started_at, current_play_id, score, completed_challenges, status, completed_at
        FROM game_sessions
        WHERE status = 'active'
        ORDER BY started_at DESC
      `
    );

    return result.rows.map(mapGameSession);
  }

  async findByUserId(userId: string): Promise<GameSession[]> {
    if (!hasDatabaseConfig()) {
      return Array.from(inMemorySessionsById.values())
        .filter(s => s.userId === userId)
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    }

    const pool = getPostgresPool();
    const result = await pool.query<GameSessionRow>(
      `
        SELECT id, user_id, started_at, current_play_id, score, completed_challenges, status, completed_at
        FROM game_sessions
        WHERE user_id = $1
        ORDER BY started_at DESC
      `,
      [userId]
    );

    return result.rows.map(mapGameSession);
  }

  async updateScore(sessionId: string, score: number): Promise<GameSession> {
    if (!hasDatabaseConfig()) {
      const existing = inMemorySessionsById.get(sessionId);
      if (!existing) throw new Error('Sesión de juego no encontrada');
      const updated = { ...existing, score: existing.score + score };
      inMemorySessionsById.set(sessionId, updated);
      return updated;
    }

    const pool = getPostgresPool();
    const result = await pool.query<GameSessionRow>(
      `
        UPDATE game_sessions
        SET score = score + $1
        WHERE id = $2
        RETURNING id, user_id, started_at, current_play_id, score, completed_challenges, status, completed_at
      `,
      [score, sessionId]
    );

    if (result.rowCount === 0) {
      throw new Error('Sesión de juego no encontrada');
    }

    return mapGameSession(result.rows[0]);
  }

  async completeSession(sessionId: string): Promise<GameSession> {
    if (!hasDatabaseConfig()) {
      const existing = inMemorySessionsById.get(sessionId);
      if (!existing) throw new Error('Sesión de juego no encontrada');
      const updated: GameSession = { ...existing, status: 'completed', completedAt: new Date() };
      inMemorySessionsById.set(sessionId, updated);
      return updated;
    }

    const pool = getPostgresPool();
    const result = await pool.query<GameSessionRow>(
      `
        UPDATE game_sessions
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, user_id, started_at, current_play_id, score, completed_challenges, status, completed_at
      `,
      [sessionId]
    );

    if (result.rowCount === 0) {
      throw new Error('Sesión de juego no encontrada');
    }

    return mapGameSession(result.rows[0]);
  }
}
