export class CreateLevelDto {
  levelNumber!: number;
  titleMg!: string;
  titleFr?: string;
  description?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  passThreshold?: number;
  totalSentences?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class UpdateLevelDto {
  titleMg?: string;
  titleFr?: string;
  description?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  passThreshold?: number;
  totalSentences?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class CreateSentenceDto {
  levelId!: string;
  orderIndex!: number;
  malagasy!: string;
  french!: string;
  hint?: string;
  explanationMg?: string;
  explanationFr?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class UpdateSentenceDto {
  orderIndex?: number;
  malagasy?: string;
  french?: string;
  hint?: string;
  explanationMg?: string;
  explanationFr?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class ReorderSentencesDto {
  sentenceIds!: string[];
}
