import { Global, Module } from '@nestjs/common';
import { ModerationService } from './moderation.service.js';
import { ModerationController } from './moderation.controller.js';
import { ContentModerationService } from './content-moderation.service.js';
import { PrismaModule } from '../../infrastructure/database/prisma.module.js';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [ModerationController],
  providers: [ModerationService, ContentModerationService],
  exports: [ModerationService, ContentModerationService],
})
export class ModerationModule {}
