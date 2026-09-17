export type TeamId = 'team1' | 'team2' | 'team3' | 'team4';

export interface Team {
  id: TeamId;
  name: string;
  colorName: string;
  colorHex: string;
  borderHex: string;
  bgHex: string;
  accentHex: string;
  position: number; // 0 to MAX_STEPS (e.g. 12)
  score: number;
  correctCount: number;
  incorrectCount: number;
  turnsCount: number;
  currentCombo: number;
  maxCombo: number;
  boostCount: number;
}

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer'
  | 'diagram_venn'
  | 'matching'
  | 'quick_reflex';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'tie_breaker' | 'sprint';

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  lessonSection: string; // e.g. "Khái niệm tập hợp", "Tập con & Tập bằng nhau", "Các tập hợp số", "Khoảng - Đoạn", "Các phép toán tập hợp"
  text: string;
  latexOrCode?: string;
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  diagramNote?: string;
  hint?: string;
  pageRef: number; // Page 1 to 7
}

export type SpecialTileType = 'speed_boost' | 'gift' | 'obstacle' | 'breakthrough';

export interface SpecialTile {
  step: number;
  type: SpecialTileType;
  title: string;
  description: string;
  icon: string;
}

export interface GameActionHistory {
  id: string;
  timestamp: number;
  description: string;
  teams: Record<TeamId, Team>;
  currentQuestionIndex: number;
  currentQuestionId: string;
  activeAnsweringTeamId: TeamId | null;
  questionStatus: 'unanswered' | 'answered_correct' | 'answered_wrong' | 'passed';
  sprintActive: boolean;
  sprintTeamIndex: number;
  isGameOver: boolean;
  consecutiveWrongCount: number;
  attemptedTeamsForCurrentQuestion: TeamId[];
  wrongQuestionsLog: {
    questionId: string;
    teamId: TeamId;
    timestamp: number;
  }[];
}

export interface WrongQuestionReview {
  question: Question;
  wrongTeams: string[];
  count: number;
}
