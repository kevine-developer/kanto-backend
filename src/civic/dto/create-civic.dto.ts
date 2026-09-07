import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CivicSubCategory } from '../../../generated/prisma/client.js';

export class CreateCivicStructureRoleDto {
  @IsString()
  @IsNotEmpty()
  titleFr!: string;

  @IsString()
  @IsNotEmpty()
  titleMg!: string;

  @IsString()
  @IsNotEmpty()
  roleFr!: string;

  @IsString()
  @IsNotEmpty()
  roleMg!: string;
}

export class CreateCivicDto {
  @IsEnum(CivicSubCategory)
  subCategory!: CivicSubCategory;

  @IsString()
  @IsNotEmpty({ message: 'Le titre français est obligatoire' })
  @MaxLength(255)
  titleFr!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le titre malgache est obligatoire' })
  @MaxLength(255)
  titleMg!: string;

  @IsString()
  @IsOptional()
  summaryFr?: string;

  @IsString()
  @IsOptional()
  summaryMg?: string;

  @IsArray()
  @IsString({ each: true })
  contentFr!: string[];

  @IsArray()
  @IsString({ each: true })
  contentMg!: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  themes?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  sources?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCivicStructureRoleDto)
  structureRoles?: CreateCivicStructureRoleDto[];
}
