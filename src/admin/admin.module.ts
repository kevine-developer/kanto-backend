import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller.js';
import { AdminUsersService } from './admin-users.service.js';
import { AdminSystemController } from './admin-system.controller.js';

@Module({
  controllers: [AdminUsersController, AdminSystemController],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminModule {}
