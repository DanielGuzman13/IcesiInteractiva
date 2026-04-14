export interface User {
  id: string;
  name: string;
  salon?: '205M' | '206M';
  createdAt: Date;
  lastLoginAt: Date;
  totalScore: number;
  currentLevel: number;
}

export interface CreateUserInput {
  name: string;
  salon?: '205M' | '206M';
}

export interface UpdateUserInput {
  name?: string;
  salon?: '205M' | '206M';
  totalScore?: number;
  currentLevel?: number;
  lastLoginAt?: Date;
}
