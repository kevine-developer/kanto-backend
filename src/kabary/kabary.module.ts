import { Module } from '@nestjs/common';
import { KabaryController } from './kabary.controller.js';
import { KabaryService } from './kabary.service.js';

@Module({
  controllers: [KabaryController],
  providers: [KabaryService],
  exports: [KabaryService],
})
export class KabaryModule {}
