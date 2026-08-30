import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller.js';
import { ItemsService } from './items.service.js';
import { DailyItemsService } from './daily-items.service.js';
import { ItemsInteractionService } from './items-interaction.service.js';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, DailyItemsService, ItemsInteractionService],
  exports: [ItemsService, DailyItemsService, ItemsInteractionService],
})
export class ItemsModule {}
