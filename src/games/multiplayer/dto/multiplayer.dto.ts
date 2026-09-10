import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum MultiplayerGameTypeEnum {
  TRUE_FALSE = 'TRUE_FALSE',
  MISSING_WORD = 'MISSING_WORD',
}

export class CreateMultiplayerGameDto {
  @IsOptional()
  @IsEnum(MultiplayerGameTypeEnum)
  gameType?: MultiplayerGameTypeEnum = MultiplayerGameTypeEnum.TRUE_FALSE;

  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(15)
  totalQuestions?: number = 5;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(30)
  timePerQuestion?: number = 15;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  userAvatar?: string;
}

export class JoinMultiplayerGameDto {
  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  userAvatar?: string;
}

export class SubmitMultiplayerAnswerDto {
  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsString()
  questionId!: string;

  @IsInt()
  @Min(0)
  questionIndex!: number;

  @IsNotEmpty()
  @IsString()
  userAnswer!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  timeTakenMs?: number = 0;
}

export class StartMultiplayerGameDto {
  @IsNotEmpty()
  @IsString()
  code!: string;
}

// Alias de rétrocompatibilité
export {
  MultiplayerGameTypeEnum as DuelGameTypeEnum,
  CreateMultiplayerGameDto as CreateDuelDto,
  JoinMultiplayerGameDto as JoinDuelDto,
  SubmitMultiplayerAnswerDto as SubmitDuelAnswerDto,
  StartMultiplayerGameDto as StartDuelDto,
};
