import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ApiKeyEnvironment } from '../../../generated/prisma/client.js';

export const PARTNER_API_SCOPES = [
  'events:read',
  'events:write',
  'events:delete',
  'registrations:read',
  'registrations:manage',
  'media:upload',
  'marketing:read',
  'marketing:write',
] as const;

export type PartnerApiScope = (typeof PARTNER_API_SCOPES)[number];

export class CreateApiKeyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsArray()
  @IsString({ each: true })
  scopes!: PartnerApiScope[];

  @IsEnum(ApiKeyEnvironment)
  @IsOptional()
  environment?: ApiKeyEnvironment;

  @IsInt()
  @Min(30)
  @Max(600)
  @IsOptional()
  rateLimit?: number;

  @IsOptional()
  expiresInDays?: number; // null = permanente ou durée en jours
}

export class RevokeApiKeyDto {
  @IsString()
  @IsOptional()
  reason?: string;
}

