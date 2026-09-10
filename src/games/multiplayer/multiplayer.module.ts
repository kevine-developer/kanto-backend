import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { RedisModule } from '../../redis/redis.module.js';
import { MultiplayerController } from './multiplayer.controller.js';
import { MultiplayerService } from './multiplayer.service.js';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [MultiplayerController],
  providers: [MultiplayerService],
  exports: [MultiplayerService],
})
export class MultiplayerModule {}
