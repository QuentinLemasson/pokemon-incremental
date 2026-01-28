import { Hex } from './hex';
import type { HexCoordinates } from '@/common/types/hex.types';
import type { HexBiome } from './types';
import type {
  WorldGenerationConfig,
  ChunkConfig,
  GeneratorConfig,
} from './generation/types';
import type { GenerationResult } from './types';
import { chunkSeed, createRng } from './generation/seed';
import type { Rng } from './generation/seed';
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
  chunkRadius: 8,
  chunks: [],
  baseGenerator: {
    type: 'centered_voronoi_noise_v1',
    centeredVoronoiNoise: {
      // Candidate boundary. Final world is a connected subset (organic blob).
      maxDistance: 8,
      // Coverage: 0.75 means 75% of maxDistance (6 hex steps)
      coverage: 0.75,
      pointsCount: 12,
      sitesMaxDistance: 6,
      jitter: 0.35,
      minSiteDistance: 2,
      maxSiteSampleAttempts: 1200,
    },
  },
};

/**
 * Merges base generator config with chunk-specific overrides.
 */
function mergeGeneratorConfig(
  base: GeneratorConfig,
  override?: Partial<GeneratorConfig>
): GeneratorConfig {
  if (!override) return base;

  return {
    type: override.type ?? base.type,
    centeredVoronoiNoise: {
      ...base.centeredVoronoiNoise,
      ...override.centeredVoronoiNoise,
    },
  };
}

/**
 * Generates hexes for a single chunk.
 * @param chunk - Chunk configuration
 * @param config - World generation configuration
 * @param chunkSeedString - Chunk-specific seed string derived from world seed and chunk coordinates
 * @param rng - Chunk-specific RNG instance (created from chunkSeedString)
 */
function generateChunkHexes(
  chunk: ChunkConfig,
  config: WorldGenerationConfig,
  chunkSeedString: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _rng: Rng
): Hex[] {
  // Merge base generator with chunk-specific overrides
  const generatorConfig = mergeGeneratorConfig(
    config.baseGenerator,
    chunk.customGenerator
  );

  const voronoiConfig = generatorConfig.centeredVoronoiNoise;

  // Clamp maxDistance to chunkRadius (same for all chunks)
  const clampedMaxDistance = Math.min(
    voronoiConfig.maxDistance,
    config.chunkRadius
  );

  // Calculate candidate boundary (clamped maxDistance)
  const candidateRadius = Math.max(0, Math.floor(clampedMaxDistance));

  // Calculate target coverage radius relative to clamped maxDistance
  const coverage = Math.max(0, Math.min(1, voronoiConfig.coverage));
  const targetRadius = Math.max(0, Math.floor(coverage * candidateRadius));
  const targetTiles = tilesForRadius(targetRadius);

  const hexes: Hex[] = [];
  const candidateCoords: HexCoordinates[] = [];
  const candidateById = new Map<string, HexCoordinates>();

  // Generate candidate hexes within chunk (local coordinates, centered at 0,0)
  for (let q = -candidateRadius; q <= candidateRadius; q += 1) {
    const rMin = Math.max(-candidateRadius, -q - candidateRadius);
    const rMax = Math.min(candidateRadius, -q + candidateRadius);
    for (let r = rMin; r <= rMax; r += 1) {
      const localCoord: HexCoordinates = { q, r };
      const id = `q${q}-r${r}`;
      candidateCoords.push(localCoord);
      candidateById.set(id, localCoord);
    }
  }

  const maxPossibleTiles = candidateCoords.length;
  const finalTargetTiles = Math.max(1, Math.min(targetTiles, maxPossibleTiles));

  // Use chunk-specific biome list
  const biomes: HexBiome[] = [...chunk.biomeList];

  // Create Voronoi context for this chunk using chunk-specific seed
  // Note: RNG parameter is available for any future random operations within chunk generation
  const voronoi = createCenteredVoronoiSites({
    seed: chunkSeedString,
    biomes,
    worldMaxDistance: candidateRadius,
    config: {
      ...voronoiConfig,
      maxDistance: clampedMaxDistance,
    },
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

  console.log(
    'Generating chunk',
    chunk.id,
    'with',
    candidateCoords.length,
    'candidates'
  );

  // Calculate chunk spacing to prevent overlap
  const R = config.chunkRadius + 1;

  // Calculate chunk offset for pointy-top to flat-top local coordinate conversion
  const Qchunk = { q: 2 * R - 1, r: -(R - 1) };
  const Rchunk = { q: R, r: -(2 * R - 1) };

  for (const id of selected) {
    const localCoord = candidateById.get(id);
    if (!localCoord) continue;

    // Convert local coordinates to global coordinates relative to chunk (0,0) center
    // Global coordinate = chunk world offset + local coordinate within chunk
    const globalCoord: HexCoordinates = {
      q: localCoord.q + chunk.coord.q * Qchunk.q + chunk.coord.r * Rchunk.q,
      r: localCoord.r + chunk.coord.q * Qchunk.r + chunk.coord.r * Rchunk.r,
    };

    // Create unique hex ID that includes chunk info
    const hexId = `${chunk.id}-q${globalCoord.q}-r${globalCoord.r}`;
    const biome = computeVoronoiBiome(voronoi, localCoord);
    hexes.push(new Hex(hexId, globalCoord, biome));
  }

  return hexes;
}

/**
 * Generates the world map and returns both hexes and generation context.
 * Useful for debugging/visualization overlays.
 *
 * World shape:
 * - Generates chunks based on chunk configs
 * - Each chunk is generated independently with its own biome list and generator config
 * - Chunk radius clamps the maxDistance for all chunks
 *
 * @param config - World generation configuration. Uses DEFAULT_WORLD_GENERATION if not provided.
 * @returns Generation result containing hexes and optional Voronoi context for visualization.
 *
 * @remarks
 * Generates all chunks specified in config.chunks.
 * Each chunk is generated independently with its own biome list and generator config overrides.
 * The `coverage` parameter (0-1) determines the desired world size relative to `maxDistance`.
 * Target radius = coverage × maxDistance, which gives tiles = 1 + 3×R×(R+1).
 * The actual world size is limited by `chunkRadius` (clamps maxDistance).
 * The final world is a connected subset grown from the candidate pool.
 * Hex coordinates are global and relative to chunk (0,0) center.
 * Chunks are spaced by (2 * chunkRadius + 1) to prevent overlap.
 * Global coordinate = chunkWorldOffset + localCoord, where chunkWorldOffset = chunkCoord * chunkSpacing.
 */
export type ChunkHexMapping = {
  chunkId: string;
  hexIds: string[];
};

export function generateMapsWithContext(
  config: WorldGenerationConfig = DEFAULT_WORLD_GENERATION
): GenerationResult & { chunkHexMappings: ChunkHexMapping[] } {
  console.log('Generating maps with context for config:', config);
  console.log('Chunks:', config.chunks);

  const allHexes: Hex[] = [];
  const chunkHexMappings: ChunkHexMapping[] = [];
  let voronoiContext: GenerationResult['voronoiContext'] = undefined;

  // Generate all chunks
  for (const chunk of config.chunks) {
    // Derive chunk-specific seed and create RNG
    const chunkSeedString = chunkSeed(
      config.seed,
      chunk.coord.q,
      chunk.coord.r,
      'continental'
    );
    const rng = createRng(chunkSeedString);

    const chunkHexes = generateChunkHexes(chunk, config, chunkSeedString, rng);
    allHexes.push(...chunkHexes);

    // Store chunk-to-hex mapping
    chunkHexMappings.push({
      chunkId: chunk.id,
      hexIds: chunkHexes.map(h => h.id),
    });

    // Return Voronoi context for the first chunk (typically chunk 0,0)
    // This is used for visualization/debugging overlays
    if (!voronoiContext && chunkHexes.length > 0) {
      const generatorConfig = mergeGeneratorConfig(
        config.baseGenerator,
        chunk.customGenerator
      );
      const voronoiConfig = generatorConfig.centeredVoronoiNoise;
      const clampedMaxDistance = Math.min(
        voronoiConfig.maxDistance,
        config.chunkRadius
      );
      const candidateRadius = Math.max(0, Math.floor(clampedMaxDistance));

      voronoiContext = createCenteredVoronoiSites({
        seed: chunkSeedString,
        biomes: [...chunk.biomeList],
        worldMaxDistance: candidateRadius,
        config: {
          ...voronoiConfig,
          maxDistance: clampedMaxDistance,
        },
      });
    }
  }

  console.log('Chunk hex mappings:', chunkHexMappings);
  console.log('Voronoi context:', voronoiContext);

  return { hexes: allHexes, voronoiContext, chunkHexMappings };
}

/**
 * Generates the world map and assigns biomes procedurally.
 *
 * This is a convenience wrapper around `generateMapsWithContext` that returns only the hexes.
 * Use `generateMapsWithContext` if you need the Voronoi context for visualization/debugging.
 */
export function generateMaps(
  config: WorldGenerationConfig = DEFAULT_WORLD_GENERATION
): Hex[] {
  return generateMapsWithContext(config).hexes;
}

/**
 * Calculates the number of tiles in a hexagon of the given radius.
 *
 * Formula: tiles = 1 + 3×R×(R+1)
 * This represents a complete axial hexagon from center to corners.
 *
 * @param radius - Hex distance from center to corners (must be >= 0).
 * @returns Total number of tiles in the hexagon.
 */
function tilesForRadius(radius: number): number {
  const r = Math.max(0, Math.floor(radius));
  return 1 + 3 * r * (r + 1);
}

/**
 * Function type for scoring candidate hex IDs during blob growth.
 * Lower scores are preferred (included first).
 */
type ScoreForId = (id: string) => number;

/**
 * Grows a connected blob of hexes from a starting point using best-first expansion.
 *
 * Uses a min-heap to prioritize hexes with lower scores (better candidates).
 * The blob grows until it reaches the target count or runs out of candidates.
 *
 * @param params - Blob growth parameters.
 * @param params.candidateById - Map of hex IDs to coordinates (candidate pool).
 * @param params.startId - Starting hex ID (defaults to 'q0-r0' if not found).
 * @param params.targetCount - Target number of hexes to include.
 * @param params.scoreForId - Function that scores each hex ID (lower = better).
 * @returns Array of hex IDs included in the blob, in order of selection.
 */
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

/**
 * Returns the IDs of all 6 axial neighbors of a hex coordinate.
 *
 * Uses a fixed order for determinism: [1,0], [1,-1], [0,-1], [-1,0], [-1,1], [0,1].
 *
 * @param c - Hex coordinates (q, r).
 * @returns Array of neighbor hex IDs in the format 'q{q}-r{r}'.
 */
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

/**
 * Node in the min-heap used for best-first blob expansion.
 */
type HeapNode = { id: string; score: number };

/**
 * Min-heap implementation for best-first search during blob growth.
 *
 * Maintains nodes ordered by score (lowest first), with ID as tiebreaker for determinism.
 * Used to efficiently select the next best hex to include in the growing world blob.
 */
class MinHeap {
  private readonly a: HeapNode[] = [];

  /**
   * Returns the number of nodes in the heap.
   */
  size() {
    return this.a.length;
  }

  /**
   * Adds a node to the heap and maintains heap property.
   *
   * @param n - Node to add.
   */
  push(n: HeapNode) {
    this.a.push(n);
    this.bubbleUp(this.a.length - 1);
  }

  /**
   * Removes and returns the node with the lowest score.
   *
   * @returns The minimum node, or undefined if the heap is empty.
   */
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

  /**
   * Compares two heap nodes.
   * Lower score wins; if scores are equal, lower ID wins (for determinism).
   *
   * @param i - First node index.
   * @param j - Second node index.
   * @returns True if node i should come before node j.
   */
  private less(i: number, j: number) {
    const a = this.a[i];
    const b = this.a[j];
    if (a.score !== b.score) return a.score < b.score;
    return a.id < b.id;
  }

  /**
   * Moves a node up the heap to maintain min-heap property.
   *
   * @param i - Index of the node to bubble up.
   */
  private bubbleUp(i: number) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.less(p, i)) break;
      this.swap(i, p);
      i = p;
    }
  }

  /**
   * Moves a node down the heap to maintain min-heap property.
   *
   * @param i - Index of the node to bubble down.
   */
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

  /**
   * Swaps two nodes in the heap array.
   *
   * @param i - First node index.
   * @param j - Second node index.
   */
  private swap(i: number, j: number) {
    const t = this.a[i];
    this.a[i] = this.a[j];
    this.a[j] = t;
  }
}
