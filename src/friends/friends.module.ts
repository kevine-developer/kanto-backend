import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service.js';
import { FriendsController } from './friends.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ProgressionModule } from '../progression/progression.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [PrismaModule, ProgressionModule, NotificationsModule],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
