import { create } from 'zustand';
import {
  engineLoop,
  type WorldHexSnapshot,
} from '../engine/runtime/engineLoop';

declare global {
  var __POKE_RPG_WORLD_STORE_BOUND__: boolean | undefined;
}

export type WorldState = {
  hexes: WorldHexSnapshot[];
  onHexClicked: (hexId: string) => void;
};

/**
 * World store: UI-facing world snapshot + world intents.
 *
 * Does not implement world rules; delegates to `engineLoop` / `WorldManager`.
 */
export const useWorldStore = create<WorldState>(() => {
  engineLoop.start();

  if (!globalThis.__POKE_RPG_WORLD_STORE_BOUND__) {
    globalThis.__POKE_RPG_WORLD_STORE_BOUND__ = true;
    engineLoop.onWorld(hexes => {
      useWorldStore.setState({ hexes });
    });
  }

  return {
    hexes: engineLoop.getWorldSnapshot(),
    onHexClicked: (hexId: string) => engineLoop.onHexClicked(hexId),
  };
});
