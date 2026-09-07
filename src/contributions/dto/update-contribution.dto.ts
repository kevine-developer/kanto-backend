import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../../../generated/prisma/client.js';

export class UpdateContributionDto {
  @IsEnum(CategoryType)
  @IsOptional()
  category?: CategoryType;

  @IsString()
  @IsOptional()
  textMg?: string;

  @IsString()
  @IsOptional()
  textFr?: string;

  @IsString()
  @IsOptional()
  meaning?: string;

  @IsString()
  @IsOptional()
  region?: string;
}
