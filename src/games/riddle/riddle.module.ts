import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { RedisModule } from '../../redis/redis.module.js';
import { RiddleService } from './riddle.service.js';
import { RiddleController } from './riddle.controller.js';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [RiddleService],
  controllers: [RiddleController],
  exports: [RiddleService],
})
export class RiddleModule {}
