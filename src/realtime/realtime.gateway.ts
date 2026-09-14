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
      } else {
        const rawOrigins = process.env.CORS_ORIGINS;
        if (!rawOrigins) {
          callback(null, true);
          return;
        }

        const allowedList = rawOrigins.split(',').map((o) => o.trim());
        const isAllowed =
          allowedList.includes(origin) || origin.startsWith('http://localhost');
        callback(null, isAllowed);
      }
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

  constructor(
    private readonly redisService: RedisService,
    private readonly duelService: DuelService,
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
  }

  /**
   * Authentifie ou ré-associe dynamiquement un socket à un utilisateur avec validation.
   */
  @SubscribeMessage(SOCKET_EVENTS.AUTHENTICATE)
  async handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId?: string },
  ) {
    // 1. Tenter d'abord la validation par session Better Auth si disponible
    const sessionUserId = await this.extractAuthenticatedUserId(client);
    const targetUserId = sessionUserId || this.sanitizeId(data?.userId);

    if (!targetUserId) {
      return { success: false, message: 'Identifiant utilisateur invalide' };
    }

    const room = RealtimeRooms.user(targetUserId);
    await client.join(room);
    (client.data as Record<string, unknown>).userId = targetUserId;
    this.logger.log(`🔑 [Realtime] Socket ${client.id} rattaché à ${room}`);
    return { success: true, room };
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
  private getClientUserId(client: Socket, fallback?: string): string {
    const clientData = client.data as Record<string, unknown>;
    if (typeof clientData?.userId === 'string' && clientData.userId) {
      return clientData.userId;
    }
    if (fallback && typeof fallback === 'string') {
      return fallback;
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

      // Diffuser à toute la salle le début du premier round de question synchronisé
      this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROUND_START, {
        session: result.session,
        currentQuestion: result.currentQuestion,
        currentQuestionIndex: result.currentQuestionIndex,
        totalQuestions: result.totalQuestions,
        roundTimeLimit: result.roundTimeLimit,
      });

      this.logger.log(
        `🚀 [DuelGateway] Début de la partie multijoueur sur ${room} !`,
      );

      // Si l'hôte est en mode régie animateur / spectateur, lui transmettre la réponse secrète
      const hostIsSpectator = await this.duelService.isHostSpectator(data.code);
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
        const room = RealtimeRooms.duel(data.code);
        const result = await this.duelService.handlePlayerLeave(
          userId,
          data.code,
        );
        await client.leave(room);

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
          this.logger.log(
            `📢 [DuelGateway] Session ${room} fermée définitivement suite au départ de l'hôte`,
          );
        } else if (result.remainingPlayers) {
          // Simple participant qui part
          this.server.to(room).emit(SOCKET_EVENTS.DUEL_ROOM_UPDATE, {
            session: result.session,
            players: result.remainingPlayers,
          });

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

      const session = await auth.api.getSession({ headers });
      if (session?.user?.id) {
        return session.user.id;
      }
    } catch {
      // Fallback silencieux si la validation de session échoue
    }

    // 2. Fallback sur userId assaini transmis lors du handshake
    const fallbackId =
      (typeof handshakeQuery?.userId === 'string'
        ? handshakeQuery.userId
        : undefined) ||
      (typeof handshakeAuth?.userId === 'string'
        ? handshakeAuth.userId
        : undefined);

    return this.sanitizeId(fallbackId);
  }
}
