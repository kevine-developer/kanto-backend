import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMissingWordLevelDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  levelNumber!: number;

  @IsNotEmpty()
  @IsString()
  titleMg!: string;

  @IsOptional()
  @IsString()
  titleFr?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['EASY', 'MEDIUM', 'HARD', 'EXPERT'])
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  passThreshold?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalQuestions?: number;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class UpdateMissingWordLevelDto {
  @IsOptional()
  @IsString()
  titleMg?: string;

  @IsOptional()
  @IsString()
  titleFr?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['EASY', 'MEDIUM', 'HARD', 'EXPERT'])
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  passThreshold?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalQuestions?: number;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class CreateMissingWordQuestionDto {
  @IsNotEmpty()
  @IsString()
  levelId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderIndex?: number;

  @IsArray()
  @IsString({ each: true })
  template!: string[];

  @IsNotEmpty()
  @IsString()
  correctWord!: string;

  @IsArray()
  @IsString({ each: true })
  choices!: string[];

  @IsNotEmpty()
  @IsString()
  french!: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  hint?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class UpdateMissingWordQuestionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  template?: string[];

  @IsOptional()
  @IsString()
  correctWord?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  choices?: string[];

  @IsOptional()
  @IsString()
  french?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  hint?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class ReorderQuestionsDto {
  @IsArray()
  @IsString({ each: true })
  questionIds!: string[];
}
