export interface SeedSection {
  type: 'intro' | 'concept' | 'example' | 'didYouKnow' | 'quiz' | 'phonetic';
  textFr?: string;
  textMg?: string;
  termMg?: string;
  phonetic?: string;
  meaningFr?: string;
  explanation?: string;
  letterOrSound?: string;
  frenchEquivalent?: string;
  sampleWordMg?: string;
  sampleTranslationFr?: string;
  question?: string;
  questionMg?: string;
  choices?: string[];
  correctIndex?: number;
}

export interface SeedLesson {
  slug: string;
  title: string;
  titleMg: string;
  summary: string;
  summaryMg: string;
  type: 'VOCABULARY' | 'GRAMMAR' | 'CULTURE' | 'TRADITION' | 'LITERATURE';
  orderIndex: number;
  durationMinutes: number;
  sections: SeedSection[];
}

export interface SeedTrack {
  slug: string;
  title: string;
  titleMg: string;
  description: string;
  descriptionMg: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  icon: string;
  color: string;
  orderIndex: number;
  estimatedMinutes: number;
  lessons: SeedLesson[];
}
