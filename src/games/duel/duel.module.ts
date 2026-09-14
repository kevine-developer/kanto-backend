import { Module } from '@nestjs/common';
import { MultiplayerModule } from '../multiplayer/multiplayer.module.js';
import { MultiplayerService } from '../multiplayer/multiplayer.service.js';
import { DuelService } from './duel.service.js';

@Module({
  imports: [MultiplayerModule],
  providers: [
    {
      provide: DuelService,
      useExisting: MultiplayerService,
    },
  ],
  exports: [DuelService, MultiplayerModule],
})
export class DuelModule {}
