import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { ContentSourceService } from './content-source.service.js';
import { ContentWizardController } from './content-wizard.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [ContentWizardController],
  providers: [ContentSourceService],
  exports: [ContentSourceService],
})
export class ContentWizardModule {}
