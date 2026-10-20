import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service.js';
import { ReferralController } from './referral.controller.js';
import { ReferralRecoveryScheduler } from './scheduler/referral-recovery.scheduler.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';
import { ProgressionModule } from '../progression/progression.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [PrismaModule, RedisModule, ProgressionModule, NotificationsModule],
  controllers: [ReferralController],
  providers: [ReferralService, ReferralRecoveryScheduler],
  exports: [ReferralService, ReferralRecoveryScheduler],
})
export class ReferralModule {}
