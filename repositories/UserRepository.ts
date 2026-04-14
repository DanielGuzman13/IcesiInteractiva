import { User, CreateUserInput, UpdateUserInput } from '../models/User';
import { getPostgresPool } from '../lib/database/postgres';

interface UserRow {
  id: string;
  name: string;
  salon: string | null;
  created_at: Date;
  last_login_at: Date;
  total_score: number;
  current_level: number;
}

const normalizeName = (name: string): string => name.trim().toLocaleLowerCase('es-CO');

const hasDatabaseConfig = (): boolean => Boolean(process.env.DATABASE_URL);

const globalForUserRepo = globalThis as typeof globalThis & {
  __icesiUsersById?: Map<string, User>;
  __icesiUsersByName?: Map<string, string>;
};

const inMemoryUsersById = globalForUserRepo.__icesiUsersById ?? new Map<string, User>();
const inMemoryUsersByName = globalForUserRepo.__icesiUsersByName ?? new Map<string, string>();

if (process.env.NODE_ENV !== 'production') {
  globalForUserRepo.__icesiUsersById = inMemoryUsersById;
  globalForUserRepo.__icesiUsersByName = inMemoryUsersByName;
}

const mapUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  salon: row.salon as '205M' | '206M' | undefined,
  createdAt: row.created_at,
  lastLoginAt: row.last_login_at,
  totalScore: row.total_score,
  currentLevel: row.current_level,
});

export abstract class BaseRepository<T> {
  abstract create(data: Partial<T>): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<boolean>;
  abstract findAll(filters?: Partial<T>): Promise<T[]>;
}

export class UserRepository extends BaseRepository<User> {
  async create(userData: CreateUserInput): Promise<User> {
    const name = userData.name?.trim();
    const normalizedName = normalizeName(name ?? '');

    if (!name) {
      throw new Error('El nombre del usuario es obligatorio');
    }

    if (!hasDatabaseConfig()) {
      const now = new Date();
      const existingId = inMemoryUsersByName.get(normalizedName);

      if (existingId) {
        const existingUser = inMemoryUsersById.get(existingId);
        if (existingUser) {
          return existingUser;
        }
      }

      const user: User = {
        id: crypto.randomUUID(),
        name,
        salon: userData.salon,
        createdAt: now,
        lastLoginAt: now,
        totalScore: 0,
        currentLevel: 1,
      };

      inMemoryUsersById.set(user.id, user);
      inMemoryUsersByName.set(normalizedName, user.id);
      return user;
    }

    const pool = getPostgresPool();

    try {
      const result = await pool.query<UserRow>(
        `
          INSERT INTO users (name, name_normalized, salon)
          VALUES ($1, $2, $3)
          RETURNING id, name, salon, created_at, last_login_at, total_score, current_level
        `,
        [name, normalizedName, userData.salon || null]
      );

      return mapUser(result.rows[0]);
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'code' in error && (error as { code?: string }).code === '23505') {
        const existingUser = await this.findByName(name);
        if (existingUser) {
          return existingUser;
        }
      }
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    if (!hasDatabaseConfig()) {
      return inMemoryUsersById.get(id) ?? null;
    }

    const pool = getPostgresPool();
    const result = await pool.query<UserRow>(
      `
        SELECT id, name, salon, created_at, last_login_at, total_score, current_level
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return mapUser(result.rows[0]);
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    if (!hasDatabaseConfig()) {
      const existingUser = inMemoryUsersById.get(id);

      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      const updatedName = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : existingUser.name;
      const updatedUser: User = {
        ...existingUser,
        name: updatedName,
        salon: typeof data.salon === 'string' ? data.salon as '205M' | '206M' : existingUser.salon,
        totalScore: typeof data.totalScore === 'number' ? data.totalScore : existingUser.totalScore,
        currentLevel: typeof data.currentLevel === 'number' ? data.currentLevel : existingUser.currentLevel,
        lastLoginAt: data.lastLoginAt instanceof Date ? data.lastLoginAt : existingUser.lastLoginAt,
      };

      const oldNormalizedName = normalizeName(existingUser.name);
      const newNormalizedName = normalizeName(updatedName);

      inMemoryUsersByName.delete(oldNormalizedName);
      inMemoryUsersByName.set(newNormalizedName, id);
      inMemoryUsersById.set(id, updatedUser);

      return updatedUser;
    }

    const pool = getPostgresPool();
    const updates: string[] = [];
    const values: Array<string | number | Date> = [];

    if (typeof data.name === 'string' && data.name.trim()) {
      values.push(data.name.trim());
      updates.push(`name = $${values.length}`);

      values.push(normalizeName(data.name));
      updates.push(`name_normalized = $${values.length}`);
    }

    if (typeof data.totalScore === 'number') {
      values.push(data.totalScore);
      updates.push(`total_score = $${values.length}`);
    }

    if (typeof data.salon === 'string') {
      values.push(data.salon);
      updates.push(`salon = $${values.length}`);
    }

    if (typeof data.currentLevel === 'number') {
      values.push(data.currentLevel);
      updates.push(`current_level = $${values.length}`);
    }

    if (data.lastLoginAt instanceof Date) {
      values.push(data.lastLoginAt);
      updates.push(`last_login_at = $${values.length}`);
    }

    if (updates.length === 0) {
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }
      return existingUser;
    }

    values.push(id);

    const result = await pool.query<UserRow>(
      `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING id, name, salon, created_at, last_login_at, total_score, current_level
      `,
      values
    );

    if (result.rowCount === 0) {
      throw new Error('Usuario no encontrado');
    }

    return mapUser(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    if (!hasDatabaseConfig()) {
      const existingUser = inMemoryUsersById.get(id);
      if (!existingUser) {
        return false;
      }

      inMemoryUsersById.delete(id);
      inMemoryUsersByName.delete(normalizeName(existingUser.name));
      return true;
    }

    const pool = getPostgresPool();
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findAll(filters?: Partial<User>): Promise<User[]> {
    if (!hasDatabaseConfig()) {
      const users = Array.from(inMemoryUsersById.values());
      return users
        .filter((user) => {
          if (filters?.name && user.name !== filters.name) {
            return false;
          }

          if (typeof filters?.currentLevel === 'number' && user.currentLevel !== filters.currentLevel) {
            return false;
          }

          return true;
        })
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    const pool = getPostgresPool();
    const conditions: string[] = [];
    const values: Array<string | number> = [];

    if (filters?.name) {
      values.push(filters.name);
      conditions.push(`name = $${values.length}`);
    }

    if (typeof filters?.currentLevel === 'number') {
      values.push(filters.currentLevel);
      conditions.push(`current_level = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query<UserRow>(
      `
        SELECT id, name, salon, created_at, last_login_at, total_score, current_level
        FROM users
        ${whereClause}
        ORDER BY created_at ASC
      `,
      values
    );

    return result.rows.map(mapUser);
  }

  // Métodos específicos
  async findByName(name: string): Promise<User | null> {
    const normalizedName = normalizeName(name);

    if (!hasDatabaseConfig()) {
      const userId = inMemoryUsersByName.get(normalizedName);
      if (!userId) {
        return null;
      }
      return inMemoryUsersById.get(userId) ?? null;
    }

    const pool = getPostgresPool();
    const result = await pool.query<UserRow>(
      `
        SELECT id, name, salon, created_at, last_login_at, total_score, current_level
        FROM users
        WHERE name_normalized = $1
        LIMIT 1
      `,
      [normalizedName]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return mapUser(result.rows[0]);
  }

  async updateScore(userId: string, score: number): Promise<User> {
    if (!hasDatabaseConfig()) {
      const existingUser = inMemoryUsersById.get(userId);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      const updatedUser: User = {
        ...existingUser,
        totalScore: existingUser.totalScore + score,
      };

      inMemoryUsersById.set(userId, updatedUser);
      return updatedUser;
    }

    const pool = getPostgresPool();
    const result = await pool.query<UserRow>(
      `
        UPDATE users
        SET total_score = total_score + $1
        WHERE id = $2
        RETURNING id, name, salon, created_at, last_login_at, total_score, current_level
      `,
      [score, userId]
    );

    if (result.rowCount === 0) {
      throw new Error('Usuario no encontrado');
    }

    return mapUser(result.rows[0]);
  }

  async getTopPlayers(limit: number = 10): Promise<User[]> {
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 100)) : 10;

    if (!hasDatabaseConfig()) {
      return Array.from(inMemoryUsersById.values())
        .sort((a, b) => {
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
          return b.lastLoginAt.getTime() - a.lastLoginAt.getTime();
        })
        .slice(0, safeLimit);
    }

    const pool = getPostgresPool();

    const result = await pool.query<UserRow>(
      `
        SELECT id, name, salon, created_at, last_login_at, total_score, current_level
        FROM users
        ORDER BY total_score DESC, last_login_at DESC
        LIMIT $1
      `,
      [safeLimit]
    );

    return result.rows.map(mapUser);
  }

  async getTopPlayersBySalon(salon: string, limit: number = 10): Promise<User[]> {
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 100)) : 10;

    if (!hasDatabaseConfig()) {
      return Array.from(inMemoryUsersById.values())
        .filter(user => user.salon === salon)
        .sort((a, b) => {
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
          return b.lastLoginAt.getTime() - a.lastLoginAt.getTime();
        })
        .slice(0, safeLimit);
    }

    const pool = getPostgresPool();

    const result = await pool.query<UserRow>(
      `
        SELECT id, name, salon, created_at, last_login_at, total_score, current_level
        FROM users
        WHERE salon = $1
        ORDER BY total_score DESC, last_login_at DESC
        LIMIT $2
      `,
      [salon, safeLimit]
    );

    return result.rows.map(mapUser);
  }

  async updateLastLogin(userId: string): Promise<User> {
    if (!hasDatabaseConfig()) {
      const existingUser = inMemoryUsersById.get(userId);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      const updatedUser: User = {
        ...existingUser,
        lastLoginAt: new Date(),
      };

      inMemoryUsersById.set(userId, updatedUser);
      return updatedUser;
    }

    const pool = getPostgresPool();
    const result = await pool.query<UserRow>(
      `
        UPDATE users
        SET last_login_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, name, salon, created_at, last_login_at, total_score, current_level
      `,
      [userId]
    );

    if (result.rowCount === 0) {
      throw new Error('Usuario no encontrado');
    }

    return mapUser(result.rows[0]);
  }
}
