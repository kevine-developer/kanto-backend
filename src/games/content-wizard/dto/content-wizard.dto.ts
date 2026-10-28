import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  Max,
  IsBoolean,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { DifficultyLevel, ContentStatus } from '../../../../generated/prisma/client.js';

export enum ContentSourceType {
  PRESIDENT = 'PRESIDENT',
  BANKNOTE = 'BANKNOTE',
  PROVINCE = 'PROVINCE',
  NATURE_EMBLEM = 'NATURE_EMBLEM',
  HISTORY_DATE = 'HISTORY_DATE',
  NATIONAL_EMBLEM = 'NATIONAL_EMBLEM',
  MALAGASY_ITEM = 'MALAGASY_ITEM',
  CONTE = 'CONTE',
  CIVIC_LESSON = 'CIVIC_LESSON',
  FREE_FORM = 'FREE_FORM',
}

export enum GameQuestionFormat {
  SINGLE_CHOICE = 'SINGLE_CHOICE',       // QCM 4 choix
  TRUE_FALSE = 'TRUE_FALSE',             // Marina sa Diso
  RIDDLE = 'RIDDLE',                     // Ankamantatra
  IMAGE_IDENTIFICATION = 'IMAGE_IDENTIFICATION', // Reconnaissance d'image
}

export class SearchContentSourcesDto {
  @IsEnum(ContentSourceType)
  @IsOptional()
  type?: ContentSourceType;

  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @IsOptional()
  limit?: number = 20;
}

export class GenerateSuggestionsDto {
  @IsEnum(ContentSourceType)
  @IsNotEmpty()
  sourceType!: ContentSourceType;

  @IsString()
  @IsOptional()
  sourceId?: string;

  @IsEnum(GameQuestionFormat)
  @IsNotEmpty()
  format!: GameQuestionFormat;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel = DifficultyLevel.EASY;
}

export class BatchGenerateSuggestionsDto {
  @IsEnum(ContentSourceType)
  @IsNotEmpty()
  sourceType!: ContentSourceType;

  @IsArray()
  @IsEnum(GameQuestionFormat, { each: true })
  formats!: GameQuestionFormat[];

  @IsInt()
  @Min(1)
  @Max(20)
  count: number = 10;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel = DifficultyLevel.EASY;
}

export class PublishUniversalQuestionDto {
  @IsEnum(GameQuestionFormat)
  @IsNotEmpty()
  format!: GameQuestionFormat;

  // Champs communs
  @IsString()
  @IsNotEmpty({ message: "L'énoncé de la question est obligatoire" })
  prompt!: string;

  @IsString()
  @IsOptional()
  promptMg?: string;

  @IsString()
  @IsOptional()
  promptFr?: string;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty: DifficultyLevel = DifficultyLevel.EASY;

  @IsString()
  @IsNotEmpty({ message: 'La catégorie thématique est requise' })
  category!: string;

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

  @IsEnum(ContentSourceType)
  @IsOptional()
  contentSourceType?: ContentSourceType;

  @IsString()
  @IsOptional()
  contentSourceId?: string;

  @IsInt()
  @IsOptional()
  levelNumber?: number = 1;

  @IsEnum(ContentStatus)
  @IsOptional()
  status: ContentStatus = ContentStatus.PUBLISHED;

  // Pour QCM & Image
  @IsArray()
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  choices?: string[];

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(5)
  answerIndex?: number;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsString()
  @IsOptional()
  explanationMg?: string;

  // Pour Vrai / Faux
  @IsBoolean()
  @IsOptional()
  isTrue?: boolean;

  @IsString()
  @IsOptional()
  explanationTrueFr?: string;

  @IsString()
  @IsOptional()
  explanationTrueMg?: string;

  @IsString()
  @IsOptional()
  explanationFalseFr?: string;

  @IsString()
  @IsOptional()
  explanationFalseMg?: string;

  // Pour Devinettes
  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  acceptedAnswers?: string[];

  @IsString()
  @IsOptional()
  clue?: string;
}
