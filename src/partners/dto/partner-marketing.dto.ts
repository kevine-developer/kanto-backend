import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MarketingRequestStatus } from '../../../generated/prisma/client.js';

export class CreateMarketingRequestDto {
  @IsString()
  @IsNotEmpty()
  eventId!: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  placementCodes!: string[]; // ex: ["HERO_BANNER", "FEATURED_SPOTLIGHT"]

  @IsDateString()
  @IsNotEmpty()
  requestedStartDate!: string;

  @IsDateString()
  @IsNotEmpty()
  requestedEndDate!: string;

  @IsString()
  @IsOptional()
  campaignGoals?: string;

  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  proposedBudget?: number;

  @IsOptional()
  creatives?: {
    bannerImageUrl?: string;
    tagline?: string;
    customMessage?: string;
    externalLink?: string;
  };
}

export class SendMarketingMessageDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}

export class ReviewMarketingRequestDto {
  @IsEnum(MarketingRequestStatus)
  status!: MarketingRequestStatus;

  @IsDateString()
  @IsOptional()
  actualStartDate?: string;

  @IsDateString()
  @IsOptional()
  actualEndDate?: string;

  @IsString()
  @IsOptional()
  adminFeedback?: string;
}
