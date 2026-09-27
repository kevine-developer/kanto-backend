import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ResolveDisputeDto {
  @IsBoolean({
    message:
      'Approve doit être un booléen (true pour accepter la contestation, false pour la rejeter)',
  })
  @IsNotEmpty()
  approve: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
