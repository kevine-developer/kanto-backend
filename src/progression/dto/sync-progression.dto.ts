import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SyncGameProgressionDto {
  @IsString()
  gameType: string;

  @IsNumber()
  unlockedLevelIndex: number;

  @IsObject()
  levelStars: Record<string, number>;
}

export class SyncXpTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  source: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class SyncProgressionDto {
  @IsArray()
  @IsOptional()
  games?: SyncGameProgressionDto[];

  @IsArray()
  @IsOptional()
  xpTransactions?: SyncXpTransactionDto[];
}
