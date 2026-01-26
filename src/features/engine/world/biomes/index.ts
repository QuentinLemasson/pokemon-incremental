import { VERDANT_FOREST_BIOME } from './verdant-forest.biome';
import { WINDSTREW_PLAINS_BIOME } from './windswept-plains.biome';
import { CANARO_MOUNTAINS_BIOME } from './canaro-mountains.biome';
import { SCORCHED_DESERT_BIOME } from './scorched-desert.biome';
import { MISTY_SWAMP_BIOME } from './misty-swamp.biome';
import { VOLCANIC_CRATER_BIOME } from './volcanic-crater.biome';
import type { BiomeConfig } from '../types';

export const BIOMES: Record<string, BiomeConfig> = {
  [VERDANT_FOREST_BIOME.id]: VERDANT_FOREST_BIOME,
  [WINDSTREW_PLAINS_BIOME.id]: WINDSTREW_PLAINS_BIOME,
  [CANARO_MOUNTAINS_BIOME.id]: CANARO_MOUNTAINS_BIOME,
  [SCORCHED_DESERT_BIOME.id]: SCORCHED_DESERT_BIOME,
  [MISTY_SWAMP_BIOME.id]: MISTY_SWAMP_BIOME,
  [VOLCANIC_CRATER_BIOME.id]: VOLCANIC_CRATER_BIOME,
};

export const BIOME_IDS: string[] = Object.keys(BIOMES);

export type BiomeId = (typeof BIOME_IDS)[number];
