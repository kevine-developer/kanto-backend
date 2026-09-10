import { IsEnum, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export type LeaderboardPeriod = 'day' | 'week' | 'month' | 'alltime';

export class LeaderboardQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsEnum(['day', 'week', 'month', 'alltime'])
  period?: LeaderboardPeriod = 'alltime';

  @IsOptional()
  userId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  currentXp?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  level?: number;
}
