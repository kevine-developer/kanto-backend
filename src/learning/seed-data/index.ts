import { SeedTrack } from './seed.types.js';
import { fundamentalsTrack } from './fundamentals.track.js';
import { wisdomTrack } from './wisdom.track.js';
import { traditionsTrack } from './traditions.track.js';
import { historyTrack } from './history.track.js';
import { dialectsTrack } from './dialects.track.js';
import { hiddenTreasuresTrack } from './hidden-treasures.track.js';
import { philosophyTrack } from './philosophy.track.js';
import { diasporaTrack } from './diaspora.track.js';
import { biodiversityTrack } from './biodiversity.track.js';
import { folkloreAnganoTrack } from './folklore-angano.track.js';
import { geographyTrack } from './geography.track.js';
import { civicsInstitutionsTrack } from './civics-institutions.track.js';
import { medicinalPlantsTrack } from './medicinal-plants.track.js';
import { heritageRepublicainTrack } from './heritage-republicain.track.js';

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
  biodiversityTrack,
  folkloreAnganoTrack,
  geographyTrack,
  civicsInstitutionsTrack,
  medicinalPlantsTrack,
  heritageRepublicainTrack,
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
  biodiversityTrack,
  folkloreAnganoTrack,
  geographyTrack,
  civicsInstitutionsTrack,
  medicinalPlantsTrack,
  heritageRepublicainTrack,
];
