import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StartSessionDto {
  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  questionCount?: number;
}

export class AnswerQuestionDto {
  @IsNotEmpty()
  @IsString()
  sessionId!: string;

  @IsNotEmpty()
  @IsString()
  questionId!: string;

  @IsOptional()
  @IsBoolean()
  userAnswer?: boolean | null;
}

export class FinishSessionDto {
  @IsNotEmpty()
  @IsString()
  sessionId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  durationSeconds?: number;
}

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  questionMg!: string;

  @IsOptional()
  @IsString()
  questionFr?: string;

  @IsBoolean()
  isTrue!: boolean;

  @IsNotEmpty()
  @IsString()
  explanationMg!: string;

  @IsOptional()
  @IsString()
  explanationFr?: string;

  @IsNotEmpty()
  @IsEnum(['GEN', 'CULT', 'GEO', 'HIST', 'LITT', 'PROV'])
  theme!: 'GEN' | 'CULT' | 'GEO' | 'HIST' | 'LITT' | 'PROV';

  @IsNotEmpty()
  @IsEnum(['EASY', 'MEDIUM', 'HARD', 'EXPERT'])
  difficulty!: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  questionMg?: string;

  @IsOptional()
  @IsString()
  questionFr?: string;

  @IsOptional()
  @IsBoolean()
  isTrue?: boolean;

  @IsOptional()
  @IsString()
  explanationMg?: string;

  @IsOptional()
  @IsString()
  explanationFr?: string;

  @IsOptional()
  @IsEnum(['GEN', 'CULT', 'GEO', 'HIST', 'LITT', 'PROV'])
  theme?: 'GEN' | 'CULT' | 'GEO' | 'HIST' | 'LITT' | 'PROV';

  @IsOptional()
  @IsEnum(['EASY', 'MEDIUM', 'HARD', 'EXPERT'])
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class FindQuestionsQueryDto {
  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number | string;

  @IsOptional()
  limit?: number | string;
}
