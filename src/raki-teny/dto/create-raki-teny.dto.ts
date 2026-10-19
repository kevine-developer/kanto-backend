import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { WordRarity, ContentStatus } from '../../../generated/prisma/client.js';

export class CreateRakiTenyDto {
  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsOptional()
  phonetic?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsNotEmpty()
  wordClassMg: string;

  @IsString()
  @IsNotEmpty()
  wordClassFr: string;

  @IsEnum(WordRarity)
  @IsOptional()
  rarity?: WordRarity;

  @IsString()
  @IsNotEmpty()
  rarityLabelMg: string;

  @IsString()
  @IsNotEmpty()
  rarityLabelFr: string;

  @IsString()
  @IsNotEmpty()
  meaningMg: string;

  @IsString()
  @IsNotEmpty()
  meaningFr: string;

  @IsString()
  @IsNotEmpty()
  exampleMg: string;

  @IsString()
  @IsNotEmpty()
  exampleFr: string;

  @IsString()
  @IsNotEmpty()
  contextUsage: string;

  @IsString()
  @IsOptional()
  etymology?: string;

  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}
