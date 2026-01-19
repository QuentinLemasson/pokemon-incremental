import { create } from 'zustand';
import { engineLoop } from '../engine/runtime/engineLoop';
import type { Pokemon } from '../engine/pokemon/pokemon';
import { DEFAULT_PLAYER_POKEMON } from '../engine/pokemon/presets';

declare global {
  var __POKE_RPG_ENGINE_STORE_BOUND__: boolean | undefined;
}

export type EngineState = {
  tps: number;
  playerPokemon: Pokemon;
};

/**
 * Engine store: UI-facing diagnostics and top-level runtime signals.
 *
 * No gameplay decisions; just reflects engine runtime state.
 */
export const useEngineStore = create<EngineState>(() => {
  // Ensure engine loop is running once.
  engineLoop.start();

  const initial: EngineState = {
    tps: 0,
    playerPokemon: DEFAULT_PLAYER_POKEMON,
  };

  if (!globalThis.__POKE_RPG_ENGINE_STORE_BOUND__) {
    globalThis.__POKE_RPG_ENGINE_STORE_BOUND__ = true;
    engineLoop.onTps(tps => {
      useEngineStore.setState({ tps });
    });
  }

  return initial;
});
