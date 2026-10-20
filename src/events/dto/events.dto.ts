import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  EventCategory,
  EventParticipationType,
  EventRewardType,
  EventStatus,
} from '../../../generated/prisma/client.js';

export class CreateEventRewardDto {
  @IsEnum(EventRewardType, { message: 'Type de récompense invalide' })
  rewardType: EventRewardType;

  @IsNotEmpty({ message: 'Titre malgache de la récompense obligatoire' })
  @IsString()
  titleMg: string;

  @IsNotEmpty({ message: 'Titre français de la récompense obligatoire' })
  @IsString()
  titleFr: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  badgeId?: string;

  @IsOptional()
  @IsString()
  lotDescription?: string;

  @IsOptional()
  @IsString()
  criteria?: string; // "top_1", "top_3", "completion", "score_above_80"

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxWinners?: number;
}

export class CreateEventDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsNotEmpty({ message: 'Titre en malgache obligatoire' })
  @IsString()
  titleMg: string;

  @IsNotEmpty({ message: 'Titre en français obligatoire' })
  @IsString()
  titleFr: string;

  @IsNotEmpty({ message: 'Description en malgache obligatoire' })
  @IsString()
  descriptionMg: string;

  @IsNotEmpty({ message: 'Description en français obligatoire' })
  @IsString()
  descriptionFr: string;

  @IsOptional()
  @IsString()
  shortDescMg?: string;

  @IsOptional()
  @IsString()
  shortDescFr?: string;

  @IsOptional()
  @IsEnum(EventCategory, { message: 'Catégorie d’événement invalide' })
  category?: EventCategory;

  @IsOptional()
  @IsEnum(EventParticipationType, { message: 'Type de participation invalide' })
  participationType?: EventParticipationType;

  @IsOptional()
  @IsString()
  minTier?: string; // "FREE", "PREMIUM", "VIP"

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  externalUrl?: string;

  @IsNotEmpty({ message: 'Date de début obligatoire' })
  startDate: string | Date;

  @IsNotEmpty({ message: 'Date de fin obligatoire' })
  endDate: string | Date;

  @IsOptional()
  registrationDeadline?: string | Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxParticipants?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  rulesMg?: string;

  @IsOptional()
  @IsString()
  rulesFr?: string;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  rewards?: CreateEventRewardDto[];
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  titleMg?: string;

  @IsOptional()
  @IsString()
  titleFr?: string;

  @IsOptional()
  @IsString()
  descriptionMg?: string;

  @IsOptional()
  @IsString()
  descriptionFr?: string;

  @IsOptional()
  @IsString()
  shortDescMg?: string;

  @IsOptional()
  @IsString()
  shortDescFr?: string;

  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @IsOptional()
  @IsEnum(EventParticipationType)
  participationType?: EventParticipationType;

  @IsOptional()
  @IsString()
  minTier?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  externalUrl?: string;

  @IsOptional()
  startDate?: string | Date;

  @IsOptional()
  endDate?: string | Date;

  @IsOptional()
  registrationDeadline?: string | Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxParticipants?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  rulesMg?: string;

  @IsOptional()
  @IsString()
  rulesFr?: string;

  @IsOptional()
  metadata?: any;
}

export class UpdateEventStatusDto {
  @IsNotEmpty({ message: 'Nouveau statut obligatoire' })
  @IsEnum(EventStatus, { message: 'Statut d’événement invalide' })
  status: EventStatus;

  @IsOptional()
  @IsString()
  cancelledReason?: string;
}

export class EventQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  myEvents?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class SubmitEventProgressDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercent?: number;

  @IsOptional()
  metadata?: any;
}

export class DistributeRewardsDto {
  @IsOptional()
  @IsString()
  rewardId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  topN?: number;
}
