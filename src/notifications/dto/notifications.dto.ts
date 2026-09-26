import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  titleMg!: string;

  @IsString()
  @IsOptional()
  titleFr?: string;

  @IsString()
  @IsNotEmpty()
  messageMg!: string;

  @IsString()
  @IsOptional()
  messageFr?: string;

  @IsString()
  @IsOptional()
  category?: string; // 'culture' | 'game' | 'civic' | 'community' | 'system'

  @IsString()
  @IsOptional()
  badgeText?: string;

  @IsString()
  @IsOptional()
  badgeType?: string; // 'new' | 'streak' | 'reward' | 'civic' | 'info'

  @IsString()
  @IsOptional()
  iconName?: string;

  @IsString()
  @IsOptional()
  iconColor?: string;

  @IsString()
  @IsOptional()
  targetRoute?: string;

  @IsBoolean()
  @IsOptional()
  isBroadcast?: boolean;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class UpdateNotificationDto {
  @IsString()
  @IsOptional()
  titleMg?: string;

  @IsString()
  @IsOptional()
  titleFr?: string;

  @IsString()
  @IsOptional()
  messageMg?: string;

  @IsString()
  @IsOptional()
  messageFr?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  badgeText?: string;

  @IsString()
  @IsOptional()
  badgeType?: string;

  @IsString()
  @IsOptional()
  iconName?: string;

  @IsString()
  @IsOptional()
  iconColor?: string;

  @IsString()
  @IsOptional()
  targetRoute?: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}
