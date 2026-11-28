import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsIn,
  ValidateIf,
  MaxLength,
} from 'class-validator';

export const BANNER_LANGUAGE_MODES = [
  'MG_ONLY',
  'BILINGUAL',
  'FR_ONLY',
] as const;
export type BannerLanguageModeDto = (typeof BANNER_LANGUAGE_MODES)[number];

export class CreateMarketingBannerDto {
  @IsIn(BANNER_LANGUAGE_MODES)
  @IsOptional()
  languageMode?: BannerLanguageModeDto;

  @ValidateIf((o: CreateMarketingBannerDto) => o.languageMode !== 'MG_ONLY')
  @IsString()
  @IsNotEmpty()
  badgeFr: string;

  @ValidateIf((o: CreateMarketingBannerDto) => o.languageMode !== 'FR_ONLY')
  @IsString()
  @IsNotEmpty()
  badgeMg: string;

  @ValidateIf((o: CreateMarketingBannerDto) => o.languageMode !== 'MG_ONLY')
  @IsString()
  @IsNotEmpty()
  titleFr: string;

  @ValidateIf((o: CreateMarketingBannerDto) => o.languageMode !== 'FR_ONLY')
  @IsString()
  @IsNotEmpty()
  titleMg: string;

  @ValidateIf((o: CreateMarketingBannerDto) => o.languageMode !== 'MG_ONLY')
  @IsString()
  @IsNotEmpty()
  descriptionFr: string;

  @ValidateIf((o: CreateMarketingBannerDto) => o.languageMode !== 'FR_ONLY')
  @IsString()
  @IsNotEmpty()
  descriptionMg: string;

  @IsString()
  @IsOptional()
  ctaFr?: string;

  @IsString()
  @IsOptional()
  ctaMg?: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  deepLink: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  actionType?: string;

  @IsString()
  @IsOptional()
  modalBodyFr?: string;

  @IsString()
  @IsOptional()
  modalBodyMg?: string;

  @IsString()
  @IsOptional()
  modalImageUrl?: string;

  @IsString()
  @IsOptional()
  modalCtaLabelFr?: string;

  @IsString()
  @IsOptional()
  modalCtaLabelMg?: string;

  @IsString()
  @IsOptional()
  modalCtaLink?: string;

  @IsString()
  @IsOptional()
  targetLocation?: string; // "HOME", "CATEGORY", "ALL"

  @IsString()
  @IsOptional()
  categoryKey?: string; // "conte", "proverbe", "ALL", etc.
}

export class UpdateMarketingBannerDto {
  @IsIn(BANNER_LANGUAGE_MODES)
  @IsOptional()
  languageMode?: BannerLanguageModeDto;

  @IsString()
  @IsOptional()
  badgeFr?: string;

  @IsString()
  @IsOptional()
  badgeMg?: string;

  @IsString()
  @IsOptional()
  titleFr?: string;

  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsOptional()
  descriptionFr?: string;

  @IsString()
  @IsOptional()
  descriptionMg?: string;

  @IsString()
  @IsOptional()
  ctaFr?: string;

  @IsString()
  @IsOptional()
  ctaMg?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  deepLink?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  actionType?: string;

  @IsString()
  @IsOptional()
  modalBodyFr?: string;

  @IsString()
  @IsOptional()
  modalBodyMg?: string;

  @IsString()
  @IsOptional()
  modalImageUrl?: string;

  @IsString()
  @IsOptional()
  modalCtaLabelFr?: string;

  @IsString()
  @IsOptional()
  modalCtaLabelMg?: string;

  @IsString()
  @IsOptional()
  modalCtaLink?: string;

  @IsString()
  @IsOptional()
  targetLocation?: string;

  @IsString()
  @IsOptional()
  categoryKey?: string;
}

export class ReorderMarketingBannersDto {
  @IsNotEmpty()
  items: { id: string; orderIndex: number }[];
}

export class UpdateMarketingBannerAiStatusDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsIn(BANNER_LANGUAGE_MODES)
  @IsOptional()
  languageMode?: BannerLanguageModeDto;
}

export class GenerateMarketingBannerDto {
  @IsBoolean()
  @IsOptional()
  force?: boolean;

  @IsIn(BANNER_LANGUAGE_MODES)
  @IsOptional()
  languageMode?: BannerLanguageModeDto;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  theme?: string;
}
