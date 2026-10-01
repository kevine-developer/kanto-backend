import { Module } from '@nestjs/common';
import { UserQuizService } from './user-quiz.service.js';
import { UserQuizController } from './user-quiz.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [UserQuizController],
  providers: [UserQuizService],
  exports: [UserQuizService],
})
export class UserQuizModule {}
