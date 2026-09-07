import { Module } from '@nestjs/common';
import { PoesiesController } from './poesies.controller.js';
import { PoesiesService } from './poesies.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [PoesiesController],
  providers: [PoesiesService],
  exports: [PoesiesService],
})
export class PoesiesModule {}
