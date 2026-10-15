import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class ResolveReportDto {
  @IsOptional()
  @IsBoolean()
  resolved?: boolean = true;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  adminNote?: string;
}
