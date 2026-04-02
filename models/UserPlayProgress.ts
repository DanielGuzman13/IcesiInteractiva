export interface UserPlayProgress {
  id: string;
  userId: string;
  playId: string;
  sessionGameId: string;
  currentStep: number;
  completedSteps: string[];
  score: number;
  startedAt: Date;
  status: 'in-progress' | 'completed' | 'failed';
  completedAt?: Date;
}

export interface CreateUserPlayProgressInput {
  userId: string;
  playId: string;
  sessionGameId: string;
}

export interface UpdateUserPlayProgressInput {
  currentStep?: number;
  completedSteps?: string[];
  score?: number;
  status?: 'in-progress' | 'completed' | 'failed';
  completedAt?: Date;
}
