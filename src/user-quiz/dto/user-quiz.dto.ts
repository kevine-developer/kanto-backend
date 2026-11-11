import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export enum UgcGameType {
  QUIZ = 'QUIZ',
  TRUE_FALSE = 'TRUE_FALSE',
}

export const MIN_QUESTIONS_FOR_PUBLICATION = 5;

export interface QuestionValidationIssue {
  isValid: boolean;
  errors: string[];
}

export function validateUserQuestion(
  q:
    | Partial<CreateUserQuestionDto>
    | {
        gameType?: string | null;
        questionMg?: string | null;
        questionFr?: string | null;
        choices?: string[] | null;
        answerIndex?: number | null;
        isTrue?: boolean | null;
      },
): QuestionValidationIssue {
  const errors: string[] = [];

  if (!q.questionMg || !q.questionMg.trim()) {
    errors.push(
      'Fanontaniana amin’ny teny malagasy tsy maintsy fenoina (Énoncé malgache requis)',
    );
  }

  const type = q.gameType || UgcGameType.QUIZ;

  if (type === UgcGameType.QUIZ) {
    const validChoices = Array.isArray(q.choices)
      ? q.choices
          .map((c) => (typeof c === 'string' ? c.trim() : ''))
          .filter(Boolean)
      : [];

    if (validChoices.length < 2) {
      errors.push(
        'Farafahakeliny safidy 2 no ilaina (Au moins 2 choix de réponses sont requis)',
      );
    }

    if (
      q.answerIndex === undefined ||
      q.answerIndex === null ||
      typeof q.answerIndex !== 'number' ||
      q.answerIndex < 0 ||
      (Array.isArray(q.choices) && q.answerIndex >= q.choices.length)
    ) {
      errors.push(
        'Safidio ny valiny marina (Veuillez sélectionner la bonne réponse)',
      );
    }
  } else if (type === UgcGameType.TRUE_FALSE) {
    if (typeof q.isTrue !== 'boolean') {
      errors.push(
        'Farito raha Marina na Diso (Précisez si la réponse est Vrai ou Faux)',
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export class CreateUserQuestionDto {
  @IsEnum(UgcGameType)
  gameType!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  questionMg!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  questionFr?: string;

  // Pour TRUE_FALSE
  @IsOptional()
  @IsBoolean()
  isTrue?: boolean;

  // Pour QUIZ
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  choices?: string[];

  @IsOptional()
  @IsInt()
  answerIndex?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  explanationMg?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  explanationFr?: string;
}

export class UpdateUserQuestionDto {
  @IsOptional()
  @IsEnum(UgcGameType)
  gameType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  questionMg?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  questionFr?: string;

  @IsOptional()
  @IsBoolean()
  isTrue?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  choices?: string[];

  @IsOptional()
  @IsInt()
  answerIndex?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  explanationMg?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  explanationFr?: string;
}

export enum DeckVisibility {
  PUBLIC = 'PUBLIC',
  LINK_ONLY = 'LINK_ONLY',
}

export class CreateUserQuizSetDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @IsOptional()
  @IsEnum(DeckVisibility)
  visibility?: DeckVisibility;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserQuestionDto)
  questions?: CreateUserQuestionDto[];
}

export class UpdateUserQuizSetDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @IsOptional()
  @IsEnum(DeckVisibility)
  visibility?: DeckVisibility;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserQuestionDto)
  questions?: CreateUserQuestionDto[];
}

export class UploadDeckImageDto {
  @IsNotEmpty()
  @IsString()
  imageBase64!: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}

export class ReportDeckDto {
  @IsNotEmpty()
  @IsString()
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class VerifyDeckDto {
  @IsBoolean()
  verified!: boolean;
}

export class RecordPlayDto {
  @IsOptional()
  @IsInt()
  correctCount?: number;

  @IsOptional()
  @IsInt()
  totalQuestions?: number;

  @IsOptional()
  @IsInt()
  durationSeconds?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
