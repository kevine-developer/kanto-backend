import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateNotificationDto } from './dto/notifications.dto.js';
import { RedisService } from '../redis/redis.service.js';
import { REALTIME_CHANNELS } from '../realtime/realtime.constants.js';
import {
  ContributionStatus,
  DisputeStatus,
} from '../../generated/prisma/client.js';

export interface FormattedNotificationItem {
  id: string;
  category: string;
  title: string;
  titleMg?: string;
  titleFr?: string;
  description: string;
  descriptionMg?: string;
  descriptionFr?: string;
  timeAgo: string;
  timestamp: number;
  iconName: string;
  iconColor: string;
  badgeText?: string;
  badgeTextMg?: string;
  badgeTextFr?: string;
  badgeType?: string;
  badgeColor?: string;
  read: boolean;
  targetRoute?: string;
  createdAt: Date;
}

function localizeNotificationBadge(rawBadge?: string | null, isMg = false) {
  if (!rawBadge)
    return { activeBadge: undefined, badgeFr: undefined, badgeMg: undefined };
  const trimmed = rawBadge.trim();
  const lower = trimmed.toLowerCase();

  let badgeFr = trimmed;
  let badgeMg = trimmed;

  if (lower === 'défi' || lower === 'defi' || lower === 'fanamby') {
    badgeFr = 'Défi';
    badgeMg = 'Fanamby';
  } else if (lower === 'namana' || lower === 'ami' || lower === 'amis') {
    badgeFr = 'Ami';
    badgeMg = 'Namana';
  } else if (lower === 'fangatahana' || lower === 'demande') {
    badgeFr = 'Demande';
    badgeMg = 'Fangatahana';
  } else if (
    lower === 'badge' ||
    lower === 'mari-boninahitra' ||
    lower === 'medaly'
  ) {
    badgeFr = 'Badge';
    badgeMg = 'Mari-boninahitra';
  } else if (lower === 'hevitra' || lower === 'commentaire') {
    badgeFr = 'Commentaire';
    badgeMg = 'Hevitra';
  } else if (
    lower === 'level up' ||
    lower === 'ambaratonga' ||
    lower === 'niveau'
  ) {
    badgeFr = 'Niveau';
    badgeMg = 'Ambaratonga';
  } else if (
    lower === 'streak' ||
    lower === 'fahavitrihana' ||
    lower === 'série' ||
    lower === 'serie'
  ) {
    badgeFr = 'Série';
    badgeMg = 'Fahavitrihana';
  } else if (
    lower === 'nekena' ||
    lower === 'approuvé' ||
    lower === 'approuve' ||
    lower === 'approuvée'
  ) {
    badgeFr = 'Approuvée';
    badgeMg = 'Nekena';
  } else if (
    lower === 'tsy voatazona' ||
    lower === 'nolavina' ||
    lower === 'refusé' ||
    lower === 'refuse' ||
    lower === 'non retenue'
  ) {
    badgeFr = 'Non retenue';
    badgeMg = 'Tsy voatazona';
  } else if (
    lower === 'valisoa' ||
    lower === 'récompense' ||
    lower === 'recompense' ||
    lower === 'reward' ||
    lower === 'royalty'
  ) {
    badgeFr = 'Récompense';
    badgeMg = 'Valisoa';
  } else if (lower === 'fandraisana anjara' || lower === 'contribution') {
    badgeFr = 'Contribution';
    badgeMg = 'Fandraisana anjara';
  } else if (lower === 'tongasoa' || lower === 'bienvenue') {
    badgeFr = 'Bienvenue';
    badgeMg = 'Tongasoa';
  } else if (lower === 'fankaherezana' || lower === 'encouragement') {
    badgeFr = 'Encouragement';
    badgeMg = 'Fankaherezana';
  }

  return {
    badgeFr,
    badgeMg,
    activeBadge: isMg ? badgeMg : badgeFr,
  };
}

export interface UserNotificationPreferences {
  enabled: boolean;
  socialActivity: boolean; // Amis, encouragements
  gameInvites: boolean; // Défis multijoueur JvJ
  gameResults: boolean; // Résultats et podiums de quiz/défis
  contributions: boolean; // Statuts et modération des contributions
  announcements: boolean; // Actualités et annonces culturelles
  dailyContent: boolean;
  dailyQuiz: boolean;
  revision: boolean;
  newStory: boolean;
  weeklyChallenge: boolean;
  customHours: Record<string, { hour: number; minute: number; weekday?: number }>;
  timeZone: string;
}

export const DEFAULT_USER_NOTIFICATION_PREFERENCES: UserNotificationPreferences = {
  enabled: true,
  socialActivity: true,
  gameInvites: true,
  gameResults: true,
  contributions: true,
  announcements: true,
  dailyContent: true,
  dailyQuiz: true,
  revision: true,
  newStory: true,
  weeklyChallenge: true,
  customHours: {
    dailyContent: { hour: 8, minute: 30 },
    dailyQuiz: { hour: 12, minute: 30 },
    revision: { hour: 17, minute: 30 },
    newStory: { hour: 20, minute: 45 },
    weeklyChallenge: { hour: 9, minute: 30, weekday: 2 },
  },
  timeZone: 'Indian/Antananarivo',
};

export interface AdminAlertItem {
  id: string;
  type: 'REPORT_PENDING' | 'PENDING_CONTRIBUTION' | 'FLAGGED_CONTENT' | 'DUPLICATE_DISPUTE' | 'SYSTEM_ALERT';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  createdAt: Date;
  resourceId?: string;
  targetRoute: string;
  status: 'open' | 'in_review' | 'resolved';
}

export interface FormattedNotificationGroup {
  date: string;
  notifications: FormattedNotificationItem[];
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Récupère les notifications pour l'application mobile, groupées par date.
   * Ne renvoie strictement que les données réelles autorisées pour l'utilisateur.
   * Si non authentifié, seules les diffusions publiques (isBroadcast: true) sont accessibles.
   */
  async getPublicNotifications(
    language: 'mg' | 'fr' = 'mg',
    userId?: string,
  ): Promise<{
    groups: FormattedNotificationGroup[];
    unreadCount: number;
    totalCount: number;
  }> {
    // Si aucun userId valide, filtrer strictement sur les notifications broadcast
    const whereClause = userId
      ? {
          OR: [{ isBroadcast: true }, { userId }],
        }
      : {
          isBroadcast: true,
        };

    const notifs = await this.prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 60, // Limite de pagination saine pour préserver la mémoire mobile
    });

    const now = new Date();
    const isMg = language === 'mg';

    // Regroupement par jour
    const today: FormattedNotificationItem[] = [];
    const yesterday: FormattedNotificationItem[] = [];
    const thisWeek: FormattedNotificationItem[] = [];
    const older: FormattedNotificationItem[] = [];

    let unreadCount = 0;

    for (const notif of notifs) {
      if (!notif.isRead) {
        unreadCount++;
      }

      const diffMs = now.getTime() - notif.createdAt.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let timeAgo = '';
      if (diffHours < 1) {
        timeAgo = isMg ? 'Vao haingana' : 'À l’instant';
      } else if (diffHours < 24) {
        timeAgo = isMg ? `${diffHours} ora lasa` : `Il y a ${diffHours}h`;
      } else if (diffDays === 1) {
        timeAgo = isMg ? 'Omaly' : 'Hier';
      } else {
        timeAgo = isMg ? `${diffDays} andro lasa` : `Il y a ${diffDays}j`;
      }

      const { activeBadge, badgeFr, badgeMg } = localizeNotificationBadge(
        notif.badgeText,
        isMg,
      );

      const formatted: FormattedNotificationItem = {
        id: notif.id,
        category: notif.category,
        title: isMg ? notif.titleMg : notif.titleFr || notif.titleMg,
        titleMg: notif.titleMg,
        titleFr: notif.titleFr || notif.titleMg,
        description: isMg
          ? notif.messageMg
          : notif.messageFr || notif.messageMg,
        descriptionMg: notif.messageMg,
        descriptionFr: notif.messageFr || notif.messageMg,
        timeAgo,
        timestamp: notif.createdAt.getTime(),
        iconName: notif.iconName || 'notifications-outline',
        iconColor: notif.iconColor || '#C0392B',
        badgeText: activeBadge,
        badgeTextMg: badgeMg,
        badgeTextFr: badgeFr,
        badgeType: notif.badgeType || 'info',
        read: notif.isRead,
        targetRoute: notif.targetRoute || undefined,
        createdAt: notif.createdAt,
      };

      if (diffDays === 0) {
        today.push(formatted);
      } else if (diffDays === 1) {
        yesterday.push(formatted);
      } else if (diffDays <= 7) {
        thisWeek.push(formatted);
      } else {
        older.push(formatted);
      }
    }

    const groups: FormattedNotificationGroup[] = [];
    if (today.length > 0) {
      groups.push({
        date: isMg ? 'Androany' : "Aujourd'hui",
        notifications: today,
      });
    }
    if (yesterday.length > 0) {
      groups.push({
        date: isMg ? 'Omaly' : 'Hier',
        notifications: yesterday,
      });
    }
    if (thisWeek.length > 0) {
      groups.push({
        date: isMg ? "Tamin'ity herinandro ity" : 'Cette semaine',
        notifications: thisWeek,
      });
    }
    if (older.length > 0) {
      groups.push({
        date: isMg ? 'Taloha' : 'Plus tôt',
        notifications: older,
      });
    }

    return {
      groups,
      unreadCount,
      totalCount: notifs.length,
    };
  }

  /**
   * Récupère la liste complète des notifications pour le backoffice Admin.
   */
  async getAllAdminNotifications() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Enregistre ou met à jour le token Expo Push d'un utilisateur ou d'un visiteur anonyme (invité).
   */
  async registerPushToken(userId?: string, pushToken?: string) {
    if (!pushToken || typeof pushToken !== 'string') {
      return { success: false, message: 'Token push manquant ou invalide' };
    }

    const cleanToken = pushToken.trim();
    if (
      !cleanToken.startsWith('ExponentPushToken') &&
      !cleanToken.startsWith('ExpoPushToken')
    ) {
      return { success: false, message: 'Format de token Expo invalide' };
    }

    try {
      if (userId) {
        try {
          await this.prisma.user.update({
            where: { id: userId },
            data: { pushToken: cleanToken },
          });
          // Si ce token était auparavant enregistré en tant qu'invité, le nettoyer
          await this.redisService.sRem('expo_push_tokens:guests', cleanToken);
          this.logger.log(
            `📱 [Push] Token Expo enregistré pour l'utilisateur ${userId}`,
          );
          return {
            success: true,
            message: 'Token push enregistré avec succès',
          };
        } catch (userErr) {
          this.logger.warn(
            `⚠️ [Push] Utilisateur ${userId} introuvable lors de l'assignation du pushToken, enregistrement en invité :`,
            userErr,
          );
        }
      }

      // Enregistrement anonyme (invité) dans Redis
      await this.redisService.sAdd('expo_push_tokens:guests', cleanToken);
      this.logger.log(`📱 [Push] Token Expo enregistré pour un invité anonyme`);

      return { success: true, message: 'Token push enregistré avec succès' };
    } catch (err) {
      this.logger.warn(
        `⚠️ [Push] Échec enregistrement token (userId=${userId || 'guest'}) :`,
        err,
      );
      return { success: false, message: 'Erreur enregistrement token' };
    }
  }

  /**
   * Envoie des notifications push via le service officiel Expo Push.
   * Accepte un token unique ou un tableau de tokens.
   * Nettoie automatiquement les tokens déclarés DeviceNotRegistered ou expirés.
   */
  async sendExpoPush(
    pushTokens: string | string[],
    payload: {
      title: string;
      body: string;
      data?: Record<string, unknown>;
      sound?: string;
    },
  ) {
    const rawTokens = Array.isArray(pushTokens) ? pushTokens : [pushTokens];
    // Valider les tokens Expo valides (commencent par ExponentPushToken ou ExpoPushToken)
    const validTokens = rawTokens.filter(
      (t) =>
        t &&
        typeof t === 'string' &&
        (t.startsWith('ExponentPushToken') || t.startsWith('ExpoPushToken')),
    );

    if (validTokens.length === 0) {
      return;
    }

    const CHUNK_SIZE = 100;
    let totalSent = 0;

    for (let offset = 0; offset < validTokens.length; offset += CHUNK_SIZE) {
      const chunkTokens = validTokens.slice(offset, offset + CHUNK_SIZE);
      const messages = chunkTokens.map((to) => ({
        to,
        sound: payload.sound || 'default',
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
        priority: 'high',
        channelId: 'default',
      }));

      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messages),
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.warn(
            `⚠️ [Expo Push] Réponse API Expo non-OK (${response.status}) pour le lot ${Math.floor(offset / CHUNK_SIZE) + 1} : ${errorText}`,
          );
          continue;
        }

        const jsonResponse: {
          data?: Array<{
            status: 'ok' | 'error';
            message?: string;
            details?: { error?: string };
          }>;
        } = (await response.json()) as any;

        if (Array.isArray(jsonResponse?.data)) {
          for (let i = 0; i < jsonResponse.data.length; i++) {
            const ticket = jsonResponse.data[i];
            const token = chunkTokens[i];
            if (ticket.status === 'error') {
              const errorType = ticket.details?.error;
              if (
                errorType === 'DeviceNotRegistered' ||
                errorType === 'InvalidCredentials'
              ) {
                this.logger.warn(
                  `🧹 [Expo Push] Jeton push obsolète ou non enregistré (${errorType}) détecté : ${token}`,
                );
                // Nettoyage en base de données et dans le cache invité
                void this.prisma.user
                  .updateMany({
                    where: { pushToken: token },
                    data: { pushToken: null },
                  })
                  .catch(() => {});
                void this.redisService
                  .sRem('expo_push_tokens:guests', token)
                  .catch(() => {});
              }
            }
          }
        }

        totalSent += chunkTokens.length;
      } catch (chunkErr) {
        this.logger.error(
          `❌ [Expo Push] Erreur lors de l'appel HTTP vers Expo (lot ${Math.floor(offset / CHUNK_SIZE) + 1}) :`,
          chunkErr,
        );
      }
    }

    if (totalSent > 0) {
      this.logger.log(
        `🚀 [Expo Push] ${totalSent}/${validTokens.length} notification(s) push transmise(s) avec succès (découpées en lots de 100 max).`,
      );
    }
  }

  /**
   * Envoie une notification push de test depuis l'administration.
   */
  async sendTestPush(targetToken?: string) {
    let tokensToSend: string[] = [];

    if (targetToken && targetToken.trim()) {
      tokensToSend = [targetToken.trim()];
    } else {
      // Récupérer les tokens des utilisateurs enregistrés
      const users = await this.prisma.user.findMany({
        where: { pushToken: { not: null } },
        select: { pushToken: true },
        take: 20,
      });
      const userTokens = users
        .map((u) => u.pushToken)
        .filter((t): t is string => Boolean(t));

      // Récupérer les tokens invités
      const guestTokens = await this.redisService.sMembers(
        'expo_push_tokens:guests',
      );

      tokensToSend = Array.from(
        new Set([...userTokens, ...guestTokens.slice(0, 20)]),
      );
    }

    if (tokensToSend.length === 0) {
      return {
        success: false,
        sentCount: 0,
        message:
          'Aucun appareil enregistré trouvé (ni membre ni invité). Ouvrez l’application mobile Kanto sur un smartphone réel pour générer un token push.',
      };
    }

    await this.sendExpoPush(tokensToSend, {
      title: 'Test Kanto Push',
      body: 'Le système de notifications push Expo fonctionne correctement sur votre appareil.',
      data: { isTest: true, timestamp: Date.now() },
    });

    return {
      success: true,
      sentCount: tokensToSend.length,
      message: `Notification push de test transmise à ${tokensToSend.length} appareil(s).`,
    };
  }

  /**
   * Crée une nouvelle notification (Admin ou système) et envoie la notification push associée.
   * Intègre une vérification d'idempotence et une protection anti-doublon en rafale.
   */
  async createNotification(dto: CreateNotificationDto) {
    const titleMg = dto.titleMg?.trim();
    const messageMg = dto.messageMg?.trim();
    if (!titleMg || !messageMg) {
      throw new BadRequestException(
        'Le titre et le message en malgache sont obligatoires.',
      );
    }

    // 1. Clé d'idempotence explicite (ex: webhook ou retry d'action métier)
    if (dto.idempotencyKey) {
      const idempotencyKey = `notif_idem:${dto.idempotencyKey.trim()}`;
      const existingNotifId = await this.redisService.get<string>(idempotencyKey);
      if (existingNotifId) {
        const existing = await this.prisma.notification.findUnique({
          where: { id: existingNotifId },
        });
        if (existing) {
          this.logger.log(
            `🔁 [Notifications] Doublon évité via idempotencyKey "${dto.idempotencyKey}" : ${existing.id}`,
          );
          return existing;
        }
      }
    }

    // 2. Déduplication anti-rafale automatique pour les notifications privées (30 secondes)
    let dedupeKey: string | null = null;
    if (dto.userId) {
      const safeRoute = dto.targetRoute || '';
      dedupeKey = `notif_rate_limit:${dto.userId}:${dto.category || 'culture'}:${titleMg}:${safeRoute}`;
      const existingNotifId = await this.redisService.get<string>(dedupeKey);
      if (existingNotifId) {
        const existing = await this.prisma.notification.findUnique({
          where: { id: existingNotifId },
        });
        if (existing) {
          this.logger.log(
            `⚡ [Notifications] Anti-rafale / doublon évité pour ${dto.userId} ("${titleMg}")`,
          );
          return existing;
        }
      }
    }

    const created = await this.prisma.notification.create({
      data: {
        titleMg,
        titleFr: dto.titleFr?.trim() || null,
        messageMg,
        messageFr: dto.messageFr?.trim() || null,
        category: dto.category || 'culture',
        badgeText: dto.badgeText?.trim() || null,
        badgeType: dto.badgeType || 'new',
        iconName: dto.iconName || 'bulb-outline',
        iconColor: dto.iconColor || '#C0392B',
        targetRoute: dto.targetRoute?.trim() || null,
        isBroadcast: dto.isBroadcast !== false,
        userId: dto.userId || null,
        isRead: false,
      },
    });

    this.logger.log(
      `📢 [Notifications] Nouvelle notification créée : "${created.titleMg}" (${created.category})`,
    );

    // Enregistrer les clés d'idempotence et d'anti-rafale dans Redis
    if (dto.idempotencyKey) {
      void this.redisService.set(
        `notif_idem:${dto.idempotencyKey.trim()}`,
        created.id,
        86400, // 24 heures
      );
    }
    if (dedupeKey) {
      void this.redisService.set(dedupeKey, created.id, 30); // 30 secondes
    }

    const { badgeFr, badgeMg } = localizeNotificationBadge(created.badgeText);

    // Publication temps réel via Redis Pub/Sub
    const formattedForRealtime: FormattedNotificationItem = {
      id: created.id,
      category: created.category,
      title: created.titleFr || created.titleMg,
      titleMg: created.titleMg,
      titleFr: created.titleFr || undefined,
      description: created.messageFr || created.messageMg,
      descriptionMg: created.messageMg,
      descriptionFr: created.messageFr || undefined,
      timeAgo: 'À l’instant',
      timestamp: created.createdAt.getTime(),
      iconName: created.iconName || 'notifications-outline',
      iconColor: created.iconColor || '#C0392B',
      badgeText: badgeFr || badgeMg || undefined,
      badgeTextMg: badgeMg || undefined,
      badgeTextFr: badgeFr || undefined,
      badgeType: created.badgeType || 'info',
      read: false,
      targetRoute: created.targetRoute || undefined,
      createdAt: created.createdAt,
    };

    void this.redisService.publish(REALTIME_CHANNELS.NOTIFICATIONS, {
      notification: formattedForRealtime,
      targetUserId: created.userId,
      isBroadcast: created.isBroadcast,
    });

    // Déclencher l'envoi de notification push en tâche asynchrone non-bloquante avec vérification des préférences
    void (async () => {
      try {
        const pushTitle = created.titleFr || created.titleMg;
        const pushBody = created.messageFr || created.messageMg;
        const pushData: Record<string, unknown> = {
          notificationId: created.id,
          category: created.category,
          targetRoute: created.targetRoute || '/(tabs)/explore',
        };

        if (created.userId) {
          // Notification ciblée à un utilisateur précis (ex: défi, ami, commentaire, modération)
          const prefs = await this.getUserPreferences(created.userId);
          if (!prefs.enabled) {
            this.logger.log(
              `ℹ️ [Push] Notifications désactivées pour ${created.userId}, push ignoré.`,
            );
            return;
          }

          // Filtrage intelligent selon les préférences granulaires
          if (
            (created.category === 'community' || created.category === 'social') &&
            prefs.socialActivity === false
          ) {
            this.logger.log(
              `ℹ️ [Push] Préférence activité sociale désactivée pour ${created.userId}`,
            );
            return;
          }
          if (created.category === 'duel' && prefs.gameInvites === false) {
            this.logger.log(
              `ℹ️ [Push] Préférence défis jeu désactivée pour ${created.userId}`,
            );
            return;
          }
          if (created.category === 'game' && prefs.gameResults === false) {
            this.logger.log(
              `ℹ️ [Push] Préférence résultats parties désactivée pour ${created.userId}`,
            );
            return;
          }
          if (
            (created.category === 'contribution' || created.category === 'moderation') &&
            prefs.contributions === false
          ) {
            this.logger.log(
              `ℹ️ [Push] Préférence contributions désactivée pour ${created.userId}`,
            );
            return;
          }

          const targetUser = await this.prisma.user.findUnique({
            where: { id: created.userId },
            select: { pushToken: true },
          });

          if (targetUser?.pushToken) {
            await this.sendExpoPush(targetUser.pushToken, {
              title: pushTitle,
              body: pushBody,
              data: pushData,
            });
          }
        } else if (created.isBroadcast) {
          // Notification de diffusion générale : utilisateurs enregistrés + invités dans Redis
          const usersWithToken = await this.prisma.user.findMany({
            where: { pushToken: { not: null } },
            select: { pushToken: true },
          });

          const userTokens = (usersWithToken || [])
            .map((u) => u.pushToken)
            .filter((t): t is string => Boolean(t));

          const rawGuestTokens = await this.redisService.sMembers(
            'expo_push_tokens:guests',
          );
          const guestTokens = Array.isArray(rawGuestTokens)
            ? rawGuestTokens
            : [];

          // Fusionner et dédupliquer
          const allTokens = Array.from(
            new Set([...userTokens, ...guestTokens]),
          );

          if (allTokens.length > 0) {
            this.logger.log(
              `📢 [Expo Push] Diffusion broadcast vers ${allTokens.length} appareil(s) (${userTokens.length} inscrits, ${guestTokens.length} invités)`,
            );
            await this.sendExpoPush(allTokens, {
              title: pushTitle,
              body: pushBody,
              data: pushData,
            });
          }
        }
      } catch (pushErr) {
        this.logger.warn(
          '⚠️ [Expo Push] Échec envoi push automatique :',
          pushErr,
        );
      }
    })();

    return created;
  }

  /**
   * Marque une notification comme lue (sécurisé, ne modifie pas les notifications privées d'autres utilisateurs).
   */
  async markAsRead(id: string, userId?: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif) {
      return {
        success: true,
        message: `Notification ${id} introuvable en base de données (locale ou déjà supprimée)`,
      };
    }

    if (notif.userId && userId && notif.userId !== userId) {
      throw new ForbiddenException('Accès refusé à cette notification');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Marque toutes les notifications comme lues pour l'utilisateur connecté.
   */
  async markAllAsRead(userId?: string) {
    const whereClause: {
      isRead: boolean;
      OR?: Array<{ userId?: string; isBroadcast?: boolean }>;
    } = {
      isRead: false,
    };
    if (userId) {
      whereClause.OR = [{ userId }, { isBroadcast: true }];
    }

    const result = await this.prisma.notification.updateMany({
      where: whereClause,
      data: { isRead: true },
    });

    return { count: result.count, success: true };
  }

  /**
   * Supprime une notification de l'utilisateur (ou n'importe laquelle si rôle ADMIN).
   */
  async deleteNotification(id: string, userId?: string, role?: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif) {
      return {
        success: true,
        id,
        message: 'Notification déjà supprimée ou locale',
      };
    }

    const isAdmin = role?.toUpperCase() === 'ADMIN';
    if (!isAdmin && userId && notif.userId && notif.userId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres notifications',
      );
    }

    await this.prisma.notification.delete({ where: { id } });
    return { success: true, id };
  }

  /**
   * Supprime toutes les notifications de l'utilisateur connecté en base de données.
   * Empêche strictement toute purge globale par un simple utilisateur non-admin.
   */
  async clearAllNotifications(userId?: string, role?: string) {
    const isAdmin = role?.toUpperCase() === 'ADMIN';

    if (!userId && !isAdmin) {
      throw new ForbiddenException(
        'Action non autorisée sans authentification utilisateur.',
      );
    }

    // Si admin sans userId cible : purge globale explicite
    if (isAdmin && !userId) {
      const result = await this.prisma.notification.deleteMany();
      this.logger.log(
        `🧹 [Notifications] Suppression complète : ${result.count} notification(s) supprimée(s).`,
      );
      return { count: result.count, success: true };
    }

    // Suppression sécurisée des notifications privées de l'utilisateur
    const result = await this.prisma.notification.deleteMany({
      where: {
        userId: userId!,
      },
    });
    this.logger.log(
      `🧹 [Notifications] ${result.count} notification(s) supprimée(s) pour l'utilisateur ${userId}.`,
    );
    return { count: result.count, success: true };
  }

  /**
   * Supprime toutes les notifications en base de données (Administration uniquement).
   */
  async clearAllAdminNotifications() {
    const result = await this.prisma.notification.deleteMany();
    this.logger.log(
      `🧹 [Notifications] Suppression complète : ${result.count} notification(s) supprimée(s).`,
    );
    return { count: result.count, success: true };
  }

  /**
   * Récupère les préférences de notifications d'un utilisateur (avec fallback par défaut).
   */
  async getUserPreferences(userId: string): Promise<UserNotificationPreferences> {
    if (!userId) return { ...DEFAULT_USER_NOTIFICATION_PREFERENCES };
    try {
      const cached = await this.redisService.get<Partial<UserNotificationPreferences>>(
        `user_notif_prefs:${userId}`,
      );
      if (!cached) return { ...DEFAULT_USER_NOTIFICATION_PREFERENCES };
      return { ...DEFAULT_USER_NOTIFICATION_PREFERENCES, ...cached };
    } catch {
      return { ...DEFAULT_USER_NOTIFICATION_PREFERENCES };
    }
  }

  /**
   * Enregistre les préférences de notifications d'un utilisateur dans Redis.
   */
  async updateUserPreferences(userId: string, prefs: Record<string, unknown>) {
    if (!userId)
      return { success: false, message: 'Utilisateur non identifié' };
    try {
      const current = await this.getUserPreferences(userId);
      const updated: UserNotificationPreferences = {
        ...current,
        ...(prefs as any),
      };
      await this.redisService.set(`user_notif_prefs:${userId}`, updated);
      this.logger.log(
        `⚙️ [Notifications] Préférences mises à jour pour ${userId}`,
      );
      return { success: true, preferences: updated };
    } catch (err) {
      this.logger.warn(
        `⚠️ [Notifications] Erreur mise à jour préférences pour ${userId} :`,
        err,
      );
      return { success: false };
    }
  }

  /**
   * Récupère les alertes opérationnelles et de modération destinées au CRM administrateur.
   */
  async getAdminAlerts(): Promise<{
    alerts: AdminAlertItem[];
    pendingReportsCount: number;
    pendingContributionsCount: number;
    flaggedContributionsCount: number;
    totalUnresolved: number;
  }> {
    // 1. Signalements de contenu non résolus
    const reports = await this.prisma.contentReport.findMany({
      where: { resolved: false },
      include: {
        user: { select: { id: true, name: true } },
        contribution: { select: { id: true, textMg: true } },
        comment: { select: { id: true, content: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // 2. Contributions en attente de modération ou marquées par le filtre de grossièretés
    const pendingContributions = await this.prisma.contribution.findMany({
      where: {
        OR: [
          { status: ContributionStatus.PENDING_REVIEW },
          { moderationFlagged: true },
        ],
      },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // 3. Litiges de doublons en attente
    const disputedContributions = await this.prisma.contribution.findMany({
      where: { disputeStatus: DisputeStatus.PENDING },
      include: {
        user: { select: { id: true, name: true } },
      },
      take: 10,
    });

    const alerts: AdminAlertItem[] = [];

    for (const r of reports) {
      alerts.push({
        id: `report-${r.id}`,
        type: 'REPORT_PENDING',
        title: `Signalement de contenu (${r.reason})`,
        description:
          r.description || `Signalé par ${r.user?.name || 'un utilisateur'}.`,
        priority: 'high',
        category: 'moderation',
        createdAt: r.createdAt,
        resourceId: r.contributionId || r.commentId || r.itemId || undefined,
        targetRoute: r.contributionId
          ? `/contributions?id=${r.contributionId}`
          : '/contributions',
        status: 'open',
      });
    }

    for (const c of pendingContributions) {
      const isFlagged = c.moderationFlagged;
      const authorName = (c as any).user?.name || 'Auteur';
      alerts.push({
        id: `contrib-${c.id}`,
        type: isFlagged ? 'FLAGGED_CONTENT' : 'PENDING_CONTRIBUTION',
        title: isFlagged
          ? `Alerte Filtre : Contribution de ${authorName}`
          : `Nouvelle proposition : ${c.category}`,
        description: c.textMg.slice(0, 80) + '...',
        priority: isFlagged ? 'critical' : 'medium',
        category: 'contribution',
        createdAt: c.createdAt,
        resourceId: c.id,
        targetRoute: `/contributions?id=${c.id}`,
        status: isFlagged ? 'in_review' : 'open',
      });
    }

    for (const d of disputedContributions) {
      const authorName = (d as any).user?.name || 'Auteur';
      alerts.push({
        id: `dispute-${d.id}`,
        type: 'DUPLICATE_DISPUTE',
        title: `Recours doublon : ${authorName}`,
        description:
          d.disputeMessage || 'Contestation du marquage comme doublon.',
        priority: 'medium',
        category: 'dispute',
        createdAt: d.disputedAt || d.createdAt,
        resourceId: d.id,
        targetRoute: `/contributions?id=${d.id}`,
        status: 'open',
      });
    }

    const priorityRank: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };
    alerts.sort((a, b) => {
      const pDiff = priorityRank[b.priority] - priorityRank[a.priority];
      if (pDiff !== 0) return pDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const pendingReportsCount = reports.length;
    const pendingContributionsCount = pendingContributions.filter(
      (c) => c.status === ContributionStatus.PENDING_REVIEW,
    ).length;
    const flaggedContributionsCount = pendingContributions.filter(
      (c) => c.moderationFlagged,
    ).length;

    return {
      alerts,
      pendingReportsCount,
      pendingContributionsCount,
      flaggedContributionsCount,
      totalUnresolved: alerts.length,
    };
  }
}
