import { GameRole } from './Play';

export interface Challenge {
  id: string;
  role: GameRole;
  title: string;
  description: string;
  type: 'quiz' | 'code' | 'simulation' | 'drag-drop';
  content: ChallengeContent;
  correctAnswer: any;
  points: number;
  hints: string[];
  explanation: string;
}

export interface ChallengeContent {
  questions?: Question[];
  codeTemplate?: string;
  instructions?: string;
  options?: string[];
  assets?: string[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CreateChallengeInput {
  role: GameRole;
  title: string;
  description: string;
  type: 'quiz' | 'code' | 'simulation' | 'drag-drop';
  content: ChallengeContent;
  correctAnswer: any;
  points: number;
  hints: string[];
  explanation: string;
}
