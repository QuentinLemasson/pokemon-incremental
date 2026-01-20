import { BIOMES } from '@/features/engine/world/biomes';

/**
 * Map biome color configuration.
 *
 * Centralizes all biome-driven visuals so `HexMapSvg` remains purely rendering logic.
 */
export const BIOME_FILL: Record<string, string> = Object.fromEntries(
  Object.values(BIOMES).map(biome => [biome.id, biome.color])
);

export const MAP_TILE_COLORS = {
  unexploredFill: '#1e293b', // rgb(15,23,42)
  exploredStroke: '#94a3b8', // rgb(148,163,184)
  unexploredStroke: '#475569', // rgb(71,85,105)
  clearedStroke: '#38bdf8', // rgb(56,189,248)
} as const;

export function withAlpha(hex: string, alpha: number): string {
  // supports "#RRGGBB" only (good enough for P1 config)
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) return hex;
  const raw = m[1];
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
