import {
  IsString,
  IsOptional,
  MaxLength,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CivicSubCategory,
  ContentStatus,
} from '../../../generated/prisma/client.js';
import { CreateCivicStructureRoleDto } from './create-civic.dto.js';

export class UpdateCivicDto {
  @IsEnum(CivicSubCategory)
  @IsOptional()
  subCategory?: CivicSubCategory;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  titleFr?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  titleMg?: string;

  @IsString()
  @IsOptional()
  summaryFr?: string;

  @IsString()
  @IsOptional()
  summaryMg?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  contentFr?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  contentMg?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  themes?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  sources?: string[];

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCivicStructureRoleDto)
  structureRoles?: CreateCivicStructureRoleDto[];
}
