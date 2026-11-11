import { Module } from '@nestjs/common';
import { LearningController } from './learning.controller.js';
import { AdminLearningController } from './admin-learning.controller.js';
import { LearningService } from './learning.service.js';

@Module({
  controllers: [LearningController, AdminLearningController],
  providers: [LearningService],
  exports: [LearningService],
})
export class LearningModule {}
