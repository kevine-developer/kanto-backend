export enum DailyChallengeType {
  QUIZ = 'QUIZ',
  TRUE_FALSE = 'TRUE_FALSE',
  RIDDLE = 'RIDDLE',
}

export interface DailyChallengePublicDto {
  date: string;
  type: DailyChallengeType;
  titleFr: string;
  titleMg: string;
  badgeLabelFr: string;
  badgeLabelMg: string;
  id: string;
  promptFr: string;
  promptMg: string;
  options: string[];
  clue?: string | null;
  coverImage?: string | null;
  xpReward: number;
}

export class SubmitDailyAnswerDto {
  questionId!: string;
  userAnswer!: string;
  date?: string;
}

export interface DailyChallengeAnswerResultDto {
  isCorrect: boolean;
  correctAnswer: string;
  correctAnswerIndex?: number;
  explanationMg?: string | null;
  explanationFr?: string | null;
  clue?: string | null;
  xpAwarded: number;
}

