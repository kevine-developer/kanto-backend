import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import {
  EventCategory,
  EventParticipationType,
  EventStatus,
  EventModerationStatus,
} from '../../../generated/prisma/client.js';

export class CreatePartnerEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  titleFr!: string;

  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  descriptionFr!: string;

  @IsString()
  @IsOptional()
  descriptionMg?: string;

  @IsString()
  @IsOptional()
  shortDescFr?: string;

  @IsString()
  @IsOptional()
  shortDescMg?: string;

  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsEnum(EventParticipationType)
  @IsOptional()
  participationType?: EventParticipationType;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsDateString()
  @IsOptional()
  registrationDeadline?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsUrl()
  @IsOptional()
  externalUrl?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  bannerUrl?: string;

  @IsInt()
  @Min(1)
  @Max(100000)
  @IsOptional()
  maxParticipants?: number;

  @IsBoolean()
  @IsOptional()
  enableWaitlist?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  waitlistCapacity?: number;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  ticketPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  rulesFr?: string;

  @IsString()
  @IsOptional()
  rulesMg?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;

  // Si false, enregistré comme brouillon local (DRAFT), si true soumis à la modération (PENDING_REVIEW)
  @IsBoolean()
  @IsOptional()
  submitForReview?: boolean;
}

export class UpdatePartnerEventDto {
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
  shortDescFr?: string;

  @IsString()
  @IsOptional()
  shortDescMg?: string;

  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsEnum(EventParticipationType)
  @IsOptional()
  participationType?: EventParticipationType;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsDateString()
  @IsOptional()
  registrationDeadline?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsUrl()
  @IsOptional()
  externalUrl?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  bannerUrl?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @IsBoolean()
  @IsOptional()
  enableWaitlist?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  waitlistCapacity?: number;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  ticketPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  rulesFr?: string;

  @IsString()
  @IsOptional()
  rulesMg?: string;

  @IsString()
  @IsOptional()
  cancelledReason?: string;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsBoolean()
  @IsOptional()
  submitForReview?: boolean;
}

export class ReviewPartnerEventDto {
  @IsEnum(EventModerationStatus)
  decision!: EventModerationStatus; // APPROVED, REJECTED, SUSPENDED

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
