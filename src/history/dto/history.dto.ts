import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContentStatus } from '../../../generated/prisma/client.js';

// ==========================================
// UPLOAD IMAGE DTO
// ==========================================
export class UploadHistoryImageDto {
  @IsString()
  @IsNotEmpty()
  imageBase64!: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsString()
  @IsOptional()
  subfolder?: string;
}

// ==========================================
// 1. CIVIC LESSON / THÈMES DTO
// ==========================================
export class CreateCivicLessonDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category?: string[];

  @IsString()
  @IsNotEmpty()
  titleFr!: string;

  @IsString()
  @IsNotEmpty()
  titleMg!: string;

  @IsString()
  @IsNotEmpty()
  descriptionFr!: string;

  @IsString()
  @IsNotEmpty()
  descriptionMg!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsInt()
  @IsOptional()
  orderIndex?: number;
}

export class UpdateCivicLessonDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category?: string[];

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
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsInt()
  @IsOptional()
  orderIndex?: number;
}

// ==========================================
// 2. PRESIDENT DTO
// ==========================================
export class CreatePresidentDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  titleFr!: string;

  @IsString()
  @IsNotEmpty()
  titleMg!: string;

  @IsString()
  @IsNotEmpty()
  republic!: string;

  @IsString()
  @IsNotEmpty()
  republicMg!: string;

  @IsString()
  @IsNotEmpty()
  period!: string;

  @IsString()
  @IsOptional()
  quoteFr?: string;

  @IsString()
  @IsOptional()
  quoteMg?: string;

  @IsString()
  @IsNotEmpty()
  bioFr!: string;

  @IsString()
  @IsNotEmpty()
  bioMg!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievementsFr?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievementsMg?: string[];

  @IsString()
  @IsOptional()
  badgeColor?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

export class UpdatePresidentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  titleFr?: string;

  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsOptional()
  republic?: string;

  @IsString()
  @IsOptional()
  republicMg?: string;

  @IsString()
  @IsOptional()
  period?: string;

  @IsString()
  @IsOptional()
  quoteFr?: string;

  @IsString()
  @IsOptional()
  quoteMg?: string;

  @IsString()
  @IsOptional()
  bioFr?: string;

  @IsString()
  @IsOptional()
  bioMg?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievementsFr?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievementsMg?: string[];

  @IsString()
  @IsOptional()
  badgeColor?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

// ==========================================
// 3. BANKNOTE DTO
// ==========================================
export class CreateBanknoteDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsInt()
  valueAriary!: number;

  @IsInt()
  valueFmg!: number;

  @IsString()
  @IsNotEmpty()
  titleFr!: string;

  @IsString()
  @IsNotEmpty()
  titleMg!: string;

  @IsString()
  @IsNotEmpty()
  series!: string;

  @IsString()
  @IsNotEmpty()
  seriesLabelFr!: string;

  @IsString()
  @IsNotEmpty()
  seriesLabelMg!: string;

  @IsString()
  @IsNotEmpty()
  period!: string;

  @IsString()
  @IsNotEmpty()
  colorLight!: string;

  @IsString()
  @IsNotEmpty()
  colorDark!: string;

  @IsString()
  @IsNotEmpty()
  obverseDescriptionFr!: string;

  @IsString()
  @IsNotEmpty()
  obverseDescriptionMg!: string;

  @IsString()
  @IsNotEmpty()
  reverseDescriptionFr!: string;

  @IsString()
  @IsNotEmpty()
  reverseDescriptionMg!: string;

  @IsString()
  @IsNotEmpty()
  symbolismFr!: string;

  @IsString()
  @IsNotEmpty()
  symbolismMg!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  securityFeaturesFr?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  imageUrlVerso?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

export class UpdateBanknoteDto {
  @IsInt()
  @IsOptional()
  valueAriary?: number;

  @IsInt()
  @IsOptional()
  valueFmg?: number;

  @IsString()
  @IsOptional()
  titleFr?: string;

  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsOptional()
  series?: string;

  @IsString()
  @IsOptional()
  seriesLabelFr?: string;

  @IsString()
  @IsOptional()
  seriesLabelMg?: string;

  @IsString()
  @IsOptional()
  period?: string;

  @IsString()
  @IsOptional()
  colorLight?: string;

  @IsString()
  @IsOptional()
  colorDark?: string;

  @IsString()
  @IsOptional()
  obverseDescriptionFr?: string;

  @IsString()
  @IsOptional()
  obverseDescriptionMg?: string;

  @IsString()
  @IsOptional()
  reverseDescriptionFr?: string;

  @IsString()
  @IsOptional()
  reverseDescriptionMg?: string;

  @IsString()
  @IsOptional()
  symbolismFr?: string;

  @IsString()
  @IsOptional()
  symbolismMg?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  securityFeaturesFr?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  imageUrlVerso?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

// ==========================================
// 4. PROVINCE BLASON DTO
// ==========================================
export class CreateProvinceBlasonDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  province!: string;

  @IsString()
  @IsNotEmpty()
  chefLieu!: string;

  @IsString()
  @IsNotEmpty()
  titleFr!: string;

  @IsString()
  @IsNotEmpty()
  titleMg!: string;

  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsString()
  @IsNotEmpty()
  bgLight!: string;

  @IsString()
  @IsNotEmpty()
  borderLight!: string;

  @IsString()
  @IsNotEmpty()
  descriptionFr!: string;

  @IsString()
  @IsNotEmpty()
  descriptionMg!: string;

  @IsOptional()
  symbols?: unknown;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keyFactsFr?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keyFactsMg?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

export class UpdateProvinceBlasonDto {
  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  chefLieu?: string;

  @IsString()
  @IsOptional()
  titleFr?: string;

  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  bgLight?: string;

  @IsString()
  @IsOptional()
  borderLight?: string;

  @IsString()
  @IsOptional()
  descriptionFr?: string;

  @IsString()
  @IsOptional()
  descriptionMg?: string;

  @IsOptional()
  symbols?: unknown;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keyFactsFr?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keyFactsMg?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

// ==========================================
// 5. NATURE EMBLEM DTO
// ==========================================
export class CreateNatureEmblemDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  nameFr!: string;

  @IsString()
  @IsNotEmpty()
  nameMg!: string;

  @IsString()
  @IsNotEmpty()
  scientificName!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  statusFr!: string;

  @IsString()
  @IsNotEmpty()
  statusMg!: string;

  @IsString()
  @IsNotEmpty()
  descriptionFr!: string;

  @IsString()
  @IsNotEmpty()
  descriptionMg!: string;

  @IsString()
  @IsNotEmpty()
  culturalRoleFr!: string;

  @IsString()
  @IsNotEmpty()
  culturalRoleMg!: string;

  @IsString()
  @IsOptional()
  proverbMg?: string;

  @IsString()
  @IsOptional()
  proverbFr?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

export class UpdateNatureEmblemDto {
  @IsString()
  @IsOptional()
  nameFr?: string;

  @IsString()
  @IsOptional()
  nameMg?: string;

  @IsString()
  @IsOptional()
  scientificName?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  statusFr?: string;

  @IsString()
  @IsOptional()
  statusMg?: string;

  @IsString()
  @IsOptional()
  descriptionFr?: string;

  @IsString()
  @IsOptional()
  descriptionMg?: string;

  @IsString()
  @IsOptional()
  culturalRoleFr?: string;

  @IsString()
  @IsOptional()
  culturalRoleMg?: string;

  @IsString()
  @IsOptional()
  proverbMg?: string;

  @IsString()
  @IsOptional()
  proverbFr?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

// ==========================================
// 6. HISTORY DATE DTO
// ==========================================
export class CreateHistoryDateDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  year!: string;

  @IsString()
  @IsNotEmpty()
  exactDate!: string;

  @IsString()
  @IsNotEmpty()
  titleFr!: string;

  @IsString()
  @IsNotEmpty()
  titleMg!: string;

  @IsString()
  @IsNotEmpty()
  era!: string;

  @IsString()
  @IsNotEmpty()
  summaryFr!: string;

  @IsString()
  @IsNotEmpty()
  summaryMg!: string;

  @IsString()
  @IsNotEmpty()
  impactFr!: string;

  @IsString()
  @IsNotEmpty()
  impactMg!: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

export class UpdateHistoryDateDto {
  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  exactDate?: string;

  @IsString()
  @IsOptional()
  titleFr?: string;

  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsOptional()
  era?: string;

  @IsString()
  @IsOptional()
  summaryFr?: string;

  @IsString()
  @IsOptional()
  summaryMg?: string;

  @IsString()
  @IsOptional()
  impactFr?: string;

  @IsString()
  @IsOptional()
  impactMg?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

// ==========================================
// 7. NATIONAL EMBLEM DTO (Emblèmes & Sceaux d'État)
// ==========================================
export class CreateNationalEmblemDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  period!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  government!: string;

  @IsString()
  @IsNotEmpty()
  descriptionFr!: string;

  @IsString()
  @IsOptional()
  descriptionMg?: string;

  @IsString()
  @IsOptional()
  notesFr?: string;

  @IsString()
  @IsOptional()
  notesMg?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

export class UpdateNationalEmblemDto {
  @IsString()
  @IsOptional()
  period?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  government?: string;

  @IsString()
  @IsOptional()
  descriptionFr?: string;

  @IsString()
  @IsOptional()
  descriptionMg?: string;

  @IsString()
  @IsOptional()
  notesFr?: string;

  @IsString()
  @IsOptional()
  notesMg?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

// ==========================================
// SIGNALEMENT DE CONTENU HISTORIQUE
// ==========================================
export class ReportHistoryDto {
  @IsString()
  @IsNotEmpty()
  entity!:
    | 'lesson'
    | 'president'
    | 'banknote'
    | 'province'
    | 'nature'
    | 'date'
    | 'emblem';

  @IsString()
  @IsNotEmpty()
  contentId!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string; // 'error' | 'translation' | 'typo' | 'outdated' | 'other'

  @IsString()
  @IsOptional()
  description?: string;
}
