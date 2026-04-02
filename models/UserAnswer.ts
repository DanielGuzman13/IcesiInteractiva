export interface UserAnswer {
  id: string;
  userId: string;
  challengeId: string;
  playStepId: string;
  answer: any;
  isCorrect: boolean;
  responseTime: number;
  attempts: number;
  score: number;
  answeredAt: Date;
}

export interface CreateUserAnswerInput {
  userId: string;
  challengeId: string;
  playStepId: string;
  answer: any;
  isCorrect: boolean;
  responseTime: number;
  attempts: number;
  score: number;
}
