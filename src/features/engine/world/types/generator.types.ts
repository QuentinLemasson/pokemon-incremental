import type { HexCoordinates } from '@/common/types/hex.types';
import type { HexBiome } from './biome.types';
import type { Hex } from '../hex';

/**
 * Result of world generation, including the generated hexes and optional context
 * for debugging/visualization (e.g., Voronoi sites overlay).
 */
export type GenerationResult = {
  hexes: Hex[];
  voronoiContext?: VoronoiContext;
};

/**
 * A Voronoi site representing a biome region center.
 */
export type VoronoiSite = {
  coord: HexCoordinates;
  biome: HexBiome;
};

/**
 * Context containing Voronoi sites and configuration used during world generation.
 * This is used for both world shape selection (organic blob) and biome assignment.
 */
export type VoronoiContext = {
  sites: VoronoiSite[];
  jitter: number;
  seed: string;
};
