export class CreateMissingWordLevelDto {
  levelNumber!: number;
  titleMg!: string;
  titleFr?: string;
  description?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  passThreshold?: number;
  totalQuestions?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class UpdateMissingWordLevelDto {
  titleMg?: string;
  titleFr?: string;
  description?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  passThreshold?: number;
  totalQuestions?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class CreateMissingWordQuestionDto {
  levelId!: string;
  orderIndex?: number;
  template!: string[];
  correctWord!: string;
  choices!: string[];
  french!: string;
  explanation?: string;
  hint?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class UpdateMissingWordQuestionDto {
  orderIndex?: number;
  template?: string[];
  correctWord?: string;
  choices?: string[];
  french?: string;
  explanation?: string;
  hint?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class ReorderQuestionsDto {
  questionIds!: string[];
}
