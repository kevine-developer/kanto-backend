import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStanzaDto {
  @IsArray()
  @IsString({ each: true })
  versesMg!: string[];

  @IsArray()
  @IsString({ each: true })
  versesFr!: string[];
}

export class CreatePoesieDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le titre français est obligatoire' })
  @MaxLength(200)
  titleFr!: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStanzaDto)
  stanzas!: CreateStanzaDto[];
}
