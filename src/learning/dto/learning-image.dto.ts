import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO pour le téléversement ou la mise à jour de l'image de couverture d'un cours.
 */
export class UploadTrackCoverDto {
  @IsString({ message: "L'image en base64 est obligatoire" })
  @IsNotEmpty({ message: "L'image en base64 ne peut pas être vide" })
  imageBase64!: string;

  @IsString()
  @IsOptional()
  fileName?: string;
}

/**
 * DTO pour l'ajout d'une image pédagogique à une leçon.
 */
export class CreateLessonImageDto {
  @IsString()
  @IsOptional()
  imageBase64?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString({ message: 'Le texte alternatif doit être une chaîne' })
  @IsOptional()
  altText?: string;

  @IsString()
  @IsOptional()
  captionFr?: string;

  @IsString()
  @IsOptional()
  captionMg?: string;

  @IsString({ message: 'Le crédit/source doit être une chaîne' })
  @IsOptional()
  credit?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;
}

/**
 * DTO pour la modification des métadonnées d'une image de leçon.
 */
export class UpdateLessonImageDto {
  @IsString()
  @IsOptional()
  imageBase64?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsString()
  @IsOptional()
  captionFr?: string;

  @IsString()
  @IsOptional()
  captionMg?: string;

  @IsString()
  @IsOptional()
  credit?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;
}

/**
 * DTO pour réordonner les images d'une leçon.
 */
export class ReorderLessonImagesDto {
  @IsArray({ message: 'imageIds doit être une liste' })
  @IsString({ each: true, message: 'Chaque élément de imageIds doit être une chaîne' })
  imageIds!: string[];
}
