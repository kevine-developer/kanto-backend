import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { EventNotificationService } from './event-notification.service.js';
import { VipExpirationScheduler } from './scheduler/vip-expiration.scheduler.js';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    EventNotificationService,
    VipExpirationScheduler,
  ],
  exports: [
    NotificationsService,
    EventNotificationService,
    VipExpirationScheduler,
  ],
})
export class NotificationsModule {}
