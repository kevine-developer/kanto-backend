/**
 * Canaux Redis Pub/Sub partagés.
 */
export const REALTIME_CHANNELS = {
  NOTIFICATIONS: 'kanto:events:notifications',
  COMMENTS: 'kanto:events:comments',
  LEADERBOARD: 'kanto:events:leaderboard',
} as const;

/**
 * Événements WebSocket échangés entre le client et le serveur.
 */
export const SOCKET_EVENTS = {
  // Événements émis vers le client
  NOTIFICATION_NEW: 'notification:new',
  COMMENT_NEW: 'comment:new',
  COMMENT_UPDATED: 'comment:updated',
  COMMENT_DELETED: 'comment:deleted',
  LEADERBOARD_UPDATED: 'leaderboard:updated',

  // Événements reçus du client
  AUTHENTICATE: 'authenticate',
  JOIN_CONTRIBUTION: 'join:contribution',
  LEAVE_CONTRIBUTION: 'leave:contribution',
  JOIN_LEADERBOARD: 'join:leaderboard',
  LEAVE_LEADERBOARD: 'leave:leaderboard',

  // Événements Duel / Multijoueur Kahoot
  DUEL_CREATE: 'duel:create',
  DUEL_JOIN: 'duel:join',
  DUEL_STATE: 'duel:state',
  DUEL_START: 'duel:start',
  DUEL_START_GAME: 'duel:start_game',
  DUEL_ANSWER: 'duel:answer',
  DUEL_OPPONENT_UPDATE: 'duel:opponent_update',
  DUEL_FINISH: 'duel:finish',
  DUEL_LEAVE: 'duel:leave',
  DUEL_ROOM_UPDATE: 'duel:room_update',
  DUEL_ROUND_START: 'duel:round_start',
  DUEL_PLAYER_ANSWERED: 'duel:player_answered',
  DUEL_ROUND_END: 'duel:round_end',
  DUEL_GAME_FINISH: 'duel:game_finish',
  DUEL_SESSION_CANCELLED: 'duel:session_cancelled',
  DUEL_TOGGLE_SPECTATOR: 'duel:toggle_spectator',
  DUEL_HOST_DETAILS: 'duel:host_details',
  DUEL_KICK_PLAYER: 'duel:kick_player',
  DUEL_PLAYER_KICKED: 'duel:player_kicked',
  DUEL_CHALLENGE_RECEIVED: 'duel:challenge_received',
  DUEL_CHALLENGE_DECLINE: 'duel:challenge_decline',
  DUEL_CHALLENGE_DECLINED: 'duel:challenge_declined',
} as const;

/**
 * Constructeurs normalisés de noms de rooms (évite les fautes de frappe et standardise le formatage).
 */
export const RealtimeRooms = {
  user: (userId: string) => `user:${userId}`,
  contribution: (contributionId: string) => `contribution:${contributionId}`,
  leaderboard: () => 'leaderboard:live',
  duel: (code: string) => `duel:${code.toUpperCase()}`,
} as const;

/**
 * Contrats de données (Payloads) pour les événements Redis et WebSocket.
 */
export interface NotificationRealtimePayload {
  notification: {
    id: string;
    category: string;
    title: string;
    titleMg?: string;
    description: string;
    descriptionMg?: string;
    timeAgo?: string;
    timestamp: number;
    iconName?: string;
    iconColor?: string;
    badgeText?: string;
    badgeType?: string;
    read: boolean;
    targetRoute?: string;
    createdAt?: string | Date;
    [key: string]: unknown;
  };
  targetUserId?: string | null;
  isBroadcast?: boolean;
}

export interface CommentRealtimePayload {
  action: 'create' | 'update' | 'delete';
  contributionId: string;
  comment?: {
    id: string;
    content: string;
    contributionId: string;
    userId: string;
    createdAt: string | Date;
    updatedAt?: string | Date;
    isOwner?: boolean;
    user?: {
      id: string;
      name?: string;
      image?: string;
      role?: string;
    };
    [key: string]: unknown;
  };
  commentId?: string;
}

export interface LeaderboardRealtimePayload {
  userId: string;
  totalXp: number;
  level: number;
  streakDays?: number;
  name?: string;
  image?: string | null;
  xpDelta?: number;
  source?: string;
  timestamp?: number;
}
