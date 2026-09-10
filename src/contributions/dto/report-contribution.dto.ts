import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReportContributionDto {
  @IsNotEmpty({ message: 'Le motif du signalement est requis' })
  @IsString({ message: 'Le motif doit être une chaîne de caractères' })
  @MaxLength(200, { message: 'Le motif ne doit pas dépasser 200 caractères' })
  reason!: string;

  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @MaxLength(1000, {
    message: 'La description ne doit pas dépasser 1000 caractères',
  })
  description?: string;
}
