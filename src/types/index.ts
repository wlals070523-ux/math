export type JobType = 'warrior' | 'wizard' | 'healer' | 'explorer';

export interface StudentAccount {
  id: string; // e.g. "3-3-01"
  password: string;
  grade: number;
  classNo: number;
  number: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterAppearance {
  base?: string;
  hairStyle?: string;
  hairColor?: string;
  outfit?: string;
}

export interface CharacterData {
  nickname: string;
  job: JobType;
  level: number;
  exp: number;
  gold: number;
  appearance: CharacterAppearance;
  inventory: string[];
  equipment: {
    weapon: string | null;
    armor: string | null;
    helmet: string | null;
    accessory: string | null;
    cape: string | null;
  };
  skills: string[];
  mathMonsters: string[];
  titles: string[];
  selectedTitle?: string;
}

export interface WrongQuestionRecord {
  problemId: string;
  stageId: number;
  problem: string;
  studentAns: string;
  correctAns: string;
  errorType?: string;
  retryCount: number;
  hintLevel: number;
  createdAt: string;
}

export interface StageRecord {
  stageId: number;
  completed: boolean;
  mastery: '보충' | '기본' | '심화' | '완전정복';
  score: number;
  correctCount: number;
  wrongCount: number;
  tryCount: number;
  hintCount: number;
  basicSolved: number;
  advancedSolved: number;
  challengeSolved: number;
  applicationSolved: number;
  createdProblems: number;
  wrongQuestions: WrongQuestionRecord[];
  updatedAt: string;
}

export interface StudentData {
  schemaVersion: number;
  account: StudentAccount;
  character: CharacterData;
  stages: Record<number, StageRecord>;
  totalCorrect: number;
  totalWrong: number;
  totalHints: number;
  totalRetries: number;
  streakCount: number;
  notes?: string;
  lastLearningAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type TeacherTabType = 'overview' | 'stages' | 'students' | 'sos' | 'rewards' | 'accounts';

export interface TeacherSettings {
  teacherPasswordHash: string; // plain for demo or hash
  schoolName: string;
  grade: number;
  classNo: number;
  updatedAt: string;
}

// RPG Game Definitions
export type ItemCategory = 'weapon' | 'armor' | 'helmet' | 'accessory' | 'cape' | 'pet' | 'badge';

export interface GameItem {
  id: string;
  name: string;
  category: ItemCategory;
  jobRequired?: JobType | 'all';
  price: number;
  icon: string;
  color: string;
  description: string;
  isRare?: boolean;
  unlockCondition?: string;
}

export interface SkillInfo {
  id: string;
  name: string;
  job: JobType;
  unlockLevel: number;
  icon: string;
  description: string;
  effectType: 'highlight_key_number' | 'vertical_align_assist' | 'easy_similar_problem' | 'weakness_hint' | 'streak_bonus' | 'retry_shield';
  cooldownProblems: number; // problems needed to recharge
}

export interface MathMonster {
  id: string;
  stageId: number;
  name: string;
  description: string;
  specialty?: string;
  element: 'earth' | 'fire' | 'water' | 'wind' | 'light' | 'dark' | 'electric' | 'magic';
  icon: string;
  lore: string;
  bonusText: string;
}

// Learning Stage & Question Types
export type QuestionType = 'basic' | 'advanced' | 'challenge' | 'application' | 'problem_making' | 'speed';

export interface QuestionVisualGuide {
  type: 'blocks' | 'grid' | 'step_vertical' | 'number_line';
  data: any;
}

export interface Question {
  id: string;
  stageId: number;
  type: QuestionType;
  title?: string;
  questionText: string;
  multiplicand: number; // 곱해지는 수 (e.g. 234)
  multiplier: number;   // 곱하는 수 (e.g. 3)
  correctAnswer: number;
  choices?: number[];   // 객관식 선택지 (스피드/어림 등)
  isWordProblem?: boolean;
  contextStory?: string;
  visualGuide?: QuestionVisualGuide;
  hint1: string; // 1차 오답 힌트 (사고 촉진)
  hint2: string; // 2차 오답 힌트 (계산 순서/전략)
  hint3: string; // 3차 오답 힌트 (수모형/자릿값 분해)
  errorRule?: string; // 주 예상 오류
}

export interface StageConfig {
  id: number;
  title: string;
  subtitle: string;
  areaName: string;
  description: string;
  monsterName: string;
  badgeIcon: string;
  bgGradient: string;
  requiredPrevStage?: number;
}

// Teacher Analysis Types
export interface ClassSummary {
  totalStudents: number;
  activeStudents: number;
  avgProgressPercent: number;
  avgAccuracyPercent: number;
  avgExp: number;
  avgGold: number;
  avgLevel: number;
  levelDistribution: {
    supplement: number; // 보충 필요
    basic: number;      // 기본
    advanced: number;   // 심화 달성
  };
  jobDistribution: {
    warrior: number;
    wizard: number;
    healer: number;
    explorer: number;
  };
  totalMonstersCollected: number;
}

export interface StageAnalysis {
  stageId: number;
  stageTitle: string;
  completedCount: number;
  avgAccuracy: number;
  avgWrongRate: number;
  avgRetries: number;
  avgHints: number;
  supplementCount: number;
  advancedCount: number;
}

export interface WeakStageAnalysis {
  stageId: number;
  stageTitle: string;
  wrongRate: number;
  studentCount: number;
  mainErrorType: string;
  teachingSuggestion: string;
}

export interface ErrorTypeCount {
  type: string;
  name: string;
  count: number;
  description: string;
  recommendation: string;
}

export interface SOSStudent {
  student: StudentData;
  reasons: string[];
  severity: 'high' | 'medium';
  problematicStageId?: number;
  recentErrorTypes: string[];
}
