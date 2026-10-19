import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { WordRarity, ContentStatus } from '../../../generated/prisma/client.js';

export class QueryRakiTenyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  letter?: string;

  @IsOptional()
  @IsEnum(WordRarity)
  rarity?: WordRarity;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
