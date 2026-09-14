import {
  IsArray,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ReplaceGameProgressionDto {
  @IsString()
  gameType: string;

  @IsInt()
  @Min(0)
  unlockedLevelIndex: number;

  @IsObject()
  levelStars: Record<string, number>;
}

export class ReplaceXpTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  source: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class ReplaceProgressionDto {
  @IsNumber()
  @Min(0)
  totalXp: number;

  @IsInt()
  @Min(1)
  level: number;

  @IsInt()
  @Min(0)
  coins: number;

  @IsInt()
  @Min(0)
  streakDays: number;

  @IsArray()
  @IsOptional()
  xpTransactions?: ReplaceXpTransactionDto[];

  @IsArray()
  @IsOptional()
  games?: ReplaceGameProgressionDto[];
}
