import { GameRole } from './Play';

export interface BallState {
  currentPosition: {
    top: string;
    left: string;
  };
  currentRole: GameRole | null;
  isMoving: boolean;
  targetPosition?: {
    top: string;
    left: string;
  };
}

export interface MatchState {
  id: string;
  sessionGameId: string;
  teamAScore: number;
  teamBScore: number;
  ballState: BallState;
  currentPlayId: string;
  currentStep: number;
  possession: 'A' | 'B';
  status: 'playing' | 'paused' | 'finished';
  startTime: Date;
  elapsedTime: number;
}

export interface CreateMatchStateInput {
  sessionGameId: string;
  currentPlayId: string;
}

export interface UpdateMatchStateInput {
  teamAScore?: number;
  teamBScore?: number;
  ballState?: BallState;
  currentStep?: number;
  possession?: 'A' | 'B';
  status?: 'playing' | 'paused' | 'finished';
  elapsedTime?: number;
}
