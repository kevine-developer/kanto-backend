import { Module } from '@nestjs/common';
import { ContributionsController } from './contributions.controller.js';
import { ContributionsService } from './contributions.service.js';
import { DuplicateDetectionService } from './duplicate-detection.service.js';
import { ContentModerationService } from './moderation/content-moderation.service.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [NotificationsModule],
  controllers: [ContributionsController],
  providers: [
    ContributionsService,
    DuplicateDetectionService,
    ContentModerationService,
  ],
  exports: [
    ContributionsService,
    DuplicateDetectionService,
    ContentModerationService,
  ],
})
export class ContributionsModule {}
