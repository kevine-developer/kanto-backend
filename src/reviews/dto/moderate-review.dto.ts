import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

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
  @MaxLength(1000, {
    message: 'La note de modération ne peut pas dépasser 1000 caractères.',
  })
  moderatorNote?: string;
}

export class BatchModerateReviewsDto {
  @IsArray({ message: 'La liste des identifiants d’avis est requise.' })
  @ArrayMinSize(1, { message: 'Sélectionnez au moins un avis.' })
  @ArrayMaxSize(50, {
    message: 'Vous pouvez traiter au maximum 50 avis à la fois.',
  })
  @IsString({
    each: true,
    message: 'Chaque identifiant d’avis doit être valide.',
  })
  reviewIds: string[];

  @IsEnum(ReviewModerationAction, {
    message: 'L’action de modération doit être APPROVED, REJECTED ou PENDING.',
  })
  status: ReviewModerationAction;

  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: 'La note de modération ne peut pas dépasser 1000 caractères.',
  })
  moderatorNote?: string;
}
