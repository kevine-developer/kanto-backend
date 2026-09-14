import { IsString, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { AnnouncementType } from '../../../generated/prisma/client.js';

export class CreateAnnouncementDto {
  @IsString()
  titleFr: string;

  @IsString()
  titleMg: string;

  @IsString()
  messageFr: string;

  @IsString()
  messageMg: string;

  @IsEnum(AnnouncementType)
  type: AnnouncementType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateAnnouncementDto {
  @IsString()
  @IsOptional()
  titleFr?: string;

  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsOptional()
  messageFr?: string;

  @IsString()
  @IsOptional()
  messageMg?: string;

  @IsEnum(AnnouncementType)
  @IsOptional()
  type?: AnnouncementType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
