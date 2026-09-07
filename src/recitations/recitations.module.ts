import { Module } from '@nestjs/common';
import { RecitationsController } from './recitations.controller.js';
import { RecitationsService } from './recitations.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [RecitationsController],
  providers: [RecitationsService],
  exports: [RecitationsService],
})
export class RecitationModule {}
