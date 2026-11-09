export enum PlayerPresenceStatus {
  ONLINE = 'ONLINE',
  AWAY = 'AWAY',
  OFFLINE = 'OFFLINE',
  IN_GAME = 'IN_GAME',
  BUSY = 'BUSY',
}

export type PlayerUnavailabilityReason =
  | 'OFFLINE'
  | 'AWAY'
  | 'IN_GAME'
  | 'BUSY_PENDING_INVITE'
  | 'BLOCKED'
  | 'NOT_FOUND'
  | 'BANNED';

export interface UserDuelAvailability {
  targetUserId: string;
  status: PlayerPresenceStatus;
  isAvailableForDuel: boolean;
  reason?: PlayerUnavailabilityReason;
  messageFr: string;
  messageMg: string;
}

export interface PresenceHeartbeatPayload {
  appState?: 'active' | 'background' | 'inactive';
}

