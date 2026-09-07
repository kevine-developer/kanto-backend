import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
} from 'class-validator';
import { DifficultyLevel } from '../../../generated/prisma/client.js';

export class CreateCivicQuizDto {
  @IsString()
  @IsNotEmpty({ message: 'La catégorie est obligatoire' })
  category!: string;

  @IsString()
  @IsNotEmpty({ message: 'La question est obligatoire' })
  prompt!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  choices!: string[];

  @IsInt()
  @Min(0)
  @Max(5)
  answerIndex!: number;

  @IsString()
  @IsNotEmpty({ message: "L'explication est obligatoire" })
  explanation!: string;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
