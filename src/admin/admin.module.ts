import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller.js';
import { AdminUsersService } from './admin-users.service.js';
import { AdminSystemController } from './admin-system.controller.js';
import { AdminCoinsController } from './admin-coins.controller.js';

@Module({
  controllers: [
    AdminUsersController,
    AdminSystemController,
    AdminCoinsController,
  ],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminModule {}
