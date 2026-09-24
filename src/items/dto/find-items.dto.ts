import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FindItemsQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['PROVERBE', 'EXPRESSION', 'DICTON'])
  category?: 'PROVERBE' | 'EXPRESSION' | 'DICTON';

  @IsOptional()
  @IsString()
  themeSlug?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['EASY', 'MEDIUM', 'HARD'])
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  seed?: string;

  @IsOptional()
  @IsString()
  excludeIds?: string;
}
