import { create } from 'zustand';
import { Game } from '../engine/game/game';
import { Combatant } from '../engine/combat/Combatant';
import { CombatLog } from '../engine/combat/CombatLog';
import { engineRunner } from '../engine/runtime/engine-runner';
import { Combat } from '../engine/combat/CombatSession';
import type { Pokemon } from '../engine/pokemon/pokemon';
import {
  DEFAULT_ENEMY_POKEMON_POOL,
  DEFAULT_PLAYER_POKEMON,
} from '../engine/pokemon/presets';

declare global {
  // Prevent duplicate subscriptions during Vite HMR.
  var __POKE_RPG_TPS_BRIDGE_ACTIVE__: boolean | undefined;
  var __POKE_RPG_TICK_BRIDGE_ACTIVE__: boolean | undefined;
}

/**
 * Pending (not-running) combat session created from a map click.
 *
 * P1 step:
 * - A hex click generates combatants.
 * - Combat simulation is started later (tick loop not implemented yet).
 */
export type PendingEncounter = {
  hexId: string;
  player: Combatant;
  enemy: Combatant;
};

/** Define the shape of your store. */
export interface GameState {
  game: Game;
  version: number; // Version counter to force re-renders when game state changes
  playerPokemon: Pokemon;
  enemyPokemonPool: Pokemon[];
  log: CombatLog;
  logSequence: number;
  tps: number;
  pendingEncounter: PendingEncounter | null;
  combat: Combat | null;
  combatRunning: boolean;
  beginEncounter: (hexId: string) => void;
  startCombat: () => void;
  clearEncounter: () => void;
}

// Create the store with proper TypeScript typing
export const useGameStore = create<GameState>(set => {
  const game = new Game();
  const playerPokemon = DEFAULT_PLAYER_POKEMON;
  const enemyPokemonPool = DEFAULT_ENEMY_POKEMON_POOL;
  const log = new CombatLog();

  // Start the engine runner once and bridge its TPS to the store (UI-friendly).
  engineRunner.start();
  if (!globalThis.__POKE_RPG_TPS_BRIDGE_ACTIVE__) {
    globalThis.__POKE_RPG_TPS_BRIDGE_ACTIVE__ = true;
    engineRunner.subscribeTps(tps => {
      set({ tps });
    });
  }

  // Bridge engine ticks to the store (combat simulation).
  if (!globalThis.__POKE_RPG_TICK_BRIDGE_ACTIVE__) {
    globalThis.__POKE_RPG_TICK_BRIDGE_ACTIVE__ = true;
    engineRunner.subscribeTick(() => {
      set(state => {
        if (!state.combat || !state.combatRunning) return state;

        const result = state.combat.tick();
        if (result) {
          // Combat ended this tick.
          return {
            ...state,
            combatRunning: false,
            version: state.version + 1,
          };
        }

        // Force UI refresh (P1: OK to refresh at 20Hz for now).
        return { ...state, version: state.version + 1 };
      });
    });
  }

  return {
    game,
    version: 0,
    playerPokemon,
    enemyPokemonPool,
    log,
    logSequence: 0,
    tps: 0,
    pendingEncounter: null,
    combat: null,
    combatRunning: false,

    beginEncounter: (hexId: string) => {
      // Do not start/tick combat yet: only create the two combatants.
      set(state => {
        if (state.pendingEncounter) return state;

        const enemyTemplate =
          state.enemyPokemonPool[
            Math.floor(Math.random() * state.enemyPokemonPool.length)
          ];

        const nextSequence = state.logSequence + 1;
        state.log.push({
          type: 'system',
          sequence: nextSequence,
          message: `Encounter created on ${hexId}`,
        });

        const player = new Combatant({ pokemon: state.playerPokemon });
        const enemy = new Combatant({ pokemon: enemyTemplate });
        const combat = new Combat({ player, enemy, log: state.log });

        return {
          ...state,
          pendingEncounter: {
            hexId,
            player,
            enemy,
          },
          combat,
          combatRunning: false,
          logSequence: nextSequence,
          version: state.version + 1, // force re-render (log is mutable)
        };
      });
    },

    startCombat: () => {
      set(state => {
        if (!state.combat || state.combat.ended) return state;
        if (state.combatRunning) return state;
        return { ...state, combatRunning: true, version: state.version + 1 };
      });
    },

    clearEncounter: () => {
      set(state => {
        const nextSequence = state.logSequence + 1;
        state.log.push({
          type: 'system',
          sequence: nextSequence,
          message: 'Encounter closed',
        });

        return {
          ...state,
          pendingEncounter: null,
          combat: null,
          combatRunning: false,
          logSequence: nextSequence,
          version: state.version + 1, // force re-render (log is mutable)
        };
      });
    },
  };
});
