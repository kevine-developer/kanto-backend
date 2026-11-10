import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindTracksQueryDto {
  @IsOptional()
  @IsString()
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

  @IsOptional()
  @IsString()
  search?: string;
}

export class CompleteLessonDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number = 100;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  timeSpentSeconds?: number = 0;

  @IsOptional()
  reviewNotions?: Array<{
    termMg: string;
    meaningFr: string;
    phonetic?: string;
    contextMg?: string;
    contextFr?: string;
  }>;
}

export class ReviewActionDto {
  @IsOptional()
  @IsString()
  action?: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY' | 'again' | 'hard' | 'good' | 'easy';

  @IsOptional()
  @IsString()
  quality?: 'again' | 'hard' | 'good' | 'easy' | 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';
}
