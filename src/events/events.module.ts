import { Module } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventsController } from './events.controller.js';
import { EventLifecycleScheduler } from './scheduler/event-lifecycle.scheduler.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';
import { ProgressionModule } from '../progression/progression.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { BadgesModule } from '../badges/badges.module.js';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    ProgressionModule,
    NotificationsModule,
    BadgesModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, EventLifecycleScheduler],
  exports: [EventsService],
})
export class EventsModule {}
