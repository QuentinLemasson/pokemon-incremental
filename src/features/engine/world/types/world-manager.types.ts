import type { HexBiome } from './biome.types';
import type { ChunkConfig } from '../generation/types';

/**
 * Chunk data stored in NSS format.
 */
export type ChunkData = {
  id: string;
  coord: ChunkConfig['coord'];
  biomeList: readonly HexBiome[];
};
