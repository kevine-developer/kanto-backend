import {
  IsString,
  IsOptional,
  MaxLength,
  IsArray,
  IsInt,
  Min,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ContentStatus } from '../../../generated/prisma/client.js';

export class UpdateRecitationDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  titleFr?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  author?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  durationMinutes?: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  contentLines?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  references?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}
