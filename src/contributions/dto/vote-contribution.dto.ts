import { IsIn, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class VoteContributionDto {
  @IsNotEmpty({ message: 'La valeur du vote est obligatoire' })
  @Type(() => Number)
  @IsInt({ message: 'La valeur du vote doit être un nombre entier' })
  @IsIn([1, -1, 0], {
    message:
      'Vote invalide : la valeur doit être 1 (upvote), -1 (downvote) ou 0 (annuler)',
  })
  value!: number; // 1 (upvote), -1 (downvote), 0 (annuler)
}
