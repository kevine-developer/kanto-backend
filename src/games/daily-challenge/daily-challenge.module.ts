import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { RedisModule } from '../../redis/redis.module.js';
import { DailyChallengeController } from './daily-challenge.controller.js';
import { DailyChallengeService } from './daily-challenge.service.js';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [DailyChallengeController],
  providers: [DailyChallengeService],
  exports: [DailyChallengeService],
})
export class DailyChallengeModule {}

