import { Module } from '@nestjs/common';
import { ContributionsController } from './contributions.controller.js';
import { ContributionsService } from './contributions.service.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [NotificationsModule],
  controllers: [ContributionsController],
  providers: [ContributionsService],
})
export class ContributionsModule {}
