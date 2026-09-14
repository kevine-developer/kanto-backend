import { Module } from '@nestjs/common';
import { AstrologyController } from './astrology.controller.js';
import { AstrologyService } from './astrology.service.js';

@Module({
  controllers: [AstrologyController],
  providers: [AstrologyService],
  exports: [AstrologyService],
})
export class AstrologyModule {}
