import { IsString, MinLength, Matches } from 'class-validator';

/**
 * DTO pour l'ajout d'un mot de passe Kanto à un compte sans identifiants locaux.
 * Ne requiert pas de mot de passe actuel puisque l'opération est réservée aux comptes
 * qui n'en possèdent pas encore (comptes OAuth uniquement).
 */
export class AddPasswordDto {
  @IsString()
  @MinLength(8, {
    message:
      'Le nouveau mot de passe doit contenir au moins 8 caractères.',
  })
  @Matches(/[A-Z]/, {
    message:
      'Le mot de passe doit contenir au moins une lettre majuscule.',
  })
  @Matches(/[0-9]/, {
    message: 'Le mot de passe doit contenir au moins un chiffre.',
  })
  newPassword: string;
}
