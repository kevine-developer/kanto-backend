import { IsString, IsNotEmpty, MinLength, Matches, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO pour la modification d'un mot de passe existant (Situation B).
 * Exige l'ancien mot de passe pour vérification de sécurité côté serveur.
 */
export class ChangePasswordDto {
  @IsString({ message: 'Le mot de passe actuel doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le mot de passe actuel est obligatoire.' })
  currentPassword: string;

  @IsString({ message: 'Le nouveau mot de passe doit être une chaîne de caractères.' })
  @MinLength(8, {
    message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
  })
  @Matches(/[A-Z]/, {
    message: 'Le mot de passe doit contenir au moins une lettre majuscule.',
  })
  @Matches(/[0-9]/, {
    message: 'Le mot de passe doit contenir au moins un chiffre.',
  })
  newPassword: string;

  @IsOptional()
  @IsBoolean({ message: 'revokeOtherSessions doit être un booléen.' })
  revokeOtherSessions?: boolean;
}
