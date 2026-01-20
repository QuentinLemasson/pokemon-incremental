import type { BiomeConfig } from '../types/biome.types';

export const CANARO_MOUNTAINS_BIOME: BiomeConfig = {
  id: 'canaro-mountains',
  name: 'Canaro Mountains',
  type: 'MOUNTAIN',
  color: '#B8A038',
  encounterPool: {
    COMMON: [
      {
        pokemonId: 'machoc',
      },
      {
        pokemonId: 'selutin',
      },
      {
        pokemonId: 'furaiglon',
      },
      {
        pokemonId: 'khelocrok',
      },
    ],
    UNCOMMON: [
      {
        pokemonId: 'cabriolaine',
      },
      {
        pokemonId: 'nodulithe',
      },
    ],
    RARE: [
      {
        pokemonId: 'airmure',
      },
    ],
  },
  clearTreshold: 10,
  travelThreshold: 5,
  levelRange: {
    min: 6,
    max: 10,
  },
  levelRarityAddition: {
    COMMON: 0,
    UNCOMMON: 2,
    RARE: 5,
  },
};
