import { Module } from '@nestjs/common';
import { MultiplayerModule } from '../multiplayer/multiplayer.module.js';

@Module({
  imports: [MultiplayerModule],
  exports: [MultiplayerModule],
})
export class DuelModule {}
