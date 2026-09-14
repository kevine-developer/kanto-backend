import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: "L'adresse email saisie est invalide" })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
