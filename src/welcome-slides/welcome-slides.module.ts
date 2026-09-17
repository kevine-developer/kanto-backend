import { Module } from '@nestjs/common';
import { WelcomeSlidesService } from './welcome-slides.service.js';
import { WelcomeSlidesController } from './welcome-slides.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [WelcomeSlidesController],
  providers: [WelcomeSlidesService],
  exports: [WelcomeSlidesService],
})
export class WelcomeSlidesModule {}
