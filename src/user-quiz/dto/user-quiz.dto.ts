import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum UgcGameType {
  QUIZ = 'QUIZ',
  TRUE_FALSE = 'TRUE_FALSE',
}

export class CreateUserQuestionDto {
  @IsEnum(UgcGameType)
  gameType!: string;

  @IsNotEmpty()
  @IsString()
  questionMg!: string;

  @IsOptional()
  @IsString()
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
  explanationMg?: string;

  @IsOptional()
  @IsString()
  explanationFr?: string;
}

export enum DeckVisibility {
  PUBLIC = 'PUBLIC',
  LINK_ONLY = 'LINK_ONLY',
}

export class CreateUserQuizSetDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
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
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
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
  description?: string;
}

export class VerifyDeckDto {
  @IsBoolean()
  verified!: boolean;
}

