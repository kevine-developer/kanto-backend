import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller.js';
import { AdminUsersService } from './admin-users.service.js';
import { AdminSystemController } from './admin-system.controller.js';
import { AdminCoinsController } from './admin-coins.controller.js';
import { AdminLegalController } from './admin-legal.controller.js';
import { AdminDecksController } from './admin-decks.controller.js';
import { UserQuizModule } from '../user-quiz/user-quiz.module.js';

@Module({
  imports: [UserQuizModule],
  controllers: [
    AdminUsersController,
    AdminSystemController,
    AdminCoinsController,
    AdminLegalController,
    AdminDecksController,
  ],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminModule {}
