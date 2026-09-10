import { Injectable } from '@nestjs/common';
import {
  MultiplayerService,
  type PublicMultiplayerQuestion,
  type MultiplayerPlayerPublic,
} from '../multiplayer/multiplayer.service.js';

export { MultiplayerService };
export type { PublicMultiplayerQuestion, MultiplayerPlayerPublic };

export type PublicDuelQuestion = PublicMultiplayerQuestion;
export type DuelPlayerPublic = MultiplayerPlayerPublic;

@Injectable()
export class DuelService extends MultiplayerService {}
