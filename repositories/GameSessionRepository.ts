import { GameSession, CreateGameSessionInput, UpdateGameSessionInput } from '../models/GameSession';
import { BaseRepository } from './UserRepository';

export class GameSessionRepository extends BaseRepository<GameSession> {
  async create(sessionData: CreateGameSessionInput): Promise<GameSession> {
    throw new Error('Not implemented');
  }

  async findById(id: string): Promise<GameSession | null> {
    throw new Error('Not implemented');
  }

  async update(id: string, data: UpdateGameSessionInput): Promise<GameSession> {
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Not implemented');
  }

  async findAll(filters?: Partial<GameSession>): Promise<GameSession[]> {
    throw new Error('Not implemented');
  }

  // Métodos específicos
  async findActiveSessions(): Promise<GameSession[]> {
    throw new Error('Not implemented');
  }

  async findByUserId(userId: string): Promise<GameSession[]> {
    throw new Error('Not implemented');
  }

  async updateScore(sessionId: string, score: number): Promise<GameSession> {
    throw new Error('Not implemented');
  }

  async completeSession(sessionId: string): Promise<GameSession> {
    throw new Error('Not implemented');
  }
}
