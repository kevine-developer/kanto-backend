import { SeedTrack } from './seed.types.js';
import { fundamentalsTrack } from './fundamentals.track.js';
import { wisdomTrack } from './wisdom.track.js';
import { traditionsTrack } from './traditions.track.js';
import { historyTrack } from './history.track.js';
import { dialectsTrack } from './dialects.track.js';
import { hiddenTreasuresTrack } from './hidden-treasures.track.js';
import { philosophyTrack } from './philosophy.track.js';
import { diasporaTrack } from './diaspora.track.js';

export * from './seed.types.js';
export {
  fundamentalsTrack,
  wisdomTrack,
  traditionsTrack,
  historyTrack,
  dialectsTrack,
  hiddenTreasuresTrack,
  philosophyTrack,
  diasporaTrack,
};

export const SEED_LEARNING_TRACKS: SeedTrack[] = [
  fundamentalsTrack,
  wisdomTrack,
  traditionsTrack,
  historyTrack,
  dialectsTrack,
  hiddenTreasuresTrack,
  philosophyTrack,
  diasporaTrack,
];
