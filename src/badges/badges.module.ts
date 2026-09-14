import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { BadgesController } from './badges.controller.js';
import { BadgesService } from './badges.service.js';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}
