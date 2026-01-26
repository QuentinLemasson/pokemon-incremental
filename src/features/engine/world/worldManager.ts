import { DEFAULT_WORLD_GENERATION, generateMapsWithContext } from './generator';
import { createSeedString } from './generation/seed';
import { loadChunkConfigs } from './chunk-config/loadChunkConfigs';
import type { Hex } from './hex';
import type { WorldSnapshot } from '../runtime/engineLoop';
import type { HexBiome, VoronoiContext } from './types';
import type { ChunkData } from './types/world-manager.types';

/**
 * WorldManager
 *
 * Low-level world rules and mutations (engine-side).
 * Stores should not implement world rules; they only reflect snapshots and
 * forward intents (e.g. hex clicked).
 */

export class WorldManager {
  /**
   * Normalized state (NSS format):
   * - `hexById` for O(1) retrieval
   * - `hexIds` to keep a stable iteration order for snapshots/UI
   * - `chunkById` for O(1) chunk retrieval
   * - `chunkIds` to keep a stable iteration order
   * - `hexIdToChunkId` for hex -> chunk lookup
   * - `chunkIdToHexIds` for chunk -> hexes lookup (double-reference)
   */
  private readonly hexById: Map<string, Hex>;
  private readonly hexIds: string[];
  private readonly chunkById: Map<string, ChunkData>;
  private readonly chunkIds: string[];
  private readonly hexIdToChunkId: Map<string, string>;
  private readonly chunkIdToHexIds: Map<string, string[]>;
  private readonly voronoiContext: VoronoiContext | undefined;

  constructor() {
    // Seed is generated once per browser session (HMR-safe).
    const seed =
      globalThis.__POKE_RPG_WORLD_SEED__ ??
      (globalThis.__POKE_RPG_WORLD_SEED__ = createSeedString());

    // Load chunk configurations
    const chunks = loadChunkConfigs();

    // Build world generation config with chunks
    const worldConfig = {
      ...DEFAULT_WORLD_GENERATION,
      seed,
      chunks,
    };

    const result = generateMapsWithContext(worldConfig);

    // Store hexes in NSS format
    this.hexById = new Map(result.hexes.map(h => [h.id, h]));
    this.hexIds = result.hexes.map(h => h.id);

    // Store chunks in NSS format
    this.chunkById = new Map();
    this.chunkIds = [];
    this.hexIdToChunkId = new Map();
    this.chunkIdToHexIds = new Map();

    // Build chunk data and double-referenced relationships
    for (const chunkConfig of chunks) {
      const chunkData: ChunkData = {
        id: chunkConfig.id,
        coord: chunkConfig.coord,
        biomeList: chunkConfig.biomeList,
      };
      this.chunkById.set(chunkConfig.id, chunkData);
      this.chunkIds.push(chunkConfig.id);
    }

    // Build double-referenced chunk <=> hex relationships
    for (const mapping of result.chunkHexMappings) {
      this.chunkIdToHexIds.set(mapping.chunkId, mapping.hexIds);
      for (const hexId of mapping.hexIds) {
        this.hexIdToChunkId.set(hexId, mapping.chunkId);
      }
    }

    this.voronoiContext = result.voronoiContext;
  }

  getSnapshot(): WorldSnapshot {
    const byId: WorldSnapshot['byId'] = {};

    for (const id of this.hexIds) {
      const h = this.hexById.get(id);
      if (!h) continue;
      byId[id] = {
        id: h.id,
        biome: h.biome,
        coordinates: h.coordinates,
        explored: h.explored,
        cleared: h.cleared,
      };
    }

    return { ids: this.hexIds, byId };
  }

  getHexBiome(hexId: string): HexBiome | null {
    const hex = this.hexById.get(hexId);
    return hex?.biome ?? null;
  }

  getHexState(hexId: string): {
    biome: HexBiome;
    explored: boolean;
    cleared: boolean;
  } | null {
    const hex = this.hexById.get(hexId);
    if (!hex) return null;
    return { biome: hex.biome, explored: hex.explored, cleared: hex.cleared };
  }

  /**
   * Marks a hex explored if allowed.
   * Returns true if a state change occurred.
   */
  explore(hexId: string): boolean {
    const hex = this.hexById.get(hexId);
    if (!hex) return false;
    if (hex.explored) return false;
    hex.explored = true;
    return true;
  }

  /** Marks a hex cleared (idempotent). */
  markCleared(hexId: string): boolean {
    const hex = this.hexById.get(hexId);
    if (!hex) return false;
    if (hex.cleared) return false;
    hex.cleared = true;
    return true;
  }

  /** Returns the Voronoi context used for generation (if available). */
  getVoronoiContext(): VoronoiContext | undefined {
    return this.voronoiContext;
  }
}

declare global {
  var __POKE_RPG_WORLD_SEED__: string | undefined;
}
