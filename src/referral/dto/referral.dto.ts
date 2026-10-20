import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class ClaimReferralDto {
  @IsNotEmpty({ message: 'Le code de parrainage est obligatoire' })
  @IsString({ message: 'Le code doit être une chaîne de caractères' })
  @Matches(/^[A-Za-z0-9_-]{3,20}$/, {
    message: 'Format de code de parrainage invalide',
  })
  code: string;
}

export class UpdateReferralConfigDto {
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  referrerXp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5000)
  referrerCoins?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  refereeXp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5000)
  refereeCoins?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  maxRewardsPerReferrer?: number;

  @IsOptional()
  @IsBoolean()
  requireFirstActivity?: boolean;

  @IsOptional()
  @IsString()
  welcomeMessageMg?: string;

  @IsOptional()
  @IsString()
  welcomeMessageFr?: string;
}

export class AdminReferralQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
