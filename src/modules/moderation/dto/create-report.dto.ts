import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ReportReason } from '../../../../generated/prisma/client.js';

export class CreateContentReportDto {
  @IsEnum(ReportReason, {
    message: 'Le motif de signalement spécifié est invalide',
  })
  @IsNotEmpty({ message: 'Le motif de signalement est requis' })
  reason: ReportReason;

  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @MaxLength(1000, {
    message: 'La description ne peut pas dépasser 1000 caractères',
  })
  description?: string;

  // Cibles polymorphiques optionnelles
  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsString()
  citationId?: string;

  @IsOptional()
  @IsString()
  conteId?: string;

  @IsOptional()
  @IsString()
  kabaryId?: string;

  @IsOptional()
  @IsString()
  poesieId?: string;

  @IsOptional()
  @IsString()
  recitationId?: string;

  @IsOptional()
  @IsString()
  quizSetId?: string;

  @IsOptional()
  @IsString()
  contributionId?: string;
}
