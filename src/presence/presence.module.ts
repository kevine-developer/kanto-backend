import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';
import { PresenceService } from './presence.service.js';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}
