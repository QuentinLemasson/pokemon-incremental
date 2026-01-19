import type { HexCoordinates } from '@/common/types/hex.types';
import type { HexBiome } from '../types';
import { createRng, noise2dSigned } from './seed';
import type { CenteredVoronoiNoiseConfig } from './types';

export type VoronoiSite = {
  coord: HexCoordinates;
  biome: HexBiome;
};

export type VoronoiContext = {
  sites: VoronoiSite[];
  jitter: number;
  seed: string;
};

/**
 * Create Voronoi sites used by both:
 * - world shape selection (organic blob)
 * - biome assignment (region look)
 */
export function createCenteredVoronoiSites(params: {
  seed: string;
  biomes: readonly HexBiome[];
  worldMaxRadius: number;
  config: CenteredVoronoiNoiseConfig;
}): VoronoiContext {
  const { seed, biomes, worldMaxRadius, config } = params;

  const rng = createRng(seed);
  const jitter = Math.max(0, config.jitter);
  const sitesMaxRadius = Math.max(
    0,
    Math.min(worldMaxRadius, Math.floor(config.sitesMaxRadius))
  );
  const pointsCount = Math.max(1, Math.floor(config.pointsCount));

  const minSiteDistance =
    config.minSiteDistance ??
    Math.max(
      1,
      Math.floor(sitesMaxRadius / Math.max(1, Math.sqrt(pointsCount)))
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
    const candidate = randomCoordInRadius(rng, sitesMaxRadius);
    if (sites.some(s => axialDistance(candidate, s.coord) < minSiteDistance))
      continue;

    const biome = shuffledBiomes[sites.length % shuffledBiomes.length];
    sites.push({ coord: candidate, biome });
  }

  // If spacing constraints prevented full placement, top up without constraints.
  while (sites.length < pointsCount) {
    const candidate = randomCoordInRadius(rng, sitesMaxRadius);
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

export function generateBiomesCenteredVoronoiNoise(params: {
  worldCoords: readonly HexCoordinates[];
  seed: string;
  biomes: readonly HexBiome[];
  config: CenteredVoronoiNoiseConfig;
}): Map<string, HexBiome> {
  const { worldCoords, seed, biomes, config } = params;
  const worldMaxRadius = Math.max(0, Math.floor(config.maxRadius));
  const ctx = createCenteredVoronoiSites({
    seed,
    biomes,
    worldMaxRadius,
    config,
  });

  // Assign each tile to the nearest site (Voronoi) with hash-noise jitter.
  const biomeById = new Map<string, HexBiome>();
  for (const c of worldCoords) {
    // Stable id format used by the generator: q{q}-r{r}
    biomeById.set(`q${c.q}-r${c.r}`, computeVoronoiBiome(ctx, c));
  }

  return biomeById;
}

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

function axialDistance(a: HexCoordinates, b: HexCoordinates): number {
  const aq = a.q;
  const ar = a.r;
  const bq = b.q;
  const br = b.r;
  const as = -aq - ar;
  const bs = -bq - br;
  return Math.max(Math.abs(aq - bq), Math.abs(ar - br), Math.abs(as - bs));
}

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
