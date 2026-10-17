import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller.js';
import { AdminUsersService } from './admin-users.service.js';
import { AdminSystemController } from './admin-system.controller.js';
import { AdminCoinsController } from './admin-coins.controller.js';
import { AdminLegalController } from './admin-legal.controller.js';
import { AdminDecksController } from './admin-decks.controller.js';
import { UserQuizModule } from '../user-quiz/user-quiz.module.js';

import { AdminStatsController } from './admin-stats.controller.js';
import { AdminAuditService } from './admin-audit.service.js';

@Module({
  imports: [UserQuizModule],
  controllers: [
    AdminUsersController,
    AdminSystemController,
    AdminCoinsController,
    AdminLegalController,
    AdminDecksController,
    AdminStatsController,
  ],
  providers: [AdminUsersService, AdminAuditService],
  exports: [AdminUsersService, AdminAuditService],
})
export class AdminModule {}

