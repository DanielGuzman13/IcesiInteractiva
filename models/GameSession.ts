export interface GameSession {
  id: string;
  userId: string;
  startedAt: Date;
  currentPlayId: string | null;
  score: number;
  completedChallenges: number;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  completedAt?: Date;
}

export interface CreateGameSessionInput {
  userId: string;
  currentPlayId?: string;
}

export interface UpdateGameSessionInput {
  currentPlayId?: string;
  score?: number;
  completedChallenges?: number;
  status?: 'active' | 'paused' | 'completed' | 'abandoned';
  completedAt?: Date;
}
