import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsIn,
  IsInt,
  Min,
} from 'class-validator';

export class CheckAppVersionQueryDto {
  @IsString()
  @IsIn(['android', 'ios', 'all'])
  platform: 'android' | 'ios' | 'all';

  @IsOptional()
  @IsString()
  currentVersion?: string;
}

export class CreateAppVersionDto {
  @IsString()
  @IsIn(['android', 'ios', 'all'])
  platform: 'android' | 'ios' | 'all';

  @IsString()
  version: string;

  @IsOptional()
  @IsString()
  minVersion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  buildNumber?: number;

  @IsOptional()
  @IsString()
  titleFr?: string;

  @IsOptional()
  @IsString()
  titleMg?: string;

  @IsOptional()
  @IsString()
  messageFr?: string;

  @IsOptional()
  @IsString()
  messageMg?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  releaseNotesFr?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  releaseNotesMg?: string[];

  @IsOptional()
  @IsString()
  storeUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateAppVersionDto {
  @IsOptional()
  @IsString()
  @IsIn(['android', 'ios', 'all'])
  platform?: 'android' | 'ios' | 'all';

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  minVersion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  buildNumber?: number;

  @IsOptional()
  @IsString()
  titleFr?: string;

  @IsOptional()
  @IsString()
  titleMg?: string;

  @IsOptional()
  @IsString()
  messageFr?: string;

  @IsOptional()
  @IsString()
  messageMg?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  releaseNotesFr?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  releaseNotesMg?: string[];

  @IsOptional()
  @IsString()
  storeUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export interface AppVersionCheckResponse {
  isUpdateAvailable: boolean;
  isMandatory: boolean;
  latestVersion: string;
  currentVersion: string;
  minVersion: string | null;
  platform: string;
  titleFr: string;
  titleMg: string;
  messageFr: string;
  messageMg: string;
  releaseNotesFr: string[];
  releaseNotesMg: string[];
  storeUrl: string;
  publishedAt: Date;
}

