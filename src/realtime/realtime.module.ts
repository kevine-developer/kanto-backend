import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway.js';
import { DuelModule } from '../games/duel/duel.module.js';
import { MultiplayerModule } from '../games/multiplayer/multiplayer.module.js';
import { PresenceModule } from '../presence/presence.module.js';

@Module({
  imports: [DuelModule, MultiplayerModule, PresenceModule],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
