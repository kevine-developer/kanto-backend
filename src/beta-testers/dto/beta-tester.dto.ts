import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TesterStatus } from '../../../generated/prisma/client.js';

export class RegisterBetaTesterDto {
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty({ message: "L'adresse email est requise" })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Le nom est trop long (max 100 caractères)' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: "Le modèle d'appareil est trop long" })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  deviceModel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'La version Android est trop longue' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  androidVersion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Remarque trop longue (max 1000 caractères)' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  notes?: string;

  /**
   * Champ piège anti-spam (Honeypot) : doit rester vide.
   */
  @IsOptional()
  @IsString()
  website?: string;
}

export class UpdateTesterStatusDto {
  @IsEnum(TesterStatus, {
    message: 'Statut invalide (PENDING, APPROVED, INVITED, REJECTED)',
  })
  status: TesterStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SendPlayInviteDto {
  @IsOptional()
  @IsString()
  playStoreWebLink?: string;

  @IsOptional()
  @IsString()
  playStoreAppLink?: string;
}

export class BulkInviteDto {
  @IsOptional()
  testerIds?: string[];

  @IsOptional()
  @IsString()
  playStoreWebLink?: string;

  @IsOptional()
  @IsString()
  playStoreAppLink?: string;
}

export class VerifyBetaTesterDto {
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty({ message: "L'adresse email est requise" })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;
}

