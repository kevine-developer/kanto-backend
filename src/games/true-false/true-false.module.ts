import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { RedisModule } from '../../redis/redis.module.js';
import { AdminTrueFalseController } from './admin-true-false.controller.js';
import { TrueFalseController } from './true-false.controller.js';
import { TrueFalseService } from './true-false.service.js';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [TrueFalseController, AdminTrueFalseController],
  providers: [TrueFalseService],
  exports: [TrueFalseService],
})
export class TrueFalseModule {}
