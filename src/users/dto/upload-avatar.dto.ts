import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadAvatarDto {
  @IsString({ message: "L'image en base64 doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "L'image en base64 est obligatoire" })
  imageBase64!: string;

  @IsString()
  @IsOptional()
  fileName?: string;
}
