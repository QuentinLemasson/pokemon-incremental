import type { ChunkConfig } from '../generation/types';

/**
 * Dynamically imports all chunk config files matching the pattern chunk-[q]-[r].json
 * using Vite's import.meta.glob.
 */
const chunkModules = import.meta.glob<ChunkConfig>('./chunk-*.json', {
  eager: true,
  import: 'default',
});

/**
 * Loads all chunk configurations from JSON files.
 * Files must follow the naming convention: chunk-[q]-[r].json
 *
 * @returns Array of chunk configurations, sorted by coordinates
 */
export function loadChunkConfigs(): ChunkConfig[] {
  const chunks: ChunkConfig[] = [];

  // Extract all chunk configs from the dynamically imported modules
  for (const path in chunkModules) {
    const config = chunkModules[path] as unknown as ChunkConfig;
    if (config && config.id && config.coord) {
      chunks.push(config);
    }
  }

  // Sort chunks by coordinates (q first, then r) for consistent ordering
  chunks.sort((a, b) => {
    if (a.coord.q !== b.coord.q) {
      return a.coord.q - b.coord.q;
    }
    return a.coord.r - b.coord.r;
  });

  console.log(
    'Loaded chunks:',
    chunks.map(c => c.id)
  );

  return chunks;
}
