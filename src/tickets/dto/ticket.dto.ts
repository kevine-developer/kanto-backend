import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ValidateTicketDto {
  @IsNotEmpty({ message: 'Token de validation obligatoire' })
  @IsString()
  secureToken: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  eventId?: string;
}

export class TicketAdminQueryDto {
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

export class AdminCancelTicketDto {
  @IsNotEmpty({ message: 'Le motif d’annulation est obligatoire' })
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  internalNotes?: string;
}

export class AdminRevokeTicketDto {
  @IsNotEmpty({ message: 'Le motif de révocation est obligatoire' })
  @IsString()
  reason: string;
}
