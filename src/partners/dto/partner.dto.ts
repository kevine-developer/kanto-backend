import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  PartnerType,
  PartnerStatus,
} from '../../../generated/prisma/client.js';

export class RegisterPartnerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEnum(PartnerType)
  type!: PartnerType;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  socialLinks?: Record<string, string>;

  // Optionnel : mot de passe pour création automatique d'un compte utilisateur si l'utilisateur n'en possède pas
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;
}

export class UpdatePartnerProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsEnum(PartnerType)
  @IsOptional()
  type?: PartnerType;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsUrl()
  @IsOptional()
  coverUrl?: string;

  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  socialLinks?: Record<string, string>;
}

export class VerifyPartnerDto {
  @IsEnum(PartnerStatus)
  status!: PartnerStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
