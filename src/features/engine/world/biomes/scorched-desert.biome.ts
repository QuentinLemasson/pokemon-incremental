import type { BiomeConfig } from '../types/biome.types';

export const SCORCHED_DESERT_BIOME: BiomeConfig = {
  id: 'scorched-desert',
  name: 'Scorched Desert',
  type: 'PLAINS',
  color: '#D4A574',
  encounterPool: {
    COMMON: [
      {
        pokemonId: 'sandshrew',
      },
      {
        pokemonId: 'trapinch',
      },
      {
        pokemonId: 'cacnea',
      },
      {
        pokemonId: 'hippopotas',
      },
    ],
    UNCOMMON: [
      {
        pokemonId: 'sandslash',
      },
      {
        pokemonId: 'maractus',
      },
    ],
    RARE: [
      {
        pokemonId: 'garchomp',
      },
    ],
  },
  clearTreshold: 12,
  travelThreshold: 6,
  levelRange: {
    min: 8,
    max: 12,
  },
  rarityLevelBonus: {
    COMMON: 0,
    UNCOMMON: 3,
    RARE: 6,
  },
};
