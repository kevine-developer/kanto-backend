import {
  IsString,
  IsOptional,
  MaxLength,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStanzaDto } from './create-poesie.dto.js';
import { ContentStatus } from '../../../generated/prisma/client.js';

export class UpdatePoesieDto {
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
  @MaxLength(100)
  period?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @IsString()
  @IsOptional()
  explanationMg?: string;

  @IsString()
  @IsOptional()
  explanationFr?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStanzaDto)
  stanzas?: CreateStanzaDto[];
}
