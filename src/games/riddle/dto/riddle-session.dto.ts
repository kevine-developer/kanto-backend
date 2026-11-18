import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class StartRiddleSessionDto {
  @IsOptional()
  groupNumber?: number | string;

  @IsOptional()
  level?: number | string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  questionCount?: number;
}

export class AnswerRiddleQuestionDto {
  @IsString()
  sessionId!: string;

  @IsString()
  questionId!: string;

  @IsOptional()
  @IsString()
  userAnswer?: string;
}

export class FinishRiddleSessionDto {
  @IsString()
  sessionId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  durationSeconds?: number;
}

export class AbandonRiddleSessionDto {
  @IsString()
  sessionId!: string;
}
