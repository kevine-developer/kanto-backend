import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { NotificationsService } from '../../notifications/notifications.service.js';
import { EventStatus } from '../../../generated/prisma/client.js';

@Injectable()
export class EventLifecycleScheduler {
  private readonly logger = new Logger(EventLifecycleScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Tâche d'arrière-plan exécutée toutes les 15 minutes.
   * Gère les transitions automatiques de cycle de vie (Activation, Clôture)
   * et les rappels aux participants inscrits.
   */
  @Cron('*/15 * * * *', { name: 'event-lifecycle-check', timeZone: 'UTC' })
  async handleLifecycleCron(): Promise<void> {
    const lockKey = 'scheduler_lock:event_lifecycle';
    const acquired = await this.redisService.set(lockKey, 'locked', 600); // 10 minutes
    if (!acquired) {
      this.logger.debug(
        '⏳ [EventScheduler] Un autre nœud traite déjà le cycle de vie des événements.',
      );
      return;
    }

    try {
      await this.activateScheduledEvents();
      await this.completeFinishedEvents();
      await this.sendUpcomingReminders();
    } catch (err: unknown) {
      this.logger.error(
        `❌ [EventScheduler] Erreur cycle de vie : ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      await this.redisService.del(lockKey);
    }
  }

  /**
   * 1. Active les événements planifiés arrivés à date de début.
   */
  private async activateScheduledEvents(): Promise<number> {
    const now = new Date();
    const toActivate = await this.prisma.event.findMany({
      where: {
        status: EventStatus.SCHEDULED,
        startDate: { lte: now },
      },
      include: {
        participations: { select: { userId: true } },
      },
    });

    for (const event of toActivate) {
      await this.prisma.event.update({
        where: { id: event.id },
        data: { status: EventStatus.ACTIVE },
      });

      this.logger.log(
        `🚀 [EventScheduler] Événement activé automatiquement : ${event.id} (${event.slug})`,
      );

      // Notification de démarrage aux inscrits
      for (const p of event.participations) {
        try {
          await this.notificationsService.createNotification({
            userId: p.userId,
            titleMg: 'Nanomboka ny hetsika !',
            titleFr: 'L’événement vient de commencer !',
            messageMg: `Efa misokatra izao ny hetsika "${event.titleMg}". Midira handray anjara !`,
            messageFr: `L'événement "${event.titleFr}" est désormais ouvert. Rejoignez le défi dès maintenant !`,
            category: 'game',
            badgeText: 'Nanomboka',
            badgeType: 'new',
            iconName: 'play-outline',
            iconColor: '#4A6741',
            targetRoute: `/(screens)/events/${event.id}`,
            isBroadcast: false,
          });
        } catch {}
      }
    }

    return toActivate.length;
  }

  /**
   * 2. Clôture les événements actifs arrivés à date de fin.
   */
  private async completeFinishedEvents(): Promise<number> {
    const now = new Date();
    const toComplete = await this.prisma.event.findMany({
      where: {
        status: EventStatus.ACTIVE,
        endDate: { lte: now },
      },
    });

    for (const event of toComplete) {
      await this.prisma.event.update({
        where: { id: event.id },
        data: { status: EventStatus.COMPLETED },
      });

      this.logger.log(
        `🏁 [EventScheduler] Événement clôturé automatiquement : ${event.id} (${event.slug})`,
      );
    }

    return toComplete.length;
  }

  /**
   * 3. Rappel préventif 24h avant le début aux inscrits.
   */
  private async sendUpcomingReminders(): Promise<void> {
    const now = new Date();
    const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const upcomingEvents = await this.prisma.event.findMany({
      where: {
        status: { in: [EventStatus.PUBLISHED, EventStatus.SCHEDULED] },
        startDate: { gt: now, lte: in24h },
      },
      include: {
        participations: { select: { userId: true } },
      },
    });

    for (const event of upcomingEvents) {
      const metadata = (event.metadata as any) || {};
      if (metadata.reminder24hSent) continue;

      for (const p of event.participations) {
        try {
          await this.notificationsService.createNotification({
            userId: p.userId,
            titleMg: 'Hetsika manomboka rahampitso !',
            titleFr: 'Événement demain !',
            messageMg: `Rahampitso no manomboka ny hetsika "${event.titleMg}". Miomana !`,
            messageFr: `L'événement "${event.titleFr}" commence dans moins de 24h. Tenez-vous prêt !`,
            category: 'community',
            badgeText: 'Rahampitso',
            badgeType: 'info',
            iconName: 'time-outline',
            iconColor: '#C58B38',
            targetRoute: `/(screens)/events/${event.id}`,
            isBroadcast: false,
          });
        } catch {}
      }

      await this.prisma.event.update({
        where: { id: event.id },
        data: {
          metadata: { ...metadata, reminder24hSent: true },
        },
      });
    }
  }
}
