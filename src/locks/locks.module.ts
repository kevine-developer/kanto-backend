import { Module } from '@nestjs/common';
import { LocksController } from './locks.controller.js';
import { AdminLocksController } from './admin-locks.controller.js';
import { LocksService } from './locks.service.js';

@Module({
  controllers: [LocksController, AdminLocksController],
  providers: [LocksService],
  exports: [LocksService],
})
export class LocksModule {}
