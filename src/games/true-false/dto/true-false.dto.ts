export class StartSessionDto {
  theme?: string;
  difficulty?: string;
  questionCount?: number;
}

export class AnswerQuestionDto {
  sessionId: string;
  questionId: string;
  userAnswer: boolean;
}

export class FinishSessionDto {
  sessionId: string;
  durationSeconds?: number;
}

export class CreateQuestionDto {
  questionMg: string;
  questionFr?: string;
  isTrue: boolean;
  explanationMg: string;
  explanationFr?: string;
  theme: 'GEN' | 'CULT' | 'GEO' | 'HIST' | 'LITT' | 'PROV';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  source?: string;
  image?: string;
}

export class UpdateQuestionDto {
  questionMg?: string;
  questionFr?: string;
  isTrue?: boolean;
  explanationMg?: string;
  explanationFr?: string;
  theme?: 'GEN' | 'CULT' | 'GEO' | 'HIST' | 'LITT' | 'PROV';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  source?: string;
  image?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class FindQuestionsQueryDto {
  theme?: string;
  difficulty?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
}
