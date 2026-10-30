/**
 * Types et interfaces pour le système de seeds Prisma Kanto MG
 */

export interface SeedCategoryStats {
  category: string;
  totalInFile: number;
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
  errors: number;
}

export interface ValidationIssue {
  itemIndex: number;
  identifier?: string;
  field?: string;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  issues: ValidationIssue[];
}

export interface RawMalagasyItem {
  id?: string;
  slug?: string;
  malagasy: string;
  french: string;
  meaning: string;
  example?: string;
  phonetic?: string;
  category?: 'PROVERBE' | 'EXPRESSION' | 'DICTON' | string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  origins?: string[];
  themes?: string[];
  dialectVariants?: Array<{ dialect?: string; dialectName?: string; text: string }>;
}

export interface RawCitation {
  id?: string;
  citationMg: string;
  citationFr: string;
  source?: string;
  sourceName?: string;
  contexte?: string;
  isPremium?: boolean;
  themes?: string[];
}

export interface RawRakiTeny {
  id?: string;
  slug?: string;
  word: string;
  phonetic?: string;
  category?: string;
  wordClassMg: string;
  wordClassFr: string;
  rarity?: 'LITERAL' | 'VERY_RARE' | 'ARCHAIC' | 'POETIC' | 'PROVERBIAL';
  rarityLabelMg?: string;
  rarityLabelFr?: string;
  meaningMg: string;
  meaningFr: string;
  exampleMg: string;
  exampleFr: string;
  contextUsage?: string;
  etymology?: string;
  audioUrl?: string;
  isFeatured?: boolean;
}

export interface RawQuizQuestion {
  id?: string;
  category?: string;
  prompt?: string;
  promptFr?: string;
  promptMg?: string;
  choices?: string[];
  optionsFr?: string[];
  optionsMg?: string[];
  answerIndex?: number;
  correctAnswerIndex?: number;
  explanation?: string;
  explanationMg?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
  sourceReference?: string;
  sourceUrl?: string;
  contentSourceType?: string;
  contentSourceId?: string;
  levelNumber?: number;
  historicalPeriod?: string;
  status?: string;
}

export interface RawTrueFalseQuestion {
  id?: string;
  category?: string;
  questionMg?: string;
  questionFr?: string;
  promptMg?: string;
  promptFr?: string;
  isTrue: boolean;
  explanation?: string;
  explanationMg?: string;
  explanationFr?: string;
  explanationTrueFr?: string;
  explanationTrueMg?: string;
  explanationFalseFr?: string;
  explanationFalseMg?: string;
  theme?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | string;
  source?: string;
  sourceReference?: string;
  image?: string;
  imageUrl?: string;
  imageAlt?: string;
  contentSourceType?: string;
  contentSourceId?: string;
  levelNumber?: number;
  historicalPeriod?: string;
  status?: string;
}

export interface RawRiddle {
  id?: string;
  riddleMg: string;
  riddleFr: string;
  options: string[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  explanation: string;
  clue?: string;
  level?: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | string;
  imageUrl?: string;
  imageAlt?: string;
  sourceReference?: string;
  contentSourceType?: string;
  contentSourceId?: string;
}
