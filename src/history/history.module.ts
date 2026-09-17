import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller.js';
import { AdminHistoryController } from './admin-history.controller.js';
import { HistoryService } from './history.service.js';
import { IntegrationsModule } from '../integrations/integrations.module.js';

@Module({
  imports: [IntegrationsModule],
  controllers: [HistoryController, AdminHistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
