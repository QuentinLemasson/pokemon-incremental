import type { BiomeConfig } from '../types/biome.types';

export const VOLCANIC_CRATER_BIOME: BiomeConfig = {
  id: 'volcanic-crater',
  name: 'Volcanic Crater',
  type: 'MOUNTAIN',
  color: '#8B0000',
  encounterPool: {
    COMMON: [
      {
        pokemonId: 'slugma',
      },
      {
        pokemonId: 'numel',
      },
      {
        pokemonId: 'torkoal',
      },
      {
        pokemonId: 'heatmor',
      },
    ],
    UNCOMMON: [
      {
        pokemonId: 'magcargo',
      },
      {
        pokemonId: 'camerupt',
      },
    ],
    RARE: [
      {
        pokemonId: 'magmortar',
      },
    ],
  },
  clearTreshold: 15,
  travelThreshold: 8,
  levelRange: {
    min: 10,
    max: 15,
  },
  rarityLevelBonus: {
    COMMON: 0,
    UNCOMMON: 4,
    RARE: 7,
  },
};
