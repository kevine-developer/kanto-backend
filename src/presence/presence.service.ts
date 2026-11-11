import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import {
  PlayerPresenceStatus,
  PlayerUnavailabilityReason,
  UserDuelAvailability,
} from './presence.types.js';

interface LocalUserPresence {
  lastSeenAt: number;
  appState: 'active' | 'background' | 'inactive';
}

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name);

  // Fenêtres de tolérance temporelle (en millisecondes)
  private readonly ONLINE_THRESHOLD_MS = 60_000; // 60 secondes d'inactivité max pour être "En ligne"
  private readonly AWAY_THRESHOLD_MS = 180_000; // Au-delà de 3 minutes sans heartbeat -> "Hors ligne"
  private readonly PENDING_DUEL_WINDOW_MS = 10 * 60_000; // 10 minutes max pour un défi en attente
  private readonly IN_GAME_MAX_DURATION_MS = 8 * 60_000; // 8 minutes max pour considérer une partie activement en cours

  // Fallback mémoire local (si Redis indisponible ou standalone)
  private readonly localPresence = new Map<string, LocalUserPresence>();
  private readonly localSockets = new Map<string, Set<string>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Enregistre la connexion d'un socket pour un utilisateur.
   */
  async recordSocketConnect(userId: string, socketId: string): Promise<void> {
    if (!userId) return;

    // Mise à jour locale
    let sockets = this.localSockets.get(userId);
    if (!sockets) {
      sockets = new Set<string>();
      this.localSockets.set(userId, sockets);
    }
    sockets.add(socketId);

    this.localPresence.set(userId, {
      lastSeenAt: Date.now(),
      appState: 'active',
    });

    // Mise à jour Redis (avec TTL de 10 min)
    try {
      const redisKey = `presence:user:${userId}`;
      await this.redisService.set(
        redisKey,
        {
          lastSeenAt: Date.now(),
          appState: 'active',
          socketCount: sockets.size,
        },
        600,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`[Presence] Erreur écriture Redis (connect): ${msg}`);
    }
  }

  /**
   * Enregistre la déconnexion d'un socket.
   */
  async recordSocketDisconnect(
    userId: string,
    socketId: string,
  ): Promise<void> {
    if (!userId) return;

    const sockets = this.localSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.localSockets.delete(userId);
        // Si plus aucun socket connecté, basculer immédiatement en hors-ligne local
        const presence = this.localPresence.get(userId);
        if (presence) {
          presence.appState = 'inactive';
        }
      }
    }

    try {
      const redisKey = `presence:user:${userId}`;
      const remainingSocketsCount = sockets?.size ?? 0;
      if (remainingSocketsCount === 0) {
        await this.redisService.set(
          redisKey,
          {
            lastSeenAt: Date.now(),
            appState: 'inactive',
            socketCount: 0,
          },
          120,
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`[Presence] Erreur écriture Redis (disconnect): ${msg}`);
    }
  }

  /**
   * Enregistre un battement de cœur (heartbeat) reçu de l'application cliente.
   */
  async recordHeartbeat(
    userId: string,
    appState: 'active' | 'background' | 'inactive' = 'active',
  ): Promise<void> {
    if (!userId) return;

    const now = Date.now();
    this.localPresence.set(userId, {
      lastSeenAt: now,
      appState,
    });

    try {
      const redisKey = `presence:user:${userId}`;
      const sockets = this.localSockets.get(userId);
      await this.redisService.set(
        redisKey,
        {
          lastSeenAt: now,
          appState,
          socketCount: sockets?.size ?? 1,
        },
        300,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`[Presence] Erreur écriture Redis (heartbeat): ${msg}`);
    }
  }

  /**
   * Récupère le statut brut de présence d'un utilisateur (ONLINE, AWAY, OFFLINE).
   */
  async getRawPresenceStatus(userId: string): Promise<PlayerPresenceStatus> {
    const now = Date.now();
    let lastSeenAt = 0;
    let appState: 'active' | 'background' | 'inactive' = 'inactive';
    let socketCount = this.localSockets.get(userId)?.size ?? 0;

    // Tenter de lire depuis Redis
    try {
      const redisKey = `presence:user:${userId}`;
      const cached = await this.redisService.get<{
        lastSeenAt: number;
        appState: 'active' | 'background' | 'inactive';
        socketCount: number;
      }>(redisKey);

      if (cached) {
        lastSeenAt = cached.lastSeenAt;
        appState = cached.appState;
        socketCount = Math.max(socketCount, cached.socketCount ?? 0);
      }
    } catch {
      // Fallback mémoire silencieux
    }

    // Si non trouvé en cache Redis, utiliser le store local
    if (!lastSeenAt) {
      const local = this.localPresence.get(userId);
      if (local) {
        lastSeenAt = local.lastSeenAt;
        appState = local.appState;
      }
    }

    // Aucun battement de cœur enregistré -> OFFLINE
    if (!lastSeenAt) {
      return PlayerPresenceStatus.OFFLINE;
    }

    const elapsed = now - lastSeenAt;

    // Dépassé le seuil d'expiration maximale (3 min) ou application explicitement inactive -> OFFLINE
    if (elapsed > this.AWAY_THRESHOLD_MS || appState === 'inactive') {
      return PlayerPresenceStatus.OFFLINE;
    }

    // L'application est en arrière-plan ou inactive depuis > 60s -> AWAY
    if (appState === 'background' || elapsed > this.ONLINE_THRESHOLD_MS) {
      return PlayerPresenceStatus.AWAY;
    }

    // En ligne et actif au premier plan (heartbeat récent < 60s ou socket connecté actif)
    return PlayerPresenceStatus.ONLINE;
  }

  /**
   * Vérifie la disponibilité réelle d'un joueur ciblé pour recevoir un défi 1v1 d'un expéditeur.
   * Analyse croisée : Compte actif -> Blocage -> Statut présence -> Parties en cours -> Défis en attente.
   */
  async getUserDuelAvailability(
    requesterId: string | undefined,
    targetUserId: string,
  ): Promise<UserDuelAvailability> {
    // 1. Auto-défi interdit
    if (requesterId && requesterId === targetUserId) {
      return {
        targetUserId,
        status: PlayerPresenceStatus.BUSY,
        isAvailableForDuel: false,
        reason: 'BUSY_PENDING_INVITE',
        messageFr: 'Vous ne pouvez pas vous défier vous-même.',
        messageMg: 'Tsy afaka miantsy ny tenanao ianao.',
      };
    }

    // 2. Vérification de l'existence et de l'état du compte du joueur ciblé
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        banned: true,
        status: true,
      },
    });

    if (!targetUser) {
      return {
        targetUserId,
        status: PlayerPresenceStatus.OFFLINE,
        isAvailableForDuel: false,
        reason: 'NOT_FOUND',
        messageFr: 'Ce joueur est introuvable.',
        messageMg: 'Tsy hita ity mpilalao ity.',
      };
    }

    if (
      targetUser.banned ||
      (targetUser.status && targetUser.status !== 'ACTIVE')
    ) {
      return {
        targetUserId,
        status: PlayerPresenceStatus.BUSY,
        isAvailableForDuel: false,
        reason: 'BANNED',
        messageFr: "Ce joueur n'est pas disponible pour recevoir un défi.",
        messageMg:
          "Tsy afaka mandray fanamby ity mpilalao ity amin'izao fotoana izao.",
      };
    }

    // 3. Vérification des blocages mutuels
    if (requesterId) {
      const isBlocked = await this.prisma.userBlock.findFirst({
        where: {
          OR: [
            { blockerId: requesterId, blockedId: targetUserId },
            { blockerId: targetUserId, blockedId: requesterId },
          ],
        },
        select: { id: true },
      });

      if (isBlocked) {
        return {
          targetUserId,
          status: PlayerPresenceStatus.BUSY,
          isAvailableForDuel: false,
          reason: 'BLOCKED',
          messageFr: "Ce joueur n'est pas disponible pour recevoir un défi.",
          messageMg:
            "Tsy afaka mandray fanamby ity mpilalao ity amin'izao fotoana izao.",
        };
      }
    }

    // 4. Vérification si le joueur ciblé participe déjà à une partie activement en cours (< 8 min)
    const maxMatchTime = new Date(Date.now() - this.IN_GAME_MAX_DURATION_MS);
    const activeMatch = await this.prisma.duelSession.findFirst({
      where: {
        status: 'IN_PROGRESS',
        updatedAt: { gte: maxMatchTime },
        OR: [
          { player1Id: targetUserId },
          { player2Id: targetUserId },
          { players: { some: { userId: targetUserId } } },
        ],
      },
      select: { id: true, code: true },
    });

    if (activeMatch) {
      return {
        targetUserId,
        status: PlayerPresenceStatus.IN_GAME,
        isAvailableForDuel: false,
        reason: 'IN_GAME',
        messageFr: 'Ce joueur participe déjà à une partie.',
        messageMg: "Efa mandray anjara amin'ny lalao hafa ity mpilalao ity.",
      };
    }

    // 5. Vérification si une invitation identique est déjà en attente (< 10 min)
    const tenMinutesAgo = new Date(Date.now() - this.PENDING_DUEL_WINDOW_MS);
    const pendingDuel = await this.prisma.duelSession.findFirst({
      where: {
        status: 'WAITING',
        createdAt: { gte: tenMinutesAgo },
        OR: [
          { player1Id: requesterId, player2Id: targetUserId },
          { player1Id: targetUserId, player2Id: requesterId },
        ],
      },
      select: { id: true, player1Id: true },
    });

    if (pendingDuel) {
      const isFromRequester = pendingDuel.player1Id === requesterId;
      return {
        targetUserId,
        status: PlayerPresenceStatus.BUSY,
        isAvailableForDuel: false,
        reason: 'BUSY_PENDING_INVITE',
        messageFr: isFromRequester
          ? 'Ce joueur a déjà reçu une invitation de votre part.'
          : 'Ce joueur vous a déjà envoyé une invitation en attente.',
        messageMg: isFromRequester
          ? 'Efa nahazo fanasana avy aminao ity mpilalao ity.'
          : 'Efa nandefa fanasana ho anao ity mpilalao ity.',
      };
    }

    // 6. Vérification du statut de présence temps réel (Socket + Heartbeat)
    const presence = await this.getRawPresenceStatus(targetUserId);

    if (presence === PlayerPresenceStatus.OFFLINE) {
      return {
        targetUserId,
        status: PlayerPresenceStatus.OFFLINE,
        isAvailableForDuel: false,
        reason: 'OFFLINE',
        messageFr: 'Ce joueur est actuellement hors ligne.',
        messageMg:
          "Tsy mifandray amin'ny aterineto ity mpilalao ity amin'izao fotoana izao.",
      };
    }

    if (presence === PlayerPresenceStatus.AWAY) {
      return {
        targetUserId,
        status: PlayerPresenceStatus.AWAY,
        isAvailableForDuel: false,
        reason: 'AWAY',
        messageFr: 'Ce joueur est inactif pour le moment.',
        messageMg: 'Tsy miasa vonjimaika ity mpilalao ity.',
      };
    }

    // 7. Le joueur est EN LIGNE et disponible pour recevoir un défi !
    return {
      targetUserId,
      status: PlayerPresenceStatus.ONLINE,
      isAvailableForDuel: true,
      messageFr: 'Ce joueur est en ligne et disponible pour un duel.',
      messageMg: 'Mifandray an-tserasera ary vonona hifanina ity mpilalao ity.',
    };
  }

  /**
   * Récupère la disponibilité par lot (Batch) pour une liste de joueurs (ex: liste d'amis, classement).
   * Évite le problème de requêtes N+1 grâce à des requêtes groupées performantes.
   */
  async getBatchUsersDuelAvailability(
    requesterId: string | undefined,
    targetUserIds: string[],
  ): Promise<Record<string, UserDuelAvailability>> {
    const uniqueIds = Array.from(new Set(targetUserIds.filter(Boolean)));
    if (uniqueIds.length === 0) {
      return {};
    }

    // 1. Charger en un seul aller-retour les utilisateurs bloqués ou bannis
    const maxMatchTime = new Date(Date.now() - this.IN_GAME_MAX_DURATION_MS);
    const [blockedList, inGameSessions, pendingSessions] = await Promise.all([
      requesterId
        ? this.prisma.userBlock.findMany({
            where: {
              OR: [
                { blockerId: requesterId, blockedId: { in: uniqueIds } },
                { blockerId: { in: uniqueIds }, blockedId: requesterId },
              ],
            },
            select: { blockerId: true, blockedId: true },
          })
        : Promise.resolve<Array<{ blockerId: string; blockedId: string }>>([]),
      this.prisma.duelSession.findMany({
        where: {
          status: 'IN_PROGRESS',
          updatedAt: { gte: maxMatchTime },
          OR: [
            { player1Id: { in: uniqueIds } },
            { player2Id: { in: uniqueIds } },
            { players: { some: { userId: { in: uniqueIds } } } },
          ],
        },
        select: {
          player1Id: true,
          player2Id: true,
          players: { select: { userId: true } },
        },
      }),
      requesterId
        ? this.prisma.duelSession.findMany({
            where: {
              status: 'WAITING',
              createdAt: {
                gte: new Date(Date.now() - this.PENDING_DUEL_WINDOW_MS),
              },
              OR: [
                { player1Id: requesterId, player2Id: { in: uniqueIds } },
                { player1Id: { in: uniqueIds }, player2Id: requesterId },
              ],
            },
            select: { player1Id: true, player2Id: true },
          })
        : Promise.resolve<
            Array<{ player1Id: string | null; player2Id: string | null }>
          >([]),
    ]);

    const blockedSet = new Set<string>();
    blockedList.forEach((b) => {
      blockedSet.add(b.blockerId === requesterId ? b.blockedId : b.blockerId);
    });

    const inGameSet = new Set<string>();
    inGameSessions.forEach((s) => {
      if (s.player1Id) inGameSet.add(s.player1Id);
      if (s.player2Id) inGameSet.add(s.player2Id);
      s.players?.forEach((p) => {
        if (p.userId) inGameSet.add(p.userId);
      });
    });

    const pendingSet = new Map<string, string>(); // targetUserId -> player1Id
    pendingSessions.forEach((s) => {
      const otherId = s.player1Id === requesterId ? s.player2Id : s.player1Id;
      if (otherId && s.player1Id) pendingSet.set(otherId, s.player1Id);
    });

    // 2. Évaluer pour chaque ID
    const results: Record<string, UserDuelAvailability> = {};

    for (const targetId of uniqueIds) {
      if (targetId === requesterId) {
        results[targetId] = {
          targetUserId: targetId,
          status: PlayerPresenceStatus.BUSY,
          isAvailableForDuel: false,
          reason: 'BUSY_PENDING_INVITE',
          messageFr: 'Vous ne pouvez pas vous défier vous-même.',
          messageMg: 'Tsy afaka miantsy ny tenanao ianao.',
        };
        continue;
      }

      if (blockedSet.has(targetId)) {
        results[targetId] = {
          targetUserId: targetId,
          status: PlayerPresenceStatus.BUSY,
          isAvailableForDuel: false,
          reason: 'BLOCKED',
          messageFr: "Ce joueur n'est pas disponible pour recevoir un défi.",
          messageMg:
            "Tsy afaka mandray fanamby ity mpilalao ity amin'izao fotoana izao.",
        };
        continue;
      }

      if (inGameSet.has(targetId)) {
        results[targetId] = {
          targetUserId: targetId,
          status: PlayerPresenceStatus.IN_GAME,
          isAvailableForDuel: false,
          reason: 'IN_GAME',
          messageFr: 'Ce joueur participe déjà à une partie.',
          messageMg: "Efa mandray anjara amin'ny lalao hafa ity mpilalao ity.",
        };
        continue;
      }

      const pendingCreator = pendingSet.get(targetId);
      if (pendingCreator) {
        const isFromRequester = pendingCreator === requesterId;
        results[targetId] = {
          targetUserId: targetId,
          status: PlayerPresenceStatus.BUSY,
          isAvailableForDuel: false,
          reason: 'BUSY_PENDING_INVITE',
          messageFr: isFromRequester
            ? 'Ce joueur a déjà reçu une invitation de votre part.'
            : 'Ce joueur vous a déjà envoyé une invitation en attente.',
          messageMg: isFromRequester
            ? 'Efa nahazo fanasana avy aminao ity mpilalao ity.'
            : 'Efa nandefa fanasana ho anao ity mpilalao ity.',
        };
        continue;
      }

      const rawPresence = await this.getRawPresenceStatus(targetId);

      if (rawPresence === PlayerPresenceStatus.OFFLINE) {
        results[targetId] = {
          targetUserId: targetId,
          status: PlayerPresenceStatus.OFFLINE,
          isAvailableForDuel: false,
          reason: 'OFFLINE',
          messageFr: 'Ce joueur est actuellement hors ligne.',
          messageMg:
            "Tsy mifandray amin'ny aterineto ity mpilalao ity amin'izao fotoana izao.",
        };
      } else if (rawPresence === PlayerPresenceStatus.AWAY) {
        results[targetId] = {
          targetUserId: targetId,
          status: PlayerPresenceStatus.AWAY,
          isAvailableForDuel: false,
          reason: 'AWAY',
          messageFr: 'Ce joueur est inactif pour le moment.',
          messageMg: 'Tsy miasa vonjimaika ity mpilalao ity.',
        };
      } else {
        results[targetId] = {
          targetUserId: targetId,
          status: PlayerPresenceStatus.ONLINE,
          isAvailableForDuel: true,
          messageFr: 'Ce joueur est en ligne et disponible pour un duel.',
          messageMg:
            'Mifandray an-tserasera ary vonona hifanina ity mpilalao ity.',
        };
      }
    }

    return results;
  }
}
