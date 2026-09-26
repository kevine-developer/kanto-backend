import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateMarketingBannerDto {
  @IsString()
  @IsNotEmpty()
  badgeFr: string;

  @IsString()
  @IsNotEmpty()
  badgeMg: string;

  @IsString()
  @IsNotEmpty()
  titleFr: string;

  @IsString()
  @IsNotEmpty()
  titleMg: string;

  @IsString()
  @IsNotEmpty()
  descriptionFr: string;

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
}

export class UpdateMarketingBannerDto {
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
}

export class ReorderMarketingBannersDto {
  @IsNotEmpty()
  items: { id: string; orderIndex: number }[];
}
