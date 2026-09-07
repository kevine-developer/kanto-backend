import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../../../generated/prisma/client.js';

export class CreateContributionDto {
  @IsEnum(CategoryType)
  category!: CategoryType;

  @IsString()
  textMg!: string;

  @IsString()
  textFr!: string;

  @IsString()
  meaning!: string;

  @IsString()
  @IsOptional()
  region?: string;
}
