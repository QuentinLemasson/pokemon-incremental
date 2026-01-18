import { create } from 'zustand';
import { Game } from '../engine/game/game';
import { Combatant } from '../engine/combat/Combatant';
import type { Pokemon } from '../engine/pokemon/pokemon';
import {
  DEFAULT_ENEMY_POKEMON_POOL,
  DEFAULT_PLAYER_POKEMON,
} from '../engine/pokemon/presets';

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
  pendingEncounter: PendingEncounter | null;
  beginEncounter: (hexId: string) => void;
  clearEncounter: () => void;
}

// Create the store with proper TypeScript typing
export const useGameStore = create<GameState>(set => {
  const game = new Game();
  const playerPokemon = DEFAULT_PLAYER_POKEMON;
  const enemyPokemonPool = DEFAULT_ENEMY_POKEMON_POOL;

  return {
    game,
    version: 0,
    playerPokemon,
    enemyPokemonPool,
    pendingEncounter: null,

    beginEncounter: (hexId: string) => {
      // Do not start/tick combat yet: only create the two combatants.
      set(state => {
        if (state.pendingEncounter) return state;

        const enemyTemplate =
          state.enemyPokemonPool[
            Math.floor(Math.random() * state.enemyPokemonPool.length)
          ];

        return {
          ...state,
          pendingEncounter: {
            hexId,
            player: new Combatant({ pokemon: state.playerPokemon }),
            enemy: new Combatant({ pokemon: enemyTemplate }),
          },
          version: state.version + 1,
        };
      });
    },

    clearEncounter: () => {
      set(state => ({
        ...state,
        pendingEncounter: null,
        version: state.version + 1,
      }));
    },
  };
});
