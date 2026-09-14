import { BadgeCategory } from '../badges.constants.js';

export interface UserBadgeProgressDto {
  id: string;
  titleMg: string;
  titleFr: string;
  descriptionMg: string;
  descriptionFr: string;
  category: BadgeCategory;
  iconKey: string;
  color: string;
  targetValue: number;
  currentValue: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  progressPercent: number;
  xpReward: number;
}

export interface CheckBadgesResultDto {
  newlyUnlocked: UserBadgeProgressDto[];
  totalUnlockedCount: number;
  earnedBonusXp: number;
}
