export enum Difficulty {
  EASY = 'Dễ',
  MEDIUM = 'Trung bình',
  HARD = 'Khó',
  PROVINCIAL = 'HSG Tỉnh',
  NATIONAL = 'HSG Quốc gia'
}

export interface Problem {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Array<{ input: string; output: string }>;
  topic: string;
  difficulty: string;
}

export interface AnalysisResult {
  verdict: 'WRONG_DIRECTION' | 'PARTIAL' | 'CORRECT' | 'EXCELLENT' | 'UNKNOWN';
  feedbackMarkdown: string;
}

export interface SolutionData {
  explanation: string;
  sampleCode: string;
  complexity: string;
}

export interface HistoryItem {
  id: string;
  problem: Problem;
  timestamp: number;
}

export interface CoachState {
  mode: 'standard' | 'custom' | 'history';
  topic: string;
  difficulty: Difficulty;
  language: string;
  customPrompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}