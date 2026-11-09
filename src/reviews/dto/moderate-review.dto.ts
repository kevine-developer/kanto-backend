import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum ReviewModerationAction {
  APPROVE = 'APPROVED',
  REJECT = 'REJECTED',
  PENDING = 'PENDING',
}

export class ModerateReviewDto {
  @IsEnum(ReviewModerationAction, {
    message: 'L’action de modération doit être APPROVED, REJECTED ou PENDING.',
  })
  status: ReviewModerationAction;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'La note de modération ne peut pas dépasser 1000 caractères.' })
  moderatorNote?: string;
}

