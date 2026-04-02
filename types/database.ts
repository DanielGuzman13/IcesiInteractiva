// ============= ENTIDADES PRINCIPALES =============

// Usuario/Estudiante
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  lastLoginAt: Date;
  totalScore: number;
  currentLevel: number;
}

// Sesión de juego actual
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

// Jugada predefinida (flujo de trabajo)
export interface Play {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sequence: PlayStep[];
  totalSteps: number;
  estimatedDuration: number; // minutos
}

// Paso dentro de una jugada (rol específico)
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
  message: string; // mensaje emergente
  oralExplanation: string; // texto para explicación oral
  timeLimit?: number; // segundos
}

// Reto/Desafío específico
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
  explanation: string; // explicación después de responder
}

// Contenido del reto (varía por tipo)
export interface ChallengeContent {
  questions?: Question[];
  codeTemplate?: string;
  instructions?: string;
  options?: string[];
  assets?: string[];
}

// Pregunta para quizzes
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Roles del juego
export type GameRole = 
  | 'product-owner'
  | 'qa-tester'
  | 'devops'
  | 'backend'
  | 'tech-lead'
  | 'frontend'
  | 'architect';

// ============= ENTIDADES DE PROGRESO =============

// Progreso del usuario en una jugada
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

// Respuesta del usuario a un reto
export interface UserAnswer {
  id: string;
  userId: string;
  challengeId: string;
  playStepId: string;
  answer: any;
  isCorrect: boolean;
  responseTime: number; // segundos
  attempts: number;
  score: number;
  answeredAt: Date;
}

// ============= ENTIDADES DE ESTADO =============

// Estado del balón en el campo
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

// Estado del partido
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
  elapsedTime: number; // segundos
}

// ============= CONFIGURACIÓN =============

// Configuración general del juego
export interface GameConfig {
  id: string;
  playDuration: number; // duración default de jugadas
  scorePerCorrectAnswer: number;
  scorePenaltyPerWrongAnswer: number;
  timeBonusPerSecond: number;
  maxAttemptsPerChallenge: number;
  oralExplanationDuration: number; // segundos
}

// ============= REPORTES =============

// Estadísticas globales
export interface GameStats {
  totalUsers: number;
  activeSessions: number;
  averageScore: number;
  mostPlayedRole: GameRole;
  completionRate: number;
  averageTimePerPlay: number;
}

// Progreso por rol
export interface RoleProgress {
  userId: string;
  role: GameRole;
  totalAttempts: number;
  correctAnswers: number;
  averageResponseTime: number;
  bestScore: number;
  lastPlayedAt: Date;
}
