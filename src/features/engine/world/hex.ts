import type { HexCoordinates } from '@/common/types/hex.types';
import type { HexBiome } from './types';

export class Hex {
  id: string;
  biome: HexBiome;
  explored = false;
  cleared = false;
  totalPokemonDefeated = 0;
  coordinates: HexCoordinates;

  constructor(id: string, coordinates: HexCoordinates, biome: HexBiome) {
    this.id = id;
    this.biome = biome;
    this.coordinates = coordinates;
  }
}
