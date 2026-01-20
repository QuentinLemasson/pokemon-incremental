import type { BiomeConfig } from '../types/biome.types';

export const WINDSTREW_PLAINS_BIOME: BiomeConfig = {
  id: 'windswept-plains',
  name: 'Windswept Plains',
  type: 'PLAINS',
  color: '#A8A878',
  encounterPool: {
    COMMON: [
      {
        pokemonId: 'zigzaton',
      },
      {
        pokemonId: 'doduo',
      },
      {
        pokemonId: 'gourmelet',
      },
      {
        pokemonId: 'moumouton',
      },
    ],
    UNCOMMON: [
      {
        pokemonId: 'voltoutou',
      },
      {
        pokemonId: 'crikzik',
      },
    ],
    RARE: [
      {
        pokemonId: 'tauros',
      },
    ],
  },
  clearTreshold: 10,
  travelThreshold: 5,
  levelRange: {
    min: 2,
    max: 5,
  },
  rarityLevelBonus: {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 3,
  },
};
