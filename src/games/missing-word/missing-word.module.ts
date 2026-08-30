import { Module } from '@nestjs/common';
import { MissingWordService } from './missing-word.service.js';
import { MissingWordController } from './missing-word.controller.js';
import { AdminMissingWordController } from './admin-missing-word.controller.js';

@Module({
  controllers: [MissingWordController, AdminMissingWordController],
  providers: [MissingWordService],
  exports: [MissingWordService],
})
export class MissingWordModule {}
