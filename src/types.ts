export type ThemeMode = 'dark' | 'light';

export type ActiveTab =
  | 'superposition'
  | 'entanglement'
  | 'gates'
  | 'hardware'
  | 'tutorial'
  | 'dashboard'
  | 'reference';

export interface Complex {
  re: number;
  im: number;
}

export interface QubitState {
  alpha: Complex; // amplitude for |0>
  beta: Complex;  // amplitude for |1>
  theta: number;  // polar angle [0, pi]
  phi: number;    // azimuthal angle [0, 2*pi]
}

export type GateType = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT' | 'CZ' | 'SWAP' | 'M';

export interface CircuitGate {
  id: string;
  type: GateType;
  targetQubit: number;
  controlQubit?: number;
  step: number;
}

export interface BellStatePreset {
  id: string;
  name: string;
  formula: string;
  description: string;
  circuitSteps: Array<{ gate: GateType; target: number; control?: number; step: number }>;
}

export interface HardwareStage {
  id: string;
  name: string;
  temperatureKelvin: number;
  temperatureDisplay: string;
  description: string;
  engineeringRole: string;
  keyComponents: string[];
  materials: string[];
  thermalLoadWatts: string;
  heightRatio: number;
  widthRatio: number;
}

export interface SignalPathPoint {
  id: string;
  label: string;
  stageName: string;
  temperature: string;
  role: string;
  powerLevel: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonCheckpoint {
  id: string;
  title: string;
  content: string;
  interactiveTask?: {
    type: 'superposition' | 'gate' | 'entanglement' | 'hardware';
    instruction: string;
    targetCondition: string;
  };
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  summary: string;
  checkpoints: LessonCheckpoint[];
  quiz: QuizQuestion[];
}

export interface UserProgress {
  completedModules: string[];
  completedCheckpoints: string[];
  quizScores: Record<string, number>;
  simulationsExplored: string[];
  circuitsCreatedCount: number;
  badgesUnlocked: string[];
  lastActiveTimestamp: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: string;
}
