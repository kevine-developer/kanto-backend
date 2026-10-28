import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
} from 'class-validator';
import {
  DifficultyLevel,
  ContentStatus,
} from '../../../generated/prisma/client.js';

export class UpdateCivicQuizDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  prompt?: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  choices?: string[];

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(5)
  answerIndex?: number;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  imageAlt?: string;

  @IsString()
  @IsOptional()
  sourceReference?: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsString()
  @IsOptional()
  historicalPeriod?: string;

  @IsString()
  @IsOptional()
  contentSourceType?: string;

  @IsString()
  @IsOptional()
  contentSourceId?: string;

  @IsInt()
  @IsOptional()
  levelNumber?: number;

  @IsString()
  @IsOptional()
  explanationMg?: string;
}
