import { Module } from '@nestjs/common';
import { CivicController } from './civic.controller.js';
import { CivicService } from './civic.service.js';
import { CivicQuizController } from './civic-quiz.controller.js';
import { CivicQuizService } from './civic-quiz.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [CivicController, CivicQuizController],
  providers: [CivicService, CivicQuizService],
  exports: [CivicService, CivicQuizService],
})
export class CivicModule {}
