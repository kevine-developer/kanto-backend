import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class StartCivicSessionDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  questionCount?: number;

  @IsOptional()
  levelNumber?: number | string;
}

export class AnswerCivicQuestionDto {
  @IsString()
  sessionId!: string;

  @IsString()
  questionId!: string;

  @IsOptional()
  @IsInt()
  userAnswerIndex?: number | null;

  @IsOptional()
  @IsString()
  userAnswerText?: string;
}

export class FinishCivicSessionDto {
  @IsString()
  sessionId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  durationSeconds?: number;
}
