import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  AiCampaignStatus,
  AiDraftStatus,
  AiFeatureStatus,
  AiKnowledgeStatus,
  AiKnowledgeVisibility,
} from '../../../generated/prisma/client.js';

export const ALLOWED_PLATFORMS = [
  'FACEBOOK',
  'INSTAGRAM',
  'TIKTOK',
  'YOUTUBE',
  'THREADS',
  'LINKEDIN',
  'NEWSLETTER',
  'PRESS',
  'SEO_BLOG',
  'VIDEO_SCRIPT',
] as const;

export const ALLOWED_LANGUAGES = ['FR', 'MG', 'BILINGUAL'] as const;

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsIn(ALLOWED_PLATFORMS)
  defaultPlatform?: string;

  @IsOptional()
  @IsIn(ALLOWED_LANGUAGES)
  defaultLanguage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  defaultTone?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;
}

export class UpdateConversationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsIn(ALLOWED_PLATFORMS)
  defaultPlatform?: string;

  @IsOptional()
  @IsIn(ALLOWED_LANGUAGES)
  defaultLanguage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  defaultTone?: string;

  @IsOptional()
  @IsString()
  campaignId?: string | null;
}

export class SendChatMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(6000)
  content!: string;

  @IsOptional()
  @IsIn(ALLOWED_PLATFORMS)
  platform?: string;

  @IsOptional()
  @IsIn(ALLOWED_LANGUAGES)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  objective?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  tone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  model?: string;
}

export class CreateKnowledgeDocumentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(180)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  version?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  source?: string;

  @IsOptional()
  @IsEnum(AiKnowledgeStatus)
  validationStatus?: AiKnowledgeStatus;

  @IsOptional()
  @IsEnum(AiKnowledgeVisibility)
  visibilityScope?: AiKnowledgeVisibility;

  @IsString()
  @MinLength(20)
  @MaxLength(50000)
  content!: string;
}

export class UpdateKnowledgeDocumentDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(180)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  version?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  source?: string;

  @IsOptional()
  @IsEnum(AiKnowledgeStatus)
  validationStatus?: AiKnowledgeStatus;

  @IsOptional()
  @IsEnum(AiKnowledgeVisibility)
  visibilityScope?: AiKnowledgeVisibility;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(50000)
  content?: string;
}

export class UpdateFeatureRegistryDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  nameFr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  nameMg?: string;

  @IsOptional()
  @IsEnum(AiFeatureStatus)
  status?: AiFeatureStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class SaveMarketingDraftDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsIn(ALLOWED_PLATFORMS)
  platform!: string;

  @IsIn(ALLOWED_LANGUAGES)
  language!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  tone?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  body!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(300)
  cta?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  visualConcept?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  visualAspectRatio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  imagePrompt?: string;

  @IsOptional()
  @IsEnum(AiDraftStatus)
  status?: AiDraftStatus;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsString()
  sourceMessageId?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;
}

export class UpdateMarketingDraftDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsIn(ALLOWED_PLATFORMS)
  platform?: string;

  @IsOptional()
  @IsIn(ALLOWED_LANGUAGES)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  tone?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  body?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(300)
  cta?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  visualConcept?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  visualAspectRatio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  imagePrompt?: string;

  @IsOptional()
  @IsEnum(AiDraftStatus)
  status?: AiDraftStatus;

  @IsOptional()
  @IsString()
  campaignId?: string | null;
}

export class CreateCampaignDto {
  @IsString()
  @MinLength(2)
  @MaxLength(180)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  objective!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  targetAudience?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @IsOptional()
  @IsEnum(AiCampaignStatus)
  status?: AiCampaignStatus;
}
