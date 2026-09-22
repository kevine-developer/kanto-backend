import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateWelcomeSlideDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsNotEmpty()
  badge: string;

  @IsString()
  @IsNotEmpty()
  badgeMg: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateWelcomeSlideDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsString()
  @IsOptional()
  badgeMg?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ReorderWelcomeSlidesDto {
  @IsNotEmpty()
  slides: { id: string; orderIndex: number }[];
}

export class UploadWelcomeSlideImageDto {
  @IsString()
  @IsNotEmpty()
  imageBase64: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsString()
  @IsOptional()
  subfolder?: string;
}

