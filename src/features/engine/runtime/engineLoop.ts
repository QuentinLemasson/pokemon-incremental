import { engineRunner } from './engine-runner';
import { DEFAULT_PLAYER_POKEMON } from '../pokemon/presets';
import { FIGHTS_TO_CLEAR_HEX } from '../combat/encounter.config';
import { WorldManager } from '../world/worldManager';
import { CombatManager, type EncounterSnapshot } from '../combat/combatManager';
import type { HexCoordinates } from '@/common/types/hex.types';
import type { HexBiome } from '../world/types';
import { BIOMES, BIOME_IDS } from '../world/biomes';
import { createEnemyPoolForBiome } from '../combat/biomeEncounter.util';

export type WorldHexSnapshot = {
  id: string;
  biome: HexBiome;
  coordinates: HexCoordinates;
  explored: boolean;
  cleared: boolean;
};

/**
 * Normalized world snapshot for efficient lookup and stable iteration order.
 */
export type WorldSnapshot = {
  ids: string[];
  byId: Record<string, WorldHexSnapshot>;
};

type Listener<T> = (payload: T) => void;

/**
 * Engine loop orchestrator (singleton).
 *
 * Role:
 * - Owns low-level subscriptions to `engineRunner` (ticks + TPS).
 * - Delegates gameplay decisions to managers (`WorldManager`, `CombatManager`).
 * - Emits high-level events for stores/UI to observe.
 *
 * The stores should be bridges: they call `EngineLoop` intents and subscribe to its events.
 */
export class EngineLoop {
  private readonly worldManager = new WorldManager();
  private readonly combatManager = new CombatManager();

  private started = false;

  private readonly tpsListeners = new Set<Listener<number>>();
  private readonly worldListeners = new Set<Listener<WorldSnapshot>>();
  private readonly encounterListeners = new Set<
    Listener<EncounterSnapshot | null>
  >();
  private readonly logListeners = new Set<Listener<string>>();

  /** Start engine runner + wire subscriptions. Safe to call multiple times. */
  start() {
    if (this.started) return;
    this.started = true;

    // Emit initial world snapshot.
    this.emitWorld();
    this.emitEncounter();

    engineRunner.start();

    engineRunner.subscribeTps(tps => {
      for (const fn of this.tpsListeners) fn(tps);
    });

    engineRunner.subscribeTick(() => {
      // Drive combat simulation (world is updated via combat results).
      const tickResult = this.combatManager.onTick();

      if (tickResult?.type === 'log') this.emitLog(tickResult.message);
      if (tickResult?.type === 'world_cleared') {
        this.worldManager.markCleared(tickResult.hexId);
        this.emitWorld();
        this.emitLog(`Hex cleared (${tickResult.hexId})`);
      }

      // Always emit encounter snapshot if it exists (combat is 20Hz).
      this.emitEncounter();
    });
  }

  /** Snapshot getters (useful for store initialization). */
  getWorldSnapshot(): WorldSnapshot {
    return this.worldManager.getSnapshot();
  }

  getEncounterSnapshot(): EncounterSnapshot | null {
    return this.combatManager.getSnapshot();
  }

  /**
   * Intent: user clicked a hex.
   * WorldManager decides if it can be explored.
   * CombatManager creates an encounter for the hex.
   */
  onHexClicked(hexId: string) {
    const explored = this.worldManager.explore(hexId);
    if (!explored) return;

    this.emitWorld();
    this.emitLog(`Hex explored (${hexId})`);

    const biome =
      this.worldManager.getHexBiome(hexId) ??
      (BIOME_IDS[0] as unknown as HexBiome);
    const fightsToClear = BIOMES[biome]?.clearTreshold ?? FIGHTS_TO_CLEAR_HEX;

    this.combatManager.createEncounter({
      hexId,
      playerPokemon: DEFAULT_PLAYER_POKEMON,
      enemyPool: createEnemyPoolForBiome(biome),
      fightsToClear,
    });
    this.emitEncounter();
    this.emitLog(`Encounter created (${hexId})`);
  }

  /** Intent: start/resume combat ticks for the current encounter. */
  startCombat() {
    if (this.combatManager.startCombat()) {
      this.emitEncounter();
      this.emitLog('Combat started');
    }
  }

  /** Intent: close the current encounter (stop combat). */
  closeEncounter() {
    if (this.combatManager.closeEncounter()) {
      this.emitEncounter();
      this.emitLog('Encounter closed');
    }
  }

  // Subscriptions for stores
  onTps(listener: Listener<number>) {
    this.tpsListeners.add(listener);
    return () => this.tpsListeners.delete(listener);
  }

  onWorld(listener: Listener<WorldSnapshot>) {
    this.worldListeners.add(listener);
    return () => this.worldListeners.delete(listener);
  }

  onEncounter(listener: Listener<EncounterSnapshot | null>) {
    this.encounterListeners.add(listener);
    return () => this.encounterListeners.delete(listener);
  }

  onLog(listener: Listener<string>) {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  private emitWorld() {
    const snapshot = this.worldManager.getSnapshot();
    for (const fn of this.worldListeners) fn(snapshot);
  }

  private emitEncounter() {
    const snapshot = this.combatManager.getSnapshot();
    for (const fn of this.encounterListeners) fn(snapshot);
  }

  private emitLog(message: string) {
    for (const fn of this.logListeners) fn(message);
  }
}

declare global {
  var __POKE_RPG_ENGINE_LOOP__: EngineLoop | undefined;
}

/** HMR-safe singleton instance. */
export const engineLoop: EngineLoop =
  globalThis.__POKE_RPG_ENGINE_LOOP__ ??
  (globalThis.__POKE_RPG_ENGINE_LOOP__ = new EngineLoop());
