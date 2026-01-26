import type { BiomeConfig } from '../types/biome.types';

export const MISTY_SWAMP_BIOME: BiomeConfig = {
  id: 'misty-swamp',
  name: 'Misty Swamp',
  type: 'FOREST',
  color: '#4A5D23',
  encounterPool: {
    COMMON: [
      {
        pokemonId: 'wooper',
      },
      {
        pokemonId: 'stunky',
      },
      {
        pokemonId: 'croagunk',
      },
      {
        pokemonId: 'gulpin',
      },
    ],
    UNCOMMON: [
      {
        pokemonId: 'quagsire',
      },
      {
        pokemonId: 'toxicroak',
      },
    ],
    RARE: [
      {
        pokemonId: 'drapion',
      },
    ],
  },
  clearTreshold: 8,
  travelThreshold: 4,
  levelRange: {
    min: 5,
    max: 9,
  },
  rarityLevelBonus: {
    COMMON: 0,
    UNCOMMON: 2,
    RARE: 5,
  },
};
