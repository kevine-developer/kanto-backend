import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContributionCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Le commentaire ne peut pas être vide' })
  @MinLength(1, {
    message: 'Le commentaire doit contenir au moins 1 caractère',
  })
  @MaxLength(1000, {
    message: 'Le commentaire ne peut pas dépasser 1000 caractères',
  })
  content!: string;
}
