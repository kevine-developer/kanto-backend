import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { RedisModule } from '../../redis/redis.module.js';
import { NotificationsModule } from '../../notifications/notifications.module.js';
import { MultiplayerController } from './multiplayer.controller.js';
import { MultiplayerService } from './multiplayer.service.js';

@Module({
  imports: [PrismaModule, RedisModule, forwardRef(() => NotificationsModule)],
  controllers: [MultiplayerController],
  providers: [MultiplayerService],
  exports: [MultiplayerService],
})
export class MultiplayerModule {}
