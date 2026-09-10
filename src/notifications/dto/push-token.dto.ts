import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterPushTokenDto {
  @IsString()
  @IsNotEmpty()
  pushToken!: string;

  @IsString()
  @IsOptional()
  userId?: string;
}
