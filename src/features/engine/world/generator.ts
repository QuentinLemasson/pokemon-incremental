import { Hex } from './hex';
import type { HexCoordinates } from '@/common/types/hex.types';
import type { HexBiome, WorldGenConfig } from './types';

/**
 * Simple world generation for now.
 *
 * Produces a flat-top axial **hexagon** grid (q,r), centered at (0,0).
 * Visual layout is handled by the SVG renderer; here we only assign coordinates.
 */
export function generateMaps(config: WorldGenConfig = { radius: 6 }): Hex[] {
  const biomes: HexBiome[] = ['forest', 'plains', 'mountain'];
  const radius = Math.max(0, Math.floor(config.radius));

  const hexes: Hex[] = [];

  // Standard axial hexagon iteration (see Red Blob Games):
  // for q in [-R..R]:
  //   r1 = max(-R, -q-R)
  //   r2 = min( R, -q+R)
  //   for r in [r1..r2]:
  for (let q = -radius; q <= radius; q += 1) {
    const rMin = Math.max(-radius, -q - radius);
    const rMax = Math.min(radius, -q + radius);
    for (let r = rMin; r <= rMax; r += 1) {
      const coord: HexCoordinates = { q, r };

      // Deterministic “hash” to pick a biome without negative modulo issues.
      const biomeIndex = Math.abs(q * 31 + r * 17) % biomes.length;
      const biome = biomes[biomeIndex];

      const id = `q${q}-r${r}`;
      hexes.push(new Hex(id, coord, biome));
    }
  }

  return hexes;
}
