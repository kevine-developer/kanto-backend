import { IsOptional, IsString } from 'class-validator';

export class GetDailyAstrologyDto {
  @IsOptional()
  @IsString()
  sign?: string;

  @IsOptional()
  @IsString()
  date?: string; // Format YYYY-MM-DD
}
