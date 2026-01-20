import type { BiomeConfig } from '../types/biome.types';

export const VERDANT_FOREST_BIOME: BiomeConfig = {
  id: 'verdant-forest',
  name: 'Verdant Forest',
  type: 'FOREST',
  color: '#8B5E3C',
  encounterPool: {
    COMMON: [
      {
        pokemonId: 'tissemboule',
      },
      {
        pokemonId: 'hoothoot',
      },
      {
        pokemonId: 'lepidonille',
      },
      {
        pokemonId: 'paras',
      },
    ],
    UNCOMMON: [
      {
        pokemonId: 'grainipiot',
      },
      {
        pokemonId: 'croquine',
      },
    ],
    RARE: [
      {
        pokemonId: 'scarhino',
      },
    ],
  },
  clearTreshold: 10,
  travelThreshold: 5,
  levelRange: {
    min: 4,
    max: 7,
  },
  levelRarityAddition: {
    COMMON: 0,
    UNCOMMON: 2,
    RARE: 4,
  },
};
