import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ValidateContributionDto {
  @IsBoolean()
  approve!: boolean;

  @IsOptional()
  @IsBoolean()
  requestChanges?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  feedback?: string;
}
