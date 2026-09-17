import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateNotificationDto } from './dto/notifications.dto.js';
import { RedisService } from '../redis/redis.service.js';
import { REALTIME_CHANNELS } from '../realtime/realtime.constants.js';

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
  if (!rawBadge) return { activeBadge: undefined, badgeFr: undefined, badgeMg: undefined };
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
  } else if (lower === 'badge' || lower === 'mari-boninahitra' || lower === 'medaly') {
    badgeFr = 'Badge';
    badgeMg = 'Mari-boninahitra';
  } else if (lower === 'hevitra' || lower === 'commentaire') {
    badgeFr = 'Commentaire';
    badgeMg = 'Hevitra';
  }

  return {
    badgeFr,
    badgeMg,
    activeBadge: isMg ? badgeMg : badgeFr,
  };
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
   * Ne renvoie strictement que les données réelles présentes en base de données.
   */
  async getPublicNotifications(
    language: 'mg' | 'fr' = 'mg',
    userId?: string,
  ): Promise<{
    groups: FormattedNotificationGroup[];
    unreadCount: number;
    totalCount: number;
  }> {
    const notifs = await this.prisma.notification.findMany({
      where: {
        OR: [{ isBroadcast: true }, ...(userId ? [{ userId }] : [])],
      },
      orderBy: { createdAt: 'desc' },
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
        title: isMg ? notif.titleMg : (notif.titleFr || notif.titleMg),
        titleMg: notif.titleMg,
        titleFr: notif.titleFr || notif.titleMg,
        description: isMg
          ? notif.messageMg
          : (notif.messageFr || notif.messageMg),
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
   * Enregistre ou met à jour le token Expo Push d'un utilisateur.
   */
  async registerPushToken(userId: string, pushToken: string) {
    if (!userId || !pushToken)
      return { success: false, message: 'Paramètres manquants' };

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { pushToken: pushToken.trim() },
      });
      this.logger.log(
        `📱 [Push] Token Expo enregistré pour l'utilisateur ${userId}`,
      );
      return { success: true, message: 'Token push enregistré avec succès' };
    } catch (err) {
      this.logger.warn(
        `⚠️ [Push] Échec enregistrement token pour ${userId} :`,
        err,
      );
      return { success: false, message: 'Erreur enregistrement token' };
    }
  }

  /**
   * Envoie des notifications push via le service officiel Expo Push.
   * Accepte un token unique ou un tableau de tokens.
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

    const messages = validTokens.map((to) => ({
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
          `⚠️ [Expo Push] Réponse API Expo non-OK (${response.status}) : ${errorText}`,
        );
      } else {
        this.logger.log(
          `🚀 [Expo Push] ${validTokens.length} notification(s) push transmise(s) avec succès.`,
        );
      }
    } catch (err) {
      this.logger.error(
        `❌ [Expo Push] Erreur lors de l'appel HTTP vers Expo :`,
        err,
      );
    }
  }

  /**
   * Crée une nouvelle notification (Admin ou système) et envoie la notification push associée.
   */
  async createNotification(dto: CreateNotificationDto) {
    const created = await this.prisma.notification.create({
      data: {
        titleMg: dto.titleMg.trim(),
        titleFr: dto.titleFr?.trim() || null,
        messageMg: dto.messageMg.trim(),
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

    // Déclencher l'envoi de notification push en tâche asynchrone non-bloquante
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
          // Notification ciblée à un utilisateur précis (ex: auteur d'une contribution commentée)
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
          // Notification de diffusion générale à tous les utilisateurs enregistrés avec un push token
          const usersWithToken = await this.prisma.user.findMany({
            where: { pushToken: { not: null } },
            select: { pushToken: true },
          });

          const tokens = usersWithToken
            .map((u) => u.pushToken)
            .filter((t): t is string => Boolean(t));

          if (tokens.length > 0) {
            await this.sendExpoPush(tokens, {
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
   * Marque une notification comme lue (idempotent, ne plante pas si inexistante).
   */
  async markAsRead(id: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif) {
      return {
        success: true,
        message: `Notification ${id} introuvable en base de données (locale ou déjà supprimée)`,
      };
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Marque toutes les notifications comme lues.
   */
  async markAllAsRead() {
    const result = await this.prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    return { count: result.count, success: true };
  }

  /**
   * Supprime une notification (idempotent, ne plante pas si inexistante).
   */
  async deleteNotification(id: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif) {
      return {
        success: true,
        id,
        message: 'Notification déjà supprimée ou locale',
      };
    }

    await this.prisma.notification.delete({ where: { id } });
    return { success: true, id };
  }

  /**
   * Supprime toutes les notifications en base de données.
   */
  async clearAllNotifications() {
    const result = await this.prisma.notification.deleteMany();
    this.logger.log(
      `🧹 [Notifications] Suppression complète : ${result.count} notification(s) supprimée(s).`,
    );
    return { count: result.count, success: true };
  }
}
