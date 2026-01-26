import type { ChunkConfig } from '../generation/types';
import chunk0_0 from './chunk-0-0.json';

/**
 * Loads chunk configurations from JSON files.
 * For now, only loads chunk (0,0).
 *
 * @returns Array of chunk configurations
 */
export function loadChunkConfigs(): ChunkConfig[] {
  const chunks: ChunkConfig[] = [];

  // For now, only load chunk (0,0)
  // Type assertion needed because JSON doesn't preserve Partial types
  const config = chunk0_0 as unknown as ChunkConfig;
  chunks.push(config);

  return chunks;
}
