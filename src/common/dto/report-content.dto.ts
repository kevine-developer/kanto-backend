import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportReason } from '../../../generated/prisma/client.js';

export class ReportContentDto {
  @IsEnum(ReportReason, {
    message:
      'La raison doit être valide (TRANSLATION_ERROR, TYPO, INCORRECT_MEANING, INAPPROPRIATE, OTHER)',
  })
  reason!: ReportReason;

  @IsString()
  @IsOptional()
  description?: string;
}
