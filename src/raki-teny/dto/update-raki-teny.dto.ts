import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { WordRarity, ContentStatus } from '../../../generated/prisma/client.js';

export class UpdateRakiTenyDto {
  @IsString()
  @IsOptional()
  word?: string;

  @IsString()
  @IsOptional()
  phonetic?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  wordClassMg?: string;

  @IsString()
  @IsOptional()
  wordClassFr?: string;

  @IsEnum(WordRarity)
  @IsOptional()
  rarity?: WordRarity;

  @IsString()
  @IsOptional()
  rarityLabelMg?: string;

  @IsString()
  @IsOptional()
  rarityLabelFr?: string;

  @IsString()
  @IsOptional()
  meaningMg?: string;

  @IsString()
  @IsOptional()
  meaningFr?: string;

  @IsString()
  @IsOptional()
  exampleMg?: string;

  @IsString()
  @IsOptional()
  exampleFr?: string;

  @IsString()
  @IsOptional()
  contextUsage?: string;

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
