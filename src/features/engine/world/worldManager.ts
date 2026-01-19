import { DEFAULT_WORLD_GENERATION, generateMaps } from './generator';
import { createSeedString } from './generation/seed';
import type { Hex } from './hex';
import type { WorldSnapshot } from '../runtime/engineLoop';

/**
 * WorldManager
 *
 * Low-level world rules and mutations (engine-side).
 * Stores should not implement world rules; they only reflect snapshots and
 * forward intents (e.g. hex clicked).
 */
export class WorldManager {
  /**
   * Normalized state:
   * - `hexById` for O(1) retrieval
   * - `hexIds` to keep a stable iteration order for snapshots/UI
   */
  private readonly hexById: Map<string, Hex>;
  private readonly hexIds: string[];

  constructor() {
    // Seed is generated once per browser session (HMR-safe).
    const seed =
      globalThis.__POKE_RPG_WORLD_SEED__ ??
      (globalThis.__POKE_RPG_WORLD_SEED__ = createSeedString());

    const hexes = generateMaps({
      ...DEFAULT_WORLD_GENERATION,
      seed,
      generator: {
        ...DEFAULT_WORLD_GENERATION.generator,
        centeredVoronoiNoise: {
          ...DEFAULT_WORLD_GENERATION.generator.centeredVoronoiNoise,
        },
      },
    });
    this.hexById = new Map(hexes.map(h => [h.id, h]));
    this.hexIds = hexes.map(h => h.id);
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
}

declare global {
  var __POKE_RPG_WORLD_SEED__: string | undefined;
}
