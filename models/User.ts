export interface User {
  id: string;
  name: string;
  createdAt: Date;
  lastLoginAt: Date;
  totalScore: number;
  currentLevel: number;
}

export interface CreateUserInput {
  name: string;
}

export interface UpdateUserInput {
  name?: string;
  totalScore?: number;
  currentLevel?: number;
  lastLoginAt?: Date;
}
