import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CategoryType } from '../../../generated/prisma/client.js';

export class CheckDuplicateDto {
  @IsString({ message: 'Le texte malgache est obligatoire' })
  @IsNotEmpty()
  @MinLength(5, { message: 'Le texte doit contenir au moins 5 caractères' })
  textMg: string;

  @IsEnum(CategoryType, { message: 'Catégorie invalide' })
  @IsOptional()
  category?: CategoryType;

  @IsString()
  @IsOptional()
  excludeContributionId?: string;
}
