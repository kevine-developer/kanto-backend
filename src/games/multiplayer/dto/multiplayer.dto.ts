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
  QUIZ = 'QUIZ',
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

  @IsOptional()
  @IsString()
  opponentId?: string;

  @IsOptional()
  @IsString()
  theme?: string = 'ALL';

  @IsOptional()
  @IsString()
  themeChooserId?: string;
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

export class ChangeMultiplayerThemeDto {
  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsString()
  theme!: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

export class DelegateThemeChoiceDto {
  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  targetUserId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

// Alias de rétrocompatibilité
export {
  MultiplayerGameTypeEnum as DuelGameTypeEnum,
  CreateMultiplayerGameDto as CreateDuelDto,
  JoinMultiplayerGameDto as JoinDuelDto,
  SubmitMultiplayerAnswerDto as SubmitDuelAnswerDto,
  StartMultiplayerGameDto as StartDuelDto,
  ChangeMultiplayerThemeDto as ChangeDuelThemeDto,
  DelegateThemeChoiceDto as DelegateDuelThemeDto,
};
