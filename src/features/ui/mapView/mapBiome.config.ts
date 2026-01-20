import { BIOMES } from '@/features/engine/world/biomes';

/**
 * Map biome color configuration.
 *
 * Centralizes all biome-driven visuals so `HexMapSvg` remains purely rendering logic.
 */
export const BIOME_FILL: Record<string, string> = Object.fromEntries(
  Object.values(BIOMES).map(biome => [
    biome.id,
    withAlpha(biome.color, alphaForBiomeType(biome.type)),
  ])
);

export const MAP_TILE_COLORS = {
  unexploredFill: 'rgba(15,23,42,0.55)',
  clearedFill: 'rgba(100,116,139,0.35)',
  exploredStroke: 'rgba(148,163,184,0.45)',
  unexploredStroke: 'rgba(71,85,105,0.45)',
} as const;

function alphaForBiomeType(type: string): number {
  if (type === 'FOREST') return 0.28;
  if (type === 'PLAINS') return 0.2;
  return 0.22;
}

function withAlpha(hex: string, alpha: number): string {
  // supports "#RRGGBB" only (good enough for P1 config)
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) return hex;
  const raw = m[1];
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
