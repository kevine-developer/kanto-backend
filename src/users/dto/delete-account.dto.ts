import { IsOptional, IsString, Equals } from 'class-validator';

/**
 * DTO pour la suppression définitive de compte utilisateur.
 * Conforme au RGPD et aux exigences de sécurité Kanto :
 * - Confirmation explicite via phrase clé obligatoire.
 * - Mot de passe requis si le compte possède des identifiants locaux (credential).
 * - Optionnel pour les comptes exclusivement OAuth (Google, etc.).
 */
export class DeleteAccountDto {
  @IsString({
    message: 'La phrase de confirmation est requise.',
  })
  @Equals('SUPPRIMER MON COMPTE', {
    message:
      'Veuillez saisir exactement « SUPPRIMER MON COMPTE » pour confirmer.',
  })
  confirmationPhrase: string;

  @IsOptional()
  @IsString({
    message: 'Le mot de passe doit être une chaîne de caractères.',
  })
  password?: string;
}
