export class CreateNotificationDto {
  titleMg!: string;
  titleFr?: string;
  messageMg!: string;
  messageFr?: string;
  category?: string; // 'culture' | 'game' | 'civic' | 'community' | 'system'
  badgeText?: string;
  badgeType?: string; // 'new' | 'streak' | 'reward' | 'civic' | 'info'
  iconName?: string;
  iconColor?: string;
  targetRoute?: string;
  isBroadcast?: boolean;
  userId?: string;
}

export class UpdateNotificationDto {
  titleMg?: string;
  titleFr?: string;
  messageMg?: string;
  messageFr?: string;
  category?: string;
  badgeText?: string;
  badgeType?: string;
  iconName?: string;
  iconColor?: string;
  targetRoute?: string;
  isRead?: boolean;
}
