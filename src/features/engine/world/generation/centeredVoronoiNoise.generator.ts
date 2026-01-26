import type { HexCoordinates } from '@/common/types/hex.types';
import { createRng, noise2dSigned } from './seed';
import type { CenteredVoronoiNoiseConfig } from './types';
import type { HexBiome, VoronoiContext, VoronoiSite } from '../types';

/**
 * Creates Voronoi sites used by both:
 * - world shape selection (organic blob)
 * - biome assignment (region look)
 *
 * Sites are placed within the specified distance with optional minimum distance constraints
 * to ensure uniform coverage. If spacing constraints prevent full placement, remaining
 * sites are placed without constraints.
 *
 * @param params - Site creation parameters.
 * @param params.seed - Deterministic seed for site placement.
 * @param params.biomes - Available biomes to assign to sites.
 * @param params.worldMaxDistance - Maximum distance for site placement.
 * @param params.config - Voronoi noise configuration.
 * @returns Voronoi context containing sites, jitter, and seed.
 */
export function createCenteredVoronoiSites(params: {
  seed: string;
  biomes: readonly HexBiome[];
  worldMaxDistance: number;
  config: CenteredVoronoiNoiseConfig;
}): VoronoiContext {
  const { seed, biomes, worldMaxDistance, config } = params;

  const rng = createRng(seed);
  const jitter = Math.max(0, config.jitter);
  const sitesMaxDistance = Math.max(
    0,
    Math.min(worldMaxDistance, Math.floor(config.sitesMaxDistance))
  );
  const pointsCount = Math.max(1, Math.floor(config.pointsCount));

  const minSiteDistance =
    config.minSiteDistance ??
    Math.max(
      1,
      Math.floor(sitesMaxDistance / Math.max(1, Math.sqrt(pointsCount)))
    );

  const maxAttempts = Math.max(
    50,
    Math.floor(config.maxSiteSampleAttempts ?? 600)
  );

  const sites: VoronoiSite[] = [];
  const shuffledBiomes = shuffleDeterministic([...biomes], rng);

  let attempts = 0;
  while (sites.length < pointsCount && attempts < maxAttempts) {
    attempts += 1;
    const candidate = randomCoordInRadius(rng, sitesMaxDistance);
    if (sites.some(s => axialDistance(candidate, s.coord) < minSiteDistance))
      continue;

    const biome = shuffledBiomes[sites.length % shuffledBiomes.length];
    sites.push({ coord: candidate, biome });
  }

  // If spacing constraints prevented full placement, top up without constraints.
  while (sites.length < pointsCount) {
    const candidate = randomCoordInRadius(rng, sitesMaxDistance);
    const biome = shuffledBiomes[sites.length % shuffledBiomes.length];
    sites.push({ coord: candidate, biome });
  }

  return { sites, jitter, seed };
}

/**
 * World-shape score for a coordinate.
 *
 * Lower scores are “more likely” to be included when growing the world blob.
 * This is separate from biome selection salt (so boundaries look organic).
 */
export function computeVoronoiShapeScore(
  ctx: VoronoiContext,
  coord: HexCoordinates
): number {
  const { sites, jitter, seed } = ctx;
  let bestD = Number.POSITIVE_INFINITY;
  for (const s of sites) {
    const d = axialDistance(coord, s.coord);
    if (d < bestD) bestD = d;
  }

  const n =
    jitter === 0 ? 0 : noise2dSigned(seed, coord.q, coord.r, 1337) * jitter;
  return bestD + n;
}

/**
 * Biome assignment for a coordinate: nearest site with per-site noise jitter.
 *
 * Uses Voronoi diagram logic: finds the nearest site, with hash-noise jitter applied
 * per-site to create organic boundaries. Each site uses a different noise salt (its index)
 * to ensure deterministic but varied boundaries.
 *
 * @param ctx - Voronoi context containing sites and configuration.
 * @param coord - Hex coordinates to assign biome to.
 * @returns Biome identifier for the coordinate.
 */
export function computeVoronoiBiome(
  ctx: VoronoiContext,
  coord: HexCoordinates
): HexBiome {
  const { sites, jitter, seed } = ctx;
  let best: VoronoiSite | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let i = 0; i < sites.length; i += 1) {
    const s = sites[i];
    const d = axialDistance(coord, s.coord);
    const n =
      jitter === 0 ? 0 : noise2dSigned(seed, coord.q, coord.r, i) * jitter;
    const score = d + n;
    if (score < bestScore) {
      bestScore = score;
      best = s;
    }
  }

  return (best ?? sites[0]).biome;
}

/**
 * Generates biome assignments for a set of world coordinates using centered Voronoi noise.
 *
 * This is a standalone function that can be used independently of the main world generator.
 * It creates Voronoi sites and assigns each coordinate to the nearest site's biome.
 *
 * @param params - Generation parameters.
 * @param params.worldCoords - Array of hex coordinates to assign biomes to.
 * @param params.seed - Deterministic seed for generation.
 * @param params.biomes - Available biomes to assign.
 * @param params.config - Voronoi noise configuration.
 * @returns Map from hex ID (format: 'q{q}-r{r}') to biome identifier.
 */
export function generateBiomesCenteredVoronoiNoise(params: {
  worldCoords: readonly HexCoordinates[];
  seed: string;
  biomes: readonly string[];
  config: CenteredVoronoiNoiseConfig;
}): Map<string, string> {
  const { worldCoords, seed, biomes, config } = params;
  const worldMaxDistance = Math.max(0, Math.floor(config.maxDistance));
  const ctx = createCenteredVoronoiSites({
    seed,
    biomes,
    worldMaxDistance,
    config,
  });

  // Assign each tile to the nearest site (Voronoi) with hash-noise jitter.
  const biomeById = new Map<string, string>();
  for (const c of worldCoords) {
    // Stable id format used by the generator: q{q}-r{r}
    biomeById.set(`q${c.q}-r${c.r}`, computeVoronoiBiome(ctx, c));
  }

  return biomeById;
}

/**
 * Generates a random hex coordinate within a given radius from the origin.
 *
 * Uses uniform distribution: picks q uniformly, then picks r from the valid range
 * for that q value (to ensure the coordinate is within the hexagon).
 *
 * @param rng - Deterministic random number generator.
 * @param radius - Maximum hex distance from center (must be >= 0).
 * @returns Random hex coordinates within the specified radius.
 */
function randomCoordInRadius(
  rng: ReturnType<typeof createRng>,
  radius: number
): HexCoordinates {
  const R = Math.max(0, radius);
  // Pick q uniformly, then pick r in the valid range for hexagon radius.
  const q = rng.int(-R, R);
  const rMin = Math.max(-R, -q - R);
  const rMax = Math.min(R, -q + R);
  const r = rng.int(rMin, rMax);
  return { q, r };
}

/**
 * Calculates the axial distance (hex distance) between two hex coordinates.
 *
 * Uses the standard hex distance formula: max(|dq|, |dr|, |ds|) where
 * s = -q - r (cube coordinates).
 *
 * @param a - First hex coordinates.
 * @param b - Second hex coordinates.
 * @returns Hex distance between the two coordinates (always >= 0).
 */
function axialDistance(a: HexCoordinates, b: HexCoordinates): number {
  const aq = a.q;
  const ar = a.r;
  const bq = b.q;
  const br = b.r;
  const as = -aq - ar;
  const bs = -bq - br;
  return Math.max(Math.abs(aq - bq), Math.abs(ar - br), Math.abs(as - bs));
}

/**
 * Shuffles an array deterministically using a provided RNG (Fisher-Yates algorithm).
 *
 * Modifies the input array in place and returns it for convenience.
 *
 * @param arr - Array to shuffle (modified in place).
 * @param rng - Deterministic random number generator.
 * @returns The shuffled array (same reference as input).
 */
function shuffleDeterministic<T>(
  arr: T[],
  rng: ReturnType<typeof createRng>
): T[] {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
