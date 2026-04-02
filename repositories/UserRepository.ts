import { User, CreateUserInput, UpdateUserInput } from '../models/User';

export abstract class BaseRepository<T> {
  abstract create(data: Partial<T>): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<boolean>;
  abstract findAll(filters?: Partial<T>): Promise<T[]>;
}

export class UserRepository extends BaseRepository<User> {
  async create(userData: CreateUserInput): Promise<User> {
    // Implementación con PostgreSQL/Prisma/Drizzle
    throw new Error('Not implemented');
  }

  async findById(id: string): Promise<User | null> {
    throw new Error('Not implemented');
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Not implemented');
  }

  async findAll(filters?: Partial<User>): Promise<User[]> {
    throw new Error('Not implemented');
  }

  // Métodos específicos
  async findByName(name: string): Promise<User | null> {
    throw new Error('Not implemented');
  }

  async updateScore(userId: string, score: number): Promise<User> {
    throw new Error('Not implemented');
  }

  async getTopPlayers(limit: number = 10): Promise<User[]> {
    throw new Error('Not implemented');
  }

  async updateLastLogin(userId: string): Promise<User> {
    throw new Error('Not implemented');
  }
}
