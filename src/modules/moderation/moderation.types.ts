export type ModerationCategory =
  | 'SEXUAL_CONTENT'
  | 'PROFANITY_VULGARITY'
  | 'HATE_SPEECH_DISCRIMINATION'
  | 'HARASSMENT_THREATS'
  | 'TERMS_VIOLATION'
  | 'INAPPROPRIATE';

export type ModerationSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ModerationMatch {
  category: ModerationCategory;
  severity: ModerationSeverity;
  termMatched: string;
  field: string;
  contextSnippet?: string;
}

export interface ModerationAnalysisResult {
  isFlagged: boolean;
  score: number; // 0.0 (sain) à 1.0 (haut risque)
  categories: ModerationCategory[];
  summary: string;
  matches: ModerationMatch[];
  fieldsAnalyzed: string[];
  analyzedAt: string;
}

export interface ModerationRule {
  pattern: RegExp | string;
  category: ModerationCategory;
  severity: ModerationSeverity;
  language: 'mg' | 'fr' | 'multi';
  isExactWord?: boolean;
}
