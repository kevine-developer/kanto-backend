import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AdjustXpDto {
  @IsNumber()
  @Type(() => Number)
  xpDelta: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
