import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ReportStatus } from '../../../../generated/prisma/client.js';

export class ResolveReportDto {
  @IsOptional()
  @IsBoolean()
  resolved?: boolean;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  moderatorNotes?: string;

  @IsOptional()
  @IsString()
  adminNote?: string;

  @IsOptional()
  @IsString()
  actionTaken?:
    'NONE' | 'WARNING' | 'SUSPENSION' | 'BAN' | 'CONTENT_REMOVED' | 'DISMISSED';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  suspensionDays?: number;
}
