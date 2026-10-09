import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { auth } from '../auth/auth.js';
import { DuelService } from '../games/duel/duel.service.js';
import { DuelGameTypeEnum } from '../games/duel/dto/duel.dto.js';
import {
  REALTIME_CHANNELS,
  SOCKET_EVENTS,
  RealtimeRooms,
  NotificationRealtimePayload,
  CommentRealtimePayload,
  LeaderboardRealtimePayload,
} from './realtime.constants.js';

// Rétro-compatibilité pour les imports existants
export const REDIS_CHANNEL_NOTIFICATIONS = REALTIME_CHANNELS.NOTIFICATIONS;
export const REDIS_CHANNEL_COMMENTS = REALTIME_CHANNELS.COMMENTS;
export type NotificationEventPayload = NotificationRealtimePayload;
export type CommentEventPayload = CommentRealtimePayload;

export interface DuelCreateSocketPayload {
  userId?: string;
  gameType?: DuelGameTypeEnum;
  totalQuestions?: number;
  timePerQuestion?: number;
  userName?: string;
  userAvatar?: string;
  opponentId?: string;
}

export interface DuelJoinSocketPayload {
  code: string;
  userName?: string;
  userAvatar?: string;
  userId?: string;
}

export interface DuelAnswerSocketPayload {
  code: string;
  questionId: string;
  questionIndex: number;
  userAnswer: string;
  timeTakenMs?: number;
  userId?: string;
}

export interface DuelLeaveSocketPayload {
  code: string;
  userId?: string;
}

export interface DuelKickSocketPayload {
  code: string;
  targetUserId: string;
  hostUserId?: string;
}

/**
 * Expression régulière stricte pour valider les identifiants et prévenir les injections de rooms.
 */
const SAFE_ID_REGEX = /^[a-zA-Z0-9_\-:]{1,64}$/;

/**
 * Limite maximale de rooms de contribution par socket pour prévenir le flood mémoire.
 */
const MAX_ROOMS_PER_SOCKET = 50;

@WebSocketGateway({
  cors: {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Autoriser les requêtes sans origine (apps mobiles natives, curl, Expo Go)
      if (!origin) {
        callback(null, true);
        return;
      }

      const isProduction = process.env.NODE_ENV === 'production';
      const rawOrigins = process.env.CORS_ORIGINS;

      if (!rawOrigins) {
        if (!isProduction) {
          callback(null, true);
          return;
        }
        // En production sans variable CORS_ORIGINS explicite, autoriser les domaines de production
        const defaultProd = [
          'https://admin.kanto.mg',
          'https://app.kanto.mg',
          'https://kanto.mg',
          'https://api-kanto.gastsar.fr',
          'https://auth-kanto.gastsar.fr',
        ];
        const isDefaultAllowed =
          defaultProd.includes(origin) ||
          origin.endsWith('.gastsar.fr') ||
          origin.endsWith('.kanto.mg') ||
          origin === 'https://kanto-admin.vercel.app';
        callback(null, isDefaultAllowed);
        return;
      }

      const allowedList = rawOrigins.split(',').map((o) => o.trim());
      const isAllowed =
        allowedList.includes(origin) ||
        origin.endsWith('.gastsar.fr') ||
        (!isProduction && origin.startsWith('http://localhost'));
      callback(null, isAllowed);
    },
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
@Injectable()
export class RealtimeGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private unsubscribeNotifs: (() => void) | null = null;
  private unsubscribeComments: (() => void) | null = null;
  private unsubscribeLeaderboard: (() => void) | null = null;
  private readonly disconnectTimers = new Map<string, NodeJS.Timeout>();
  private readonly reactionRateLimits = new Map<string, number>();

  constructor(
    private readonly redisService: RedisService,
    private readonly duelService: DuelService,
    private readonly prisma: PrismaService,
  ) {}

  afterInit() {
    this.logger.log('🚀 [RealtimeGateway] Serveur WebSocket initialisé.');
  }

  async onModuleInit() {
    // Souscription sécurisée aux canaux Redis Pub/Sub avec gestion d'erreurs
    try {
      this.unsubscribeNotifs = await this.redisService.subscribe(
        REALTIME_CHANNELS.NOTIFICATIONS,
        (payload: NotificationRealtimePayload) => {
          this.handleRedisNotification(payload);
        },
      );

      this.unsubscribeComments = await this.redisService.subscribe(
        REALTIME_CHANNELS.COMMENTS,
        (payload: CommentRealtimePayload) => {
          this.handleRedisComment(payload);
        },
      );

      this.unsubscribeLeaderboard = await this.redisService.subscribe(
        REALTIME_CHANNELS.LEADERBOARD,
        (payload: LeaderboardRealtimePayload) => {
          this.handleRedisLeaderboard(payload);
        },
      );

      this.logger.log(
        '📡 [RealtimeGateway] Écoute active sur les canaux Redis Pub/Sub.',
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `❌ [RealtimeGateway] Erreur initialisation souscriptions Redis : ${msg}`,
      );
    }
  }

  onModuleDestroy() {
    this.unsubscribeNotifs?.();
    this.unsubscribeComments?.();
    this.unsubscribeLeaderboard?.();
    this.disconnectTimers.forEach((timer) => clearTimeout(timer));
    this.disconnectTimers.clear();
    this.reactionRateLimits.clear();
  }

  /**
   * Gestion sécurisée de la connexion d'un client.
   * Valide la session Better-Auth si disponible, ou assainit le userId passé en handshake.
   */
  async handleConnection(client: Socket) {
    try {
      const authenticatedUserId = await this.extractAuthenticatedUserId(client);

      if (authenticatedUserId) {
        const room = RealtimeRooms.user(authenticatedUserId);
        await client.join(room);
        (client.data as Record<string, unknown>).userId = authenticatedUserId;
        this.logger.log(
          `🔌 [Realtime] Client connecté et authentifié : ${client.id} (room: ${room})`,
        );
      } else {
        this.logger.log(
          `🔌 [Realtime] Client connecté (invité / anonyme) : ${client.id}`,
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `⚠️ [Realtime] Erreur handshake client ${client.id} : ${msg}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 [Realtime] Client déconnecté : ${client.id}`);
    const duelCode = (client.data as Record<string, unknown>)?.duelCode as
      string | undefined;
    const userId = (client.data as Record<string, unknown>)?.userId as
      string | undefined;

    if (duelCode && userId) {
      const room = RealtimeRooms.duel(duelCode);
      const timerKey = `${duelCode.toUpperCase()}:${userId}`;

      // Nettoyer tout timer existant pour cette clé
      const existing = this.disconnectTimers.get(timerKey);
      if (existing) {
        clearTimeout(existing);
        this.disconnectTimers.delete(timerKey);
      }

      // Notifier immédiatement la salle du salon de la déconnexion avec période de grâce de 8s
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_PLAYER_DISCONNECTED, {
        userId,
        code: duelCode,
        gracePeriodSec: 8,
      });

      this.logger.log(
        `⏳ [Realtime] Déconnexion socket pour ${userId} sur salon ${duelCode}. Période de grâce de 8s accordée...`,
      );

      const timer = setTimeout(() => {
        void (async () => {
          this.disconnectTimers.delete(timerKey);
          try {
            const result = await this.duelService.handlePlayerLeave(
              userId,
              duelCode,
            );
            if (result?.sessionCancelled) {
              this.server.to(room).emit(SOCKET_EVENTS.DUEL_SESSION_CANCELLED, {
                code: duelCode,
                reason: 'HOST_DISCONNECTED',
                messageMg:
                  "Nandao ny efitrano ny tompon'ny lalao. Natsahatra ny salon.",
                messageFr: "L'hôte a quitté le salon. La partie a été fermée.",
              });
              // Libère immédiatement tous les sockets abonnés pour éviter les rooms orphelines et fuites mémoire
              this.server.in(room).socketsLeave(room);
              this.logger.log(
                `📢 [DuelGateway] Déconnexion hôte confirmée après grâce -> Clôture automatique de la room ${room}`,
              );
            } else if (result?.forfeitVictory) {
              this.server.to(room).emit(SOCKET_EVENTS.DUEL_GAME_FINISH, {
                finalLeaderboard: result.finalLeaderboard,
                winnerId: result.winnerId,
                forfeit: true,
                winnerName: result.winnerName,
                forfeiterName: result.forfeiterName,
                messageFr: `${result.forfeiterName} a quitté la partie. Victoire par forfait !`,
                messageMg: `Nandao ny lalao i ${result.forfeiterName}. Azonao ny fandresena !`,
              });
              this.logger.log(
                `🏆 [DuelGateway] Victoire par forfait suite déconnexion confirmée sur ${room}`,
              );
            } else if (result?.remainingPlayers) {
              this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROOM_UPDATE, {
                session: result.session,
                players: result.remainingPlayers,
              });
              if (result.themeChooserChanged) {
                this.server
                  .to(room)
                  .emit(SOCKET_EVENTS.DUEL_THEME_CHOOSER_CHANGED, {
                    themeChooserId: result.newThemeChooserId,
                  });
              }
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logger.warn(
              `Erreur lors du nettoyage différé de déconnexion duel pour ${client.id} : ${msg}`,
            );
          }
        })();
      }, 8000);

      this.disconnectTimers.set(timerKey, timer);
    }
  }

  /**
   * Authentifie ou ré-associe dynamiquement un socket à un utilisateur avec validation.
   */
  @SubscribeMessage(SOCKET_EVENTS.AUTHENTICATE)
  async handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { token?: string; cookie?: string; userId?: string },
  ) {
    let sessionUserId = await this.extractAuthenticatedUserId(client);

    // 1. Tenter la validation de session Better-Auth si un token ou cookie est fourni
    if (!sessionUserId && (data?.token || data?.cookie)) {
      try {
        const headers = new Headers();
        if (data.token && typeof data.token === 'string' && data.token.trim()) {
          headers.set('authorization', `Bearer ${data.token.trim()}`);
        }
        if (
          data.cookie &&
          typeof data.cookie === 'string' &&
          data.cookie.trim()
        ) {
          headers.set('cookie', data.cookie.trim());
        }
        const session = await auth.api.getSession({ headers });
        if (session?.user?.id) {
          sessionUserId = session.user.id;
        }
      } catch {
        // Session non résolue via Better-Auth getSession
      }
    }

    // 2. Fallback direct en base de données sur la table Session
    if (
      !sessionUserId &&
      data?.token &&
      typeof data.token === 'string' &&
      data.token.trim()
    ) {
      try {
        const dbSession = await this.prisma.session.findUnique({
          where: { token: data.token.trim() },
          select: { userId: true, expiresAt: true },
        });
        if (dbSession && dbSession.expiresAt > new Date()) {
          sessionUserId = dbSession.userId;
        }
      } catch {
        // Erreur de recherche en base ignorée
      }
    }

    if (!sessionUserId) {
      if (data?.token || data?.cookie) {
        this.logger.log(
          `ℹ️ [Realtime] Session non reconnue ou expirée pour le socket ${client.id}.`,
        );
      }
      return {
        success: false,
        message: 'Authentification requise : session manquante ou invalide',
      };
    }

    const room = RealtimeRooms.user(sessionUserId);
    await client.join(room);
    (client.data as Record<string, unknown>).userId = sessionUserId;
    this.logger.log(
      `🔑 [Realtime] Socket ${client.id} authentifié et rattaché à ${room}`,
    );
    return { success: true, room, userId: sessionUserId };
  }

  /**
   * Rejoint le canal temps réel d'une contribution précise (avec validation et protection anti-flood).
   */
  @SubscribeMessage(SOCKET_EVENTS.JOIN_CONTRIBUTION)
  handleJoinContribution(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { contributionId?: string },
  ) {
    const contributionId = this.sanitizeId(data?.contributionId);
    if (!contributionId) {
      return { success: false, message: 'contributionId invalide' };
    }

    // Protection anti-flood : limite du nombre de rooms par socket
    if (client.rooms.size > MAX_ROOMS_PER_SOCKET) {
      return { success: false, message: 'Limite de souscriptions atteinte' };
    }

    const room = RealtimeRooms.contribution(contributionId);
    void client.join(room);
    return { success: true, room };
  }

  /**
   * Quitte le canal temps réel d'une contribution.
   */
  @SubscribeMessage(SOCKET_EVENTS.LEAVE_CONTRIBUTION)
  handleLeaveContribution(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { contributionId?: string },
  ) {
    const contributionId = this.sanitizeId(data?.contributionId);
    if (!contributionId) {
      return { success: false };
    }

    const room = RealtimeRooms.contribution(contributionId);
    void client.leave(room);
    return { success: true };
  }

  /**
   * Rejoint le flux en direct du classement des joueurs.
   */
  @SubscribeMessage(SOCKET_EVENTS.JOIN_LEADERBOARD)
  handleJoinLeaderboard(@ConnectedSocket() client: Socket) {
    const room = RealtimeRooms.leaderboard();
    void client.join(room);
    this.logger.debug?.(`🏆 [Realtime] Socket ${client.id} a rejoint ${room}`);
    return { success: true, room };
  }

  /**
   * Quitte le flux en direct du classement.
   */
  @SubscribeMessage(SOCKET_EVENTS.LEAVE_LEADERBOARD)
  handleLeaveLeaderboard(@ConnectedSocket() client: Socket) {
    const room = RealtimeRooms.leaderboard();
    void client.leave(room);
    return { success: true };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Handlers Mode Duel 1v1 (Temps Réel)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Helper pour extraire de manière sécurisée l'identifiant utilisateur attaché au socket.
   */
  private getClientUserId(client: Socket, _legacyFallback?: string): string {
    void _legacyFallback;
    const clientData = client.data as Record<string, unknown>;
    if (
      typeof clientData?.userId === 'string' &&
      clientData.userId &&
      !clientData.userId.startsWith('guest_')
    ) {
      return clientData.userId;
    }
    return `guest_${client.id.slice(0, 6)}`;
  }

  /**
   * Création d'une nouvelle session de duel et adhésion à sa room dédiée.
   */
  /**
   * Création d'un nouveau salon multijoueur et adhésion à sa room dédiée.
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_CREATE)
  async handleDuelCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DuelCreateSocketPayload,
  ) {
    try {
      const userId = this.getClientUserId(client, data?.userId);
      if (!userId || userId.startsWith('guest_')) {
        return {
          success: false,
          message:
            'Seuls les utilisateurs connectés peuvent créer un salon multijoueur.',
        };
      }
      const result = await this.duelService.createDuel(userId, data || {});

      const room = RealtimeRooms.duel(result.session.code);
      await client.join(room);
      (client.data as Record<string, unknown>).duelCode = result.session.code;

      // Si un adversaire spécifique est défié, lui envoyer instantanément l'invitation en temps réel
      if (data?.opponentId && data.opponentId !== userId) {
        const opponentRoom = RealtimeRooms.user(data.opponentId);
        this.server
          .to(opponentRoom)
          .emit(SOCKET_EVENTS.DUEL_CHALLENGE_RECEIVED, {
            code: result.session.code,
            gameType: result.session.gameType,
            challengerId: userId,
            challengerName: result.session.player1Name,
            challengerAvatar: result.session.player1Avatar,
            totalQuestions: result.session.totalQuestions,
            timePerQuestion: result.session.timePerQuestion,
            theme: result.session.theme,
            themeChooserId: result.session.themeChooserId,
            createdAt: Date.now(),
          });
        this.logger.log(
          `⚔️ [DuelGateway] Invitation duel direct émise vers ${opponentRoom} pour le salon ${result.session.code}`,
        );
      }

      this.logger.log(
        `🎮 [DuelGateway] Salon multijoueur ${room} créé par ${userId} (Hôte)`,
      );
      return {
        success: true,
        session: result.session,
        questions: result.questions,
        players: result.players,
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Erreur lors de la création du salon';
      this.logger.error(`Erreur création salon : ${msg}`);
      return {
        success: false,
        message: msg,
      };
    }
  }

  /**
   * Refus d'un défi direct par l'adversaire invité : informe le salon et l'hôte.
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_CHALLENGE_DECLINE)
  async handleDuelChallengeDecline(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { code: string; opponentId?: string; opponentName?: string },
  ) {
    try {
      if (!data?.code) {
        return { success: false, message: 'Le code du salon est requis' };
      }

      const userId = this.getClientUserId(client, data?.opponentId);
      const result = await this.duelService.declineDuelChallenge(
        data.code,
        userId,
        data?.opponentName,
      );

      const room = RealtimeRooms.duel(result.code);
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_CHALLENGE_DECLINED, {
        code: result.code,
        opponentId: userId,
        opponentName: result.declinerName,
        messageMg: `Nandà ny fanamby i ${result.declinerName}.`,
        messageFr: `${result.declinerName} a décliné le défi.`,
      });

      this.logger.log(
        `⚔️ [DuelGateway] Défi décliné par ${result.declinerName} pour le salon ${room}`,
      );

      return { success: true };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erreur lors du refus du défi';
      this.logger.warn(`Erreur refus défi : ${msg}`);
      return { success: false, message: msg };
    }
  }

  /**
   * Rejoindre un salon multijoueur avec un code (Max 10 participants).
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_JOIN)
  async handleDuelJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DuelJoinSocketPayload,
  ) {
    try {
      if (!data?.code) {
        return { success: false, message: 'Le code du salon est requis' };
      }

      const userId = this.getClientUserId(client, data?.userId);
      if (!userId || userId.startsWith('guest_')) {
        return {
          success: false,
          message:
            'Seuls les utilisateurs connectés peuvent rejoindre un salon multijoueur.',
        };
      }
      const result = await this.duelService.joinDuel(userId, data);

      const room = RealtimeRooms.duel(result.session.code);
      await client.join(room);
      (client.data as Record<string, unknown>).duelCode = result.session.code;

      // Annuler toute grâce de déconnexion en attente pour cet utilisateur sur ce salon
      const timerKey = `${result.session.code.toUpperCase()}:${userId}`;
      const pendingTimer = this.disconnectTimers.get(timerKey);
      if (pendingTimer) {
        clearTimeout(pendingTimer);
        this.disconnectTimers.delete(timerKey);
        this.server.to(room).emit(SOCKET_EVENTS.DUEL_PLAYER_RECONNECTED, {
          code: result.session.code,
          userId,
        });
        this.logger.log(
          `♻️ [DuelGateway] Joueur ${userId} reconnecté sur ${room}. Timer de grâce annulé.`,
        );
      }

      // Diffuser à tous les participants connectés la mise à jour de la liste
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROOM_UPDATE, {
        session: result.session,
        players: result.players,
      });

      this.logger.log(
        `👥 [DuelGateway] Joueur ${userId} a rejoint ${room} (${result.players.length}/10)`,
      );
      return {
        success: true,
        session: result.session,
        questions: result.questions,
        players: result.players,
        isHost: result.isHost,
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Impossible de rejoindre ce salon';
      this.logger.warn(`Erreur adhésion salon : ${msg}`);
      return {
        success: false,
        message: msg,
      };
    }
  }

  /**
   * Reconnexion d'un joueur en cours de match pour annuler le forfait de déconnexion.
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_RECONNECT)
  async handleDuelReconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { code: string; userId?: string },
  ) {
    try {
      if (!data?.code) return { success: false, message: 'Code requis' };
      const userId = this.getClientUserId(client, data?.userId);
      const cleanCode = data.code.trim().toUpperCase();
      const timerKey = `${cleanCode}:${userId}`;

      const pendingTimer = this.disconnectTimers.get(timerKey);
      if (pendingTimer) {
        clearTimeout(pendingTimer);
        this.disconnectTimers.delete(timerKey);
        this.logger.log(
          `♻️ [DuelGateway] Reconnexion explicite pour ${userId} sur ${cleanCode}. Période de grâce stoppée.`,
        );
      }

      const room = RealtimeRooms.duel(cleanCode);
      await client.join(room);
      (client.data as Record<string, unknown>).duelCode = cleanCode;

      this.server.to(room).emit(SOCKET_EVENTS.DUEL_PLAYER_RECONNECTED, {
        code: cleanCode,
        userId,
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  /**
   * Réactions en direct Fihavanana (🔥, ⚡, 🇲🇬, 👏, 🎯) avec limitation de débit (anti-flood).
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_REACTION)
  handleDuelReaction(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      code: string;
      emoji: string;
      userId?: string;
      userName?: string;
    },
  ) {
    try {
      if (!data?.code || !data?.emoji) {
        return { success: false, message: 'Code et emoji requis' };
      }

      const userId = this.getClientUserId(client, data?.userId);
      const now = Date.now();
      const lastReaction = this.reactionRateLimits.get(userId) || 0;

      // Anti-flood : max 1 réaction toutes les 1000ms
      if (now - lastReaction < 1000) {
        return { success: false, message: 'Rate limited' };
      }
      this.reactionRateLimits.set(userId, now);

      const allowedEmojis = ['🔥', '⚡', '🇲🇬', '👏', '🎯'];
      const emoji = allowedEmojis.includes(data.emoji) ? data.emoji : '🔥';
      const cleanCode = data.code.trim().toUpperCase();
      const room = RealtimeRooms.duel(cleanCode);

      this.server.to(room).emit(SOCKET_EVENTS.DUEL_REACTION_RECEIVED, {
        id: `${userId}_${now}_${Math.random().toString(36).slice(2, 7)}`,
        userId,
        userName: data.userName || 'Mpilalao',
        emoji,
        timestamp: now,
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  /**
   * Changement de thème de jeu en direct dans le lobby / salon d'attente.
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_CHANGE_THEME)
  async handleDuelChangeTheme(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { code: string; theme: string; userId?: string },
  ) {
    try {
      if (!data?.code || !data?.theme) {
        return { success: false, message: 'Code et thème requis' };
      }
      const userId = this.getClientUserId(client, data?.userId);
      const result = await this.duelService.changeTheme(
        data.code,
        userId,
        data.theme,
      );

      const room = RealtimeRooms.duel(result.session.code);
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROOM_UPDATE, {
        session: result.session,
        players: result.players,
      });

      this.server.to(room).emit(SOCKET_EVENTS.DUEL_THEME_CHANGED, {
        code: result.session.code,
        theme: result.session.theme,
        themeChooserId: result.session.themeChooserId,
        questions: result.questions,
      });

      this.logger.log(
        `🎨 [DuelGateway] Thème mis à jour sur ${room} -> ${result.session.theme}`,
      );

      return {
        success: true,
        session: result.session,
        questions: result.questions,
        players: result.players,
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erreur modification thème';
      this.logger.warn(`Erreur modification thème : ${msg}`);
      return { success: false, message: msg };
    }
  }

  /**
   * Délégation du choix de thème à l'adversaire ou à un autre joueur.
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_DELEGATE_THEME)
  async handleDuelDelegateTheme(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { code: string; targetUserId?: string; userId?: string },
  ) {
    try {
      if (!data?.code) {
        return { success: false, message: 'Code de salon requis' };
      }
      const userId = this.getClientUserId(client, data?.userId);
      const result = await this.duelService.delegateThemeChoice(
        data.code,
        userId,
        data.targetUserId,
      );

      const room = RealtimeRooms.duel(result.session.code);
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROOM_UPDATE, {
        session: result.session,
        players: result.players,
      });

      this.server.to(room).emit(SOCKET_EVENTS.DUEL_THEME_CHOOSER_CHANGED, {
        code: result.session.code,
        themeChooserId: result.newChooserId,
        themeChooserName: result.newChooserName,
      });

      this.logger.log(
        `🤝 [DuelGateway] Choix de thème transféré sur ${room} à ${result.newChooserName} (${result.newChooserId})`,
      );

      return {
        success: true,
        session: result.session,
        questions: result.questions,
        players: result.players,
        newChooserId: result.newChooserId,
        newChooserName: result.newChooserName,
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erreur délégation thème';
      this.logger.warn(`Erreur délégation thème : ${msg}`);
      return { success: false, message: msg };
    }
  }

  /**
   * Lancement de la partie par l'Hôte (Modèle Kahoot).
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_START_GAME)
  async handleDuelStartGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { code: string; userId?: string },
  ) {
    try {
      if (!data?.code) {
        return { success: false, message: 'Code de salon requis' };
      }

      const userId = this.getClientUserId(client, data?.userId);
      if (!userId || userId.startsWith('guest_')) {
        return {
          success: false,
          message: 'Seuls les utilisateurs connectés peuvent lancer la partie.',
        };
      }
      const result = await this.duelService.startDuel(userId, {
        code: data.code,
      });

      const room = RealtimeRooms.duel(data.code);

      // Diffuser le décompte synchronisé 3-2-1 à tous les participants
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_START_COUNTDOWN, {
        countdownSec: 3,
        session: result.session,
        totalQuestions: result.totalQuestions,
      });

      this.logger.log(
        `⏳ [DuelGateway] Compte à rebours 3-2-1 lancé sur ${room}...`,
      );

      // Diffuser la première question synchronisée après 3 secondes
      setTimeout(() => {
        void (async () => {
          try {
            this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROUND_START, {
              session: result.session,
              currentQuestion: result.currentQuestion,
              currentQuestionIndex: result.currentQuestionIndex,
              totalQuestions: result.totalQuestions,
              roundTimeLimit: result.roundTimeLimit,
            });

            this.logger.log(
              `🚀 [DuelGateway] Début de la question 1 sur ${room} !`,
            );

            // Si l'hôte est en mode régie animateur / spectateur, lui transmettre la réponse secrète
            const hostIsSpectator = await this.duelService.isHostSpectator(
              data.code,
            );
            if (hostIsSpectator) {
              const hostDetails = await this.duelService.getHostQuestionDetails(
                data.code,
                result.currentQuestionIndex,
              );
              if (hostDetails) {
                client.emit(SOCKET_EVENTS.DUEL_HOST_DETAILS, {
                  questionIndex: result.currentQuestionIndex,
                  ...hostDetails,
                });
              }
            }
          } catch (timerErr: unknown) {
            const timerErrMsg =
              timerErr instanceof Error ? timerErr.message : String(timerErr);
            this.logger.error(
              `Erreur round start post-countdown : ${timerErrMsg}`,
            );
          }
        })();
      }, 3000);

      return { success: true, ...result };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erreur lors du démarrage';
      this.logger.warn(`Erreur démarrage partie : ${msg}`);
      return { success: false, message: msg };
    }
  }

  /**
   * Soumission d'une réponse par un participant (Modèle Kahoot avec Server Timing).
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_ANSWER)
  async handleDuelAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DuelAnswerSocketPayload,
  ) {
    try {
      const userId = this.getClientUserId(client, data?.userId);
      if (!userId || userId.startsWith('guest_')) {
        return {
          success: false,
          message:
            'Seuls les utilisateurs connectés peuvent soumettre une réponse.',
        };
      }
      const result = await this.duelService.submitAnswer(userId, data);

      const room = RealtimeRooms.duel(data.code);

      // Informer discrètement la salle du nombre de joueurs ayant répondu (tension en direct)
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_PLAYER_ANSWERED, {
        userId,
        answeredCount: result.answeredCount,
        totalPlayersCount: result.totalPlayersCount,
      });

      // Si TOUS les participants ont répondu avant la fin du chrono -> Fin immédiate du round !
      if (result.allAnswered) {
        this.logger.log(
          `⚡ [DuelGateway] Tous les joueurs ont répondu sur ${room} -> Transition immédiate vers le classement`,
        );
        const concludeResult = await this.duelService.concludeRound(data.code);

        this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROUND_END, {
          correctAnswer: concludeResult.correctAnswer,
          explanationMg: concludeResult.explanationMg,
          explanationFr: concludeResult.explanationFr,
          leaderboard: concludeResult.leaderboard,
          isLastQuestion: concludeResult.isLastQuestion,
          nextQuestionCountdown: concludeResult.nextQuestionCountdown,
          currentQuestionIndex: concludeResult.currentQuestionIndex,
          totalQuestions: concludeResult.totalQuestions,
        });
      }

      return { success: true, ...result };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erreur lors de la validation';
      this.logger.warn(`Erreur validation réponse : ${msg}`);
      return {
        success: false,
        message: msg,
      };
    }
  }

  /**
   * Fin du compte à rebours d'une question : Dévoilement des scores et du classement intermédiaire.
   */
  @SubscribeMessage('duel:round_timeout')
  async handleDuelRoundTimeout(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { code: string },
  ) {
    try {
      if (!data?.code) return { success: false };

      const room = RealtimeRooms.duel(data.code);
      const concludeResult = await this.duelService.concludeRound(data.code);

      this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROUND_END, {
        correctAnswer: concludeResult.correctAnswer,
        explanationMg: concludeResult.explanationMg,
        explanationFr: concludeResult.explanationFr,
        leaderboard: concludeResult.leaderboard,
        isLastQuestion: concludeResult.isLastQuestion,
        nextQuestionCountdown: concludeResult.nextQuestionCountdown,
        currentQuestionIndex: concludeResult.currentQuestionIndex,
        totalQuestions: concludeResult.totalQuestions,
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  /**
   * Fin du décompte de 5s : Passage à la question suivante OU affichage du Podium Final.
   */
  @SubscribeMessage('duel:advance_round')
  async handleDuelAdvanceRound(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { code: string },
  ) {
    try {
      if (!data?.code) return { success: false };

      const room = RealtimeRooms.duel(data.code);
      const advanceResult = await this.duelService.advanceToNextRoundOrFinish(
        data.code,
      );

      if (advanceResult.isFinished) {
        // Clôture avec Podium Final
        this.server.to(room).emit(SOCKET_EVENTS.DUEL_GAME_FINISH, {
          finalLeaderboard: advanceResult.finalLeaderboard,
          winnerId: advanceResult.winnerId,
        });
        this.logger.log(`🏆 [DuelGateway] Podium final diffusé sur ${room} !`);
      } else {
        // Round suivant
        this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROUND_START, {
          currentQuestion: advanceResult.currentQuestion,
          currentQuestionIndex: advanceResult.currentQuestionIndex,
          totalQuestions: advanceResult.totalQuestions,
          roundTimeLimit: advanceResult.roundTimeLimit,
        });
        this.logger.log(
          `➡️ [DuelGateway] Question suivante #${(advanceResult.currentQuestionIndex ?? 0) + 1} diffusée sur ${room}`,
        );

        // Envoyer les détails secrets à l'hôte spectateur s'il anime
        const hostIsSpectator = await this.duelService.isHostSpectator(
          data.code,
        );
        if (hostIsSpectator) {
          const hostDetails = await this.duelService.getHostQuestionDetails(
            data.code,
            advanceResult.currentQuestionIndex ?? 0,
          );
          if (hostDetails) {
            client.emit(SOCKET_EVENTS.DUEL_HOST_DETAILS, {
              questionIndex: advanceResult.currentQuestionIndex,
              ...hostDetails,
            });
          }
        }
      }

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  /**
   * Bascule le mode Animateur (Spectateur) pour l'Hôte.
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_TOGGLE_SPECTATOR)
  async handleDuelToggleSpectator(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { code: string; isSpectator: boolean; userId?: string },
  ) {
    try {
      if (!data?.code) return { success: false, message: 'Code requis' };

      const userId = this.getClientUserId(client, data?.userId);

      // Si l'utilisateur est le créateur du deck, il ne peut pas passer en tant que joueur
      const isCreator = await this.duelService.isDeckAuthor(data.code, userId);
      if (isCreator && !data.isSpectator) {
        return {
          success: false,
          isSpectator: true,
          message:
            "En tant que créateur de ce deck, vous ne pouvez participer qu'en tant que supporter/animateur.",
        };
      }

      await this.duelService.setHostSpectator(
        data.code,
        Boolean(data.isSpectator),
      );

      const room = RealtimeRooms.duel(data.code);
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_TOGGLE_SPECTATOR, {
        code: data.code,
        hostUserId: userId,
        isSpectator: Boolean(data.isSpectator),
      });

      this.logger.log(
        `🎭 [DuelGateway] Mode Spectateur de l'hôte sur ${room} = ${data.isSpectator}`,
      );
      return { success: true, isSpectator: Boolean(data.isSpectator) };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erreur toggle spectateur';
      return { success: false, message: msg };
    }
  }

  /**
   * Abandon ou départ d'une session de duel.
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_LEAVE)
  async handleDuelLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DuelLeaveSocketPayload,
  ) {
    try {
      const userId = this.getClientUserId(client, data?.userId);
      if (data?.code) {
        const cleanCode = data.code.trim().toUpperCase();
        const timerKey = `${cleanCode}:${userId}`;
        const pendingTimer = this.disconnectTimers.get(timerKey);
        if (pendingTimer) {
          clearTimeout(pendingTimer);
          this.disconnectTimers.delete(timerKey);
        }

        const room = RealtimeRooms.duel(data.code);
        const result = await this.duelService.handlePlayerLeave(
          userId,
          data.code,
        );
        await client.leave(room);
        delete (client.data as Record<string, unknown>).duelCode;

        if (!result) return { success: true };

        if (result.sessionCancelled) {
          // L'hôte est parti -> Annulation propre et clôture du salon pour tous
          this.server.to(room).emit(SOCKET_EVENTS.DUEL_SESSION_CANCELLED, {
            code: data.code,
            reason: 'HOST_LEFT',
            messageMg:
              "Nandao ny efitrano ny tompon'ny lalao. Natsahatra ny salon.",
            messageFr: "L'hôte a quitté le salon. La partie a été fermée.",
          });
          // Libérer immédiatement la room socket.io côté serveur
          this.server.in(room).socketsLeave(room);
          this.logger.log(
            `📢 [DuelGateway] Session ${room} fermée définitivement suite au départ de l'hôte`,
          );
        } else if (result.forfeitVictory) {
          // 🏆 Victoire par forfait (il ne reste qu'un seul joueur actif en plein jeu !)
          this.server.to(room).emit(SOCKET_EVENTS.DUEL_GAME_FINISH, {
            finalLeaderboard: result.finalLeaderboard,
            winnerId: result.winnerId,
            forfeit: true,
            winnerName: result.winnerName,
            forfeiterName: result.forfeiterName,
            messageFr: `${result.forfeiterName} a quitté la partie. Victoire par forfait !`,
            messageMg: `Nandao ny lalao i ${result.forfeiterName}. Azonao ny fandresena !`,
          });
          this.logger.log(
            `🏆 [DuelGateway] Victoire par forfait diffusée sur ${room} pour ${result.winnerName} !`,
          );
        } else if (result.remainingPlayers) {
          // Simple participant qui part
          this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROOM_UPDATE, {
            session: result.session,
            players: result.remainingPlayers,
          });

          // Si le choix du thème est revenu à l'hôte
          if (result.themeChooserChanged) {
            this.server
              .to(room)
              .emit(SOCKET_EVENTS.DUEL_THEME_CHOOSER_CHANGED, {
                themeChooserId: result.newThemeChooserId,
              });
          }

          // Si la partie est en cours et que tous les participants restants avaient déjà répondu
          if (result.allRemainingAnswered) {
            this.logger.log(
              `⚡ [DuelGateway] Départ joueur -> Clôture automatique du round sur ${room}`,
            );
            const concludeResult = await this.duelService.concludeRound(
              data.code,
            );
            this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROUND_END, {
              correctAnswer: concludeResult.correctAnswer,
              explanationMg: concludeResult.explanationMg,
              explanationFr: concludeResult.explanationFr,
              leaderboard: concludeResult.leaderboard,
              isLastQuestion: concludeResult.isLastQuestion,
              nextQuestionCountdown: concludeResult.nextQuestionCountdown,
              currentQuestionIndex: concludeResult.currentQuestionIndex,
              totalQuestions: concludeResult.totalQuestions,
            });
          }
        }
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  /**
   * Expulsion d'un joueur par l'Hôte du salon.
   */
  @SubscribeMessage(SOCKET_EVENTS.DUEL_KICK_PLAYER)
  async handleDuelKickPlayer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DuelKickSocketPayload,
  ) {
    try {
      if (!data?.code || !data?.targetUserId) {
        return {
          success: false,
          message: 'Code de salon et identifiant du joueur requis.',
        };
      }

      const hostUserId = this.getClientUserId(client, data?.hostUserId);
      if (!hostUserId || hostUserId.startsWith('guest_')) {
        return {
          success: false,
          message: 'Authentification requise pour cette action.',
        };
      }

      const result = await this.duelService.kickPlayer(
        hostUserId,
        data.code,
        data.targetUserId,
      );

      const room = RealtimeRooms.duel(data.code);

      // 1. Notifier la salle et le joueur exclu
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_PLAYER_KICKED, {
        code: data.code,
        kickedUserId: data.targetUserId,
        kickedName: result.kickedPlayer.name,
        messageMg: `Nesorin'ny tompon'ny lalao tao amin'ny efitrano i ${result.kickedPlayer.name}.`,
        messageFr: `${result.kickedPlayer.name} a été expulsé(e) du salon par l'hôte.`,
      });

      // 2. Mettre à jour la liste des participants pour tout le monde
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROOM_UPDATE, {
        session: result.session,
        players: result.remainingPlayers,
      });

      // 3. Retirer les sockets du joueur exclu de la room
      const socketsInRoom = await this.server.in(room).fetchSockets();
      for (const s of socketsInRoom) {
        const sUserId = (s.data as Record<string, unknown>)?.userId;
        if (sUserId === data.targetUserId) {
          s.leave(room);
        }
      }

      // 4. Si la session est en cours et que tous les participants restants avaient déjà répondu
      if (result.allRemainingAnswered) {
        this.logger.log(
          `⚡ [DuelGateway] Expulsion joueur -> Clôture automatique du round sur ${room}`,
        );
        const concludeResult = await this.duelService.concludeRound(data.code);
        this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROUND_END, {
          correctAnswer: concludeResult.correctAnswer,
          explanationMg: concludeResult.explanationMg,
          explanationFr: concludeResult.explanationFr,
          leaderboard: concludeResult.leaderboard,
          isLastQuestion: concludeResult.isLastQuestion,
          nextQuestionCountdown: concludeResult.nextQuestionCountdown,
          currentQuestionIndex: concludeResult.currentQuestionIndex,
          totalQuestions: concludeResult.totalQuestions,
        });
      }

      this.logger.log(
        `👢 [DuelGateway] Joueur ${data.targetUserId} (${result.kickedPlayer.name}) expulsé du salon ${room} par l'hôte ${hostUserId}`,
      );

      return { success: true, remainingPlayers: result.remainingPlayers };
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'expulsion du joueur";
      this.logger.warn(`Erreur expulsion joueur : ${msg}`);
      return { success: false, message: msg };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Handlers pour les messages reçus depuis Redis Pub/Sub (Factorisés)
  // ───────────────────────────────────────────────────────────────────────────

  private handleRedisNotification(payload: NotificationRealtimePayload) {
    if (!this.server || !payload?.notification) return;

    const targetUserId = this.sanitizeId(payload.targetUserId);

    if (targetUserId) {
      // Notification ciblée
      this.server
        .to(RealtimeRooms.user(targetUserId))
        .emit(SOCKET_EVENTS.NOTIFICATION_NEW, payload.notification);
    } else if (payload.isBroadcast) {
      // Diffusion globale
      this.server.emit(SOCKET_EVENTS.NOTIFICATION_NEW, payload.notification);
    }
  }

  private handleRedisComment(payload: CommentRealtimePayload) {
    if (!this.server || !payload?.contributionId) return;

    const contributionId = this.sanitizeId(payload.contributionId);
    if (!contributionId) return;

    const room = RealtimeRooms.contribution(contributionId);

    switch (payload.action) {
      case 'create':
        if (payload.comment) {
          this.server.to(room).emit(SOCKET_EVENTS.COMMENT_NEW, payload.comment);
        }
        break;

      case 'update':
        if (payload.comment) {
          this.server
            .to(room)
            .emit(SOCKET_EVENTS.COMMENT_UPDATED, payload.comment);
        }
        break;

      case 'delete':
        if (payload.commentId) {
          this.server.to(room).emit(SOCKET_EVENTS.COMMENT_DELETED, {
            commentId: payload.commentId,
          });
        }
        break;
    }
  }

  private handleRedisLeaderboard(payload: LeaderboardRealtimePayload) {
    if (!this.server || !payload?.userId) return;

    // Diffuser à la room dédiée et globalement pour actualiser le classement
    this.server
      .to(RealtimeRooms.leaderboard())
      .emit(SOCKET_EVENTS.LEADERBOARD_UPDATED, payload);

    this.server.emit(SOCKET_EVENTS.LEADERBOARD_UPDATED, payload);

    this.logger.log(
      `🏆 [Realtime] Score classement mis à jour pour ${payload.userId} (+${payload.xpDelta || 0} XP, total: ${payload.totalXp})`,
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Helpers de sécurité et validation (KISS / DRY)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Valide et assainit un identifiant pour éviter les injections de rooms.
   */
  private sanitizeId(id: unknown): string | null {
    if (typeof id !== 'string') return null;
    const trimmed = id.trim();
    return SAFE_ID_REGEX.test(trimmed) ? trimmed : null;
  }

  /**
   * Tente d'extraire et de valider l'utilisateur connecté via Better-Auth ou les en-têtes handshake.
   */
  private async extractAuthenticatedUserId(
    client: Socket,
  ): Promise<string | null> {
    const handshakeAuth = client.handshake.auth as
      Record<string, unknown> | undefined;
    const handshakeQuery = client.handshake.query as
      Record<string, unknown> | undefined;

    // 1. Vérification par session Better Auth si des en-têtes de session ou cookies existent
    try {
      const headers = new Headers();
      if (client.handshake.headers) {
        Object.entries(client.handshake.headers).forEach(([k, v]) => {
          if (typeof v === 'string') headers.set(k, v);
          else if (Array.isArray(v)) headers.set(k, v.join(', '));
        });
      }

      // Si un token bearer est passé explicitement dans auth
      const authToken =
        (typeof handshakeAuth?.token === 'string'
          ? handshakeAuth.token
          : undefined) ||
        (typeof handshakeQuery?.token === 'string'
          ? handshakeQuery.token
          : undefined);
      if (authToken && !headers.has('authorization')) {
        headers.set('authorization', `Bearer ${authToken}`);
      }

      // Si un cookie Better-Auth est passé dans handshake auth
      const authCookie =
        (typeof handshakeAuth?.cookie === 'string'
          ? handshakeAuth.cookie
          : undefined) ||
        (typeof handshakeAuth?.Cookie === 'string'
          ? handshakeAuth.Cookie
          : undefined);
      if (authCookie && !headers.has('cookie')) {
        headers.set('cookie', authCookie);
      }

      const session = await auth.api.getSession({ headers });
      if (session?.user?.id) {
        return session.user.id;
      }

      // 2. Fallback direct en base de données sur la table Session
      if (authToken && typeof authToken === 'string' && authToken.trim()) {
        const dbSession = await this.prisma.session.findUnique({
          where: { token: authToken.trim() },
          select: { userId: true, expiresAt: true },
        });
        if (dbSession && dbSession.expiresAt > new Date()) {
          return dbSession.userId;
        }
      }
    } catch {
      // Fallback silencieux si la validation de session échoue
    }

    return null;
  }
}
