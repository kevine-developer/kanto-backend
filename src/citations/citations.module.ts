import { Module } from '@nestjs/common';
import { CitationsController } from './citations.controller.js';
import { CitationsService } from './citations.service.js';

@Module({
  controllers: [CitationsController],
  providers: [CitationsService],
  exports: [CitationsService],
})
export class CitationsModule {}
