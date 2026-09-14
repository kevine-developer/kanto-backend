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

export class CreateLevelDto {
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
  totalSentences?: number;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class UpdateLevelDto {
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
  totalSentences?: number;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class CreateSentenceDto {
  @IsNotEmpty()
  @IsString()
  levelId!: string;

  @Type(() => Number)
  @IsInt()
  orderIndex!: number;

  @IsNotEmpty()
  @IsString()
  malagasy!: string;

  @IsNotEmpty()
  @IsString()
  french!: string;

  @IsOptional()
  @IsString()
  hint?: string;

  @IsOptional()
  @IsString()
  explanationMg?: string;

  @IsOptional()
  @IsString()
  explanationFr?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class UpdateSentenceDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsString()
  malagasy?: string;

  @IsOptional()
  @IsString()
  french?: string;

  @IsOptional()
  @IsString()
  hint?: string;

  @IsOptional()
  @IsString()
  explanationMg?: string;

  @IsOptional()
  @IsString()
  explanationFr?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class ReorderSentencesDto {
  @IsArray()
  @IsString({ each: true })
  sentenceIds!: string[];
}
