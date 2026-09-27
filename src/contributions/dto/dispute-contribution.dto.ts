import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DisputeContributionDto {
  @IsString({
    message: 'Le message de réclamation doit être une chaîne de caractères',
  })
  @IsNotEmpty({
    message:
      'Veuillez expliquer pourquoi cette contribution n’est pas un doublon',
  })
  @MinLength(10, {
    message: 'L’explication doit contenir au moins 10 caractères',
  })
  @MaxLength(1000, {
    message: 'L’explication ne peut pas dépasser 1000 caractères',
  })
  message: string;
}
