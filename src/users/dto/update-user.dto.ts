import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]{3,25}$/, {
    message:
      "Le nom d'utilisateur doit contenir entre 3 et 25 caractères alphanumériques (lettres, chiffres ou tiret bas)",
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  username?: string;

  @IsEmail({}, { message: "L'adresse email saisie est invalide" })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  image?: string;
}

