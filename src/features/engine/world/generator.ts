import { Hex } from './hex';
import type { HexCoordinates } from '@/common/types/hex.types';
import type { HexBiome } from './types';
import type { WorldGenerationConfig } from './generation/types';
import {
  computeVoronoiBiome,
  computeVoronoiShapeScore,
  createCenteredVoronoiSites,
} from './generation/centeredVoronoiNoise.generator';

/**
 * Default world generation configuration (P1).
 */
export const DEFAULT_WORLD_GENERATION: WorldGenerationConfig = {
  seed: 'dev',
  radius: 6,
  minTiles: undefined,
  maxTiles: undefined,
  generator: {
    type: 'centered_voronoi_noise_v1',
    centeredVoronoiNoise: {
      // Candidate boundary. Final world is a connected subset (organic blob).
      maxRadius: 8,
      pointsCount: 12,
      sitesMaxRadius: 6,
      jitter: 0.35,
      minSiteDistance: 2,
      maxSiteSampleAttempts: 1200,
    },
  },
};

/**
 * Generates the world map and assigns biomes procedurally.
 *
 * World shape:
 * - Build a candidate axial hexagon within `generator.centeredVoronoiNoise.maxRadius`
 * - Grow a connected “blob” from the center using a Voronoi+noise score until reaching target tile count
 */
export function generateMaps(
  config: WorldGenerationConfig = DEFAULT_WORLD_GENERATION
): Hex[] {
  const biomes: HexBiome[] = ['forest', 'plains', 'mountain'];

  // Target coverage size (stable across seeds).
  const targetRadius = clampRadiusByTileCaps(
    Math.max(0, Math.floor(config.radius)),
    config.minTiles,
    config.maxTiles
  );

  const targetTiles = clampTilesByCaps(
    tilesForRadius(targetRadius),
    config.minTiles,
    config.maxTiles
  );

  const hexes: Hex[] = [];

  const candidateRadius = Math.max(
    0,
    Math.floor(config.generator.centeredVoronoiNoise.maxRadius)
  );
  const candidateCoords: HexCoordinates[] = [];
  const candidateById = new Map<string, HexCoordinates>();

  // Standard axial hexagon iteration (see Red Blob Games):
  // for q in [-R..R]:
  //   r1 = max(-R, -q-R)
  //   r2 = min( R, -q+R)
  //   for r in [r1..r2]:
  for (let q = -candidateRadius; q <= candidateRadius; q += 1) {
    const rMin = Math.max(-candidateRadius, -q - candidateRadius);
    const rMax = Math.min(candidateRadius, -q + candidateRadius);
    for (let r = rMin; r <= rMax; r += 1) {
      const coord: HexCoordinates = { q, r };
      const id = `q${q}-r${r}`;
      candidateCoords.push(coord);
      candidateById.set(id, coord);
    }
  }

  const maxPossibleTiles = candidateCoords.length;
  const finalTargetTiles = Math.max(1, Math.min(targetTiles, maxPossibleTiles));

  // Create Voronoi context once; used for both shape selection + biome assignment.
  const voronoi = createCenteredVoronoiSites({
    seed: config.seed,
    biomes,
    worldMaxRadius: candidateRadius,
    config: config.generator.centeredVoronoiNoise,
  });

  // Select a connected subset (blob) using best-first expansion by Voronoi score.
  const selected = growConnectedBlob({
    candidateById,
    startId: 'q0-r0',
    targetCount: finalTargetTiles,
    scoreForId: id => {
      const c = candidateById.get(id);
      if (!c) return Number.POSITIVE_INFINITY;
      return computeVoronoiShapeScore(voronoi, c);
    },
  });

  for (const id of selected) {
    const coord = candidateById.get(id);
    if (!coord) continue;
    const biome = computeVoronoiBiome(voronoi, coord);
    hexes.push(new Hex(id, coord, biome));
  }

  return hexes;
}

function tilesForRadius(radius: number): number {
  const r = Math.max(0, Math.floor(radius));
  return 1 + 3 * r * (r + 1);
}

function clampTilesByCaps(
  tiles: number,
  minTiles?: number,
  maxTiles?: number
): number {
  let t = Math.max(1, Math.floor(tiles));
  if (typeof minTiles === 'number' && minTiles > 0) {
    t = Math.max(t, Math.floor(minTiles));
  }
  if (typeof maxTiles === 'number' && maxTiles > 0) {
    t = Math.min(t, Math.floor(maxTiles));
  }
  return t;
}

function clampRadiusByTileCaps(
  radius: number,
  minTiles?: number,
  maxTiles?: number
): number {
  let r = Math.max(0, Math.floor(radius));

  if (typeof minTiles === 'number' && minTiles > 0) {
    // increase r until tile count >= minTiles
    while (tilesForRadius(r) < minTiles) r += 1;
  }

  if (typeof maxTiles === 'number' && maxTiles > 0) {
    // decrease r until tile count <= maxTiles
    while (r > 0 && tilesForRadius(r) > maxTiles) r -= 1;
  }

  return r;
}

type ScoreForId = (id: string) => number;

function growConnectedBlob(params: {
  candidateById: Map<string, HexCoordinates>;
  startId: string;
  targetCount: number;
  scoreForId: ScoreForId;
}): string[] {
  const { candidateById, startId, targetCount, scoreForId } = params;

  const startCoord = candidateById.get(startId) ?? candidateById.get('q0-r0');
  const actualStartId = startCoord
    ? `q${startCoord.q}-r${startCoord.r}`
    : startId;

  const included = new Set<string>();
  const seen = new Set<string>();
  const heap = new MinHeap();

  heap.push({ id: actualStartId, score: scoreForId(actualStartId) });
  seen.add(actualStartId);

  const out: string[] = [];
  while (out.length < targetCount && heap.size() > 0) {
    const node = heap.pop();
    if (!node) break;
    if (included.has(node.id)) continue;
    if (!candidateById.has(node.id)) continue;

    included.add(node.id);
    out.push(node.id);

    const coord = candidateById.get(node.id);
    if (!coord) continue;

    for (const nId of neighborIds(coord)) {
      if (seen.has(nId)) continue;
      if (!candidateById.has(nId)) continue;
      seen.add(nId);
      heap.push({ id: nId, score: scoreForId(nId) });
    }
  }

  return out;
}

function neighborIds(c: HexCoordinates): string[] {
  // Axial neighbors (q,r) in fixed order for determinism.
  const dirs: ReadonlyArray<readonly [number, number]> = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
  ];

  const ids: string[] = [];
  for (const [dq, dr] of dirs) {
    const q = c.q + dq;
    const r = c.r + dr;
    ids.push(`q${q}-r${r}`);
  }
  return ids;
}

type HeapNode = { id: string; score: number };

class MinHeap {
  private readonly a: HeapNode[] = [];

  size() {
    return this.a.length;
  }

  push(n: HeapNode) {
    this.a.push(n);
    this.bubbleUp(this.a.length - 1);
  }

  pop(): HeapNode | undefined {
    if (this.a.length === 0) return undefined;
    const root = this.a[0];
    const last = this.a.pop();
    if (this.a.length > 0 && last) {
      this.a[0] = last;
      this.bubbleDown(0);
    }
    return root;
  }

  private less(i: number, j: number) {
    const a = this.a[i];
    const b = this.a[j];
    if (a.score !== b.score) return a.score < b.score;
    return a.id < b.id;
  }

  private bubbleUp(i: number) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.less(p, i)) break;
      this.swap(i, p);
      i = p;
    }
  }

  private bubbleDown(i: number) {
    for (;;) {
      const l = i * 2 + 1;
      const r = l + 1;
      let m = i;

      if (l < this.a.length && this.less(l, m)) m = l;
      if (r < this.a.length && this.less(r, m)) m = r;

      if (m === i) break;
      this.swap(i, m);
      i = m;
    }
  }

  private swap(i: number, j: number) {
    const t = this.a[i];
    this.a[i] = this.a[j];
    this.a[j] = t;
  }
}
