import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateNotificationDto } from './dto/notifications.dto.js';

export interface FormattedNotificationItem {
  id: string;
  category: string;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: number;
  iconName: string;
  iconColor: string;
  badgeText?: string;
  badgeType?: string;
  badgeColor?: string;
  read: boolean;
  targetRoute?: string;
  createdAt: Date;
}

export interface FormattedNotificationGroup {
  date: string;
  notifications: FormattedNotificationItem[];
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère les notifications pour l'application mobile, groupées par date.
   * Ne renvoie strictement que les données réelles présentes en base de données.
   */
  async getPublicNotifications(language: 'mg' | 'fr' = 'mg'): Promise<{
    groups: FormattedNotificationGroup[];
    unreadCount: number;
    totalCount: number;
  }> {
    const notifs = await this.prisma.notification.findMany({
      where: { isBroadcast: true },
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

      const formatted: FormattedNotificationItem = {
        id: notif.id,
        category: notif.category,
        title: isMg ? notif.titleMg : notif.titleFr || notif.titleMg,
        description: isMg
          ? notif.messageMg
          : notif.messageFr || notif.messageMg,
        timeAgo,
        timestamp: notif.createdAt.getTime(),
        iconName: notif.iconName || 'notifications-outline',
        iconColor: notif.iconColor || '#C0392B',
        badgeText: notif.badgeText || undefined,
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
   * Crée une nouvelle notification (Admin).
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
      `📢 [Notifications] Nouvelle notification diffusée : "${created.titleMg}" (${created.category})`,
    );
    return created;
  }

  /**
   * Marque une notification comme lue.
   */
  async markAsRead(id: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif) {
      throw new NotFoundException(`Notification ${id} introuvable`);
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
   * Supprime une notification.
   */
  async deleteNotification(id: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif) {
      throw new NotFoundException(`Notification ${id} introuvable`);
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
