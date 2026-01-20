import { VERDANT_FOREST_BIOME } from './verdant-forest.biome';
import { WINDSTREW_PLAINS_BIOME } from './windswept-plains.biome';
import { CANARO_MOUNTAINS_BIOME } from './canaro-mountains.biome';
import type { BiomeConfig } from '../types';

export const BIOMES: Record<string, BiomeConfig> = {
  [VERDANT_FOREST_BIOME.id]: VERDANT_FOREST_BIOME,
  [WINDSTREW_PLAINS_BIOME.id]: WINDSTREW_PLAINS_BIOME,
  [CANARO_MOUNTAINS_BIOME.id]: CANARO_MOUNTAINS_BIOME,
};

export const BIOME_IDS: string[] = Object.keys(BIOMES);

export type BiomeId = (typeof BIOME_IDS)[number];
