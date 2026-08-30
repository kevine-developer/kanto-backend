import { Module } from '@nestjs/common';
import { ContesController } from './contes.controller.js';
import { ContesService } from './contes.service.js';
import { ContesAudioService } from './contes-audio.service.js';

@Module({
  controllers: [ContesController],
  providers: [ContesService, ContesAudioService],
  exports: [ContesService, ContesAudioService],
})
export class ContesModule {}
