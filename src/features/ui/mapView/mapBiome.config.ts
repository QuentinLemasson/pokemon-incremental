import type { HexBiome } from '@/features/engine/world/types';

/**
 * Map biome color configuration.
 *
 * Centralizes all biome-driven visuals so `HexMapSvg` remains purely rendering logic.
 */
export const BIOME_FILL: Record<HexBiome, string> = {
  forest: 'rgba(34,197,94,0.28)',
  plains: 'rgba(250,204,21,0.20)',
  mountain: 'rgba(148,163,184,0.22)',
};

export const MAP_TILE_COLORS = {
  unexploredFill: 'rgba(15,23,42,0.55)',
  clearedFill: 'rgba(100,116,139,0.35)',
  exploredStroke: 'rgba(148,163,184,0.45)',
  unexploredStroke: 'rgba(71,85,105,0.45)',
} as const;
