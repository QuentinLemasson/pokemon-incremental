import { Hex, type HexBiome } from './hex';

export function generateMaps(): Hex[] {
  const biomes: HexBiome[] = ['forest', 'plains', 'mountain'];

  return Array.from({ length: 50 }).map(
    (_, i) => new Hex(`hex-${i}`, biomes[i % biomes.length])
  );
}
