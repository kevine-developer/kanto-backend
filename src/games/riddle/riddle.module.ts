import { Module } from '@nestjs/common';
import { RiddleService } from './riddle.service.js';
import { RiddleController } from './riddle.controller.js';

@Module({
  providers: [RiddleService],
  controllers: [RiddleController],
})
export class RiddleModule {}
