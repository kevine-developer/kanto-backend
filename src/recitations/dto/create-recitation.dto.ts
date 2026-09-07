import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateRecitationDto {
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
  description?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  durationMinutes?: number;

  @IsArray()
  @IsString({ each: true })
  contentLines!: string[];

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
}
