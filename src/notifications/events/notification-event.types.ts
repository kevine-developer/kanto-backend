/**
 * Types unifiés pour le système centralisé d'événements de notification et d'e-mails de Kanto MG.
 */

export type NotificationEventType =
  // VIP & Abonnements
  | 'USER_VIP_GRANTED'
  | 'USER_VIP_EXTENDED'
  | 'USER_VIP_EXPIRING_SOON'
  | 'USER_VIP_EXPIRED'
  | 'USER_VIP_REVOKED'
  // Sécurité & Statut du compte
  | 'USER_BANNED'
  | 'USER_UNBANNED'
  | 'SECURITY_PASSWORD_CHANGED'
  | 'SECURITY_PASSWORD_ADDED'
  | 'SECURITY_ACCOUNT_DELETED'
  // Modération des contributions
  | 'CONTRIBUTION_APPROVED'
  | 'CONTRIBUTION_REJECTED'
  | 'CONTRIBUTION_CHANGES_REQUESTED'
  // Activités sociales & Communauté
  | 'FRIEND_REQUEST_RECEIVED'
  | 'FRIEND_REQUEST_ACCEPTED';

export interface BaseEventPayload {
  recipientUserId: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}

export interface UserVipGrantedEvent extends BaseEventPayload {
  type: 'USER_VIP_GRANTED';
  durationDays?: number; // undefined ou null = accès permanent
  expiresAt?: Date | null;
  adminId?: string;
}

export interface UserVipExtendedEvent extends BaseEventPayload {
  type: 'USER_VIP_EXTENDED';
  addedDays: number;
  newExpiresAt: Date;
  adminId?: string;
}

export interface UserVipExpiringSoonEvent extends BaseEventPayload {
  type: 'USER_VIP_EXPIRING_SOON';
  expiresAt: Date;
  daysRemaining: number;
}

export interface UserVipExpiredEvent extends BaseEventPayload {
  type: 'USER_VIP_EXPIRED';
}

export interface UserVipRevokedEvent extends BaseEventPayload {
  type: 'USER_VIP_REVOKED';
  reason?: string;
  adminId?: string;
}

export interface UserBannedEvent extends BaseEventPayload {
  type: 'USER_BANNED';
  reason: string;
  banExpires?: Date | null;
  adminId?: string;
}

export interface UserUnbannedEvent extends BaseEventPayload {
  type: 'USER_UNBANNED';
  adminId?: string;
}

export interface SecurityPasswordChangedEvent extends BaseEventPayload {
  type: 'SECURITY_PASSWORD_CHANGED';
}

export interface SecurityPasswordAddedEvent extends BaseEventPayload {
  type: 'SECURITY_PASSWORD_ADDED';
}

export interface SecurityAccountDeletedEvent extends BaseEventPayload {
  type: 'SECURITY_ACCOUNT_DELETED';
}

export interface ContributionApprovedEvent extends BaseEventPayload {
  type: 'CONTRIBUTION_APPROVED';
  contributionId: string;
  contributionTitle: string;
  category: string;
  xpReward?: number;
}

export interface ContributionRejectedEvent extends BaseEventPayload {
  type: 'CONTRIBUTION_REJECTED';
  contributionId: string;
  contributionTitle: string;
  category: string;
  feedbackReason?: string;
}

export interface ContributionChangesRequestedEvent extends BaseEventPayload {
  type: 'CONTRIBUTION_CHANGES_REQUESTED';
  contributionId: string;
  contributionTitle: string;
  category: string;
  feedbackReason?: string;
}

export interface FriendRequestReceivedEvent extends BaseEventPayload {
  type: 'FRIEND_REQUEST_RECEIVED';
  senderUserId: string;
  senderName: string;
}

export interface FriendRequestAcceptedEvent extends BaseEventPayload {
  type: 'FRIEND_REQUEST_ACCEPTED';
  friendUserId: string;
  friendName: string;
}

export type NotificationEvent =
  | UserVipGrantedEvent
  | UserVipExtendedEvent
  | UserVipExpiringSoonEvent
  | UserVipExpiredEvent
  | UserVipRevokedEvent
  | UserBannedEvent
  | UserUnbannedEvent
  | SecurityPasswordChangedEvent
  | SecurityPasswordAddedEvent
  | SecurityAccountDeletedEvent
  | ContributionApprovedEvent
  | ContributionRejectedEvent
  | ContributionChangesRequestedEvent
  | FriendRequestReceivedEvent
  | FriendRequestAcceptedEvent;

export interface EventDispatchResult {
  success: boolean;
  inAppCreated?: boolean;
  emailSent?: boolean;
  pushSent?: boolean;
  skippedReason?: string;
}
