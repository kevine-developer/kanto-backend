import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export enum PublicDisplayNameTypeDto {
  FIRSTNAME = 'FIRSTNAME',
  PSEUDO = 'PSEUDO',
  ANONYMOUS = 'ANONYMOUS',
}

export class CreateReviewDto {
  @IsInt({ message: 'La note doit être un nombre entier.' })
  @Min(1, { message: 'La note minimale est de 1 étoile.' })
  @Max(5, { message: 'La note maximale est de 5 étoiles.' })
  rating: number;

  @IsString({ message: 'Le commentaire doit être une chaîne de caractères.' })
  @MinLength(10, { message: 'Le commentaire doit contenir au moins 10 caractères.' })
  @MaxLength(2000, { message: 'Le commentaire ne peut pas dépasser 2000 caractères.' })
  comment: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  authorName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'L’adresse e-mail doit être valide.' })
  authorEmail?: string;

  @IsOptional()
  @IsBoolean()
  isPublicationAuthorized?: boolean;

  @IsOptional()
  @IsEnum(PublicDisplayNameTypeDto)
  publicDisplayNameType?: PublicDisplayNameTypeDto;

  @IsOptional()
  @IsString()
  appVersion?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;
}

