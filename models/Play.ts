export interface Play {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sequence: PlayStep[];
  totalSteps: number;
  estimatedDuration: number;
}

export interface PlayStep {
  id: string;
  playId: string;
  order: number;
  role: GameRole;
  challengeId: string;
  ballPosition: {
    top: string;
    left: string;
  };
  message: string;
  oralExplanation: string;
  timeLimit?: number;
}

export type GameRole = 
  | 'product-owner'
  | 'qa-tester'
  | 'devops'
  | 'backend'
  | 'team-manager'
  | 'frontend'
  | 'architect';

export interface CreatePlayInput {
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
}

export interface CreatePlayStepInput {
  playId: string;
  order: number;
  role: GameRole;
  challengeId: string;
  ballPosition: {
    top: string;
    left: string;
  };
  message: string;
  oralExplanation: string;
  timeLimit?: number;
}
