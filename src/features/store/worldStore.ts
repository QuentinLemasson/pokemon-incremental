import { create } from 'zustand';
import { engineLoop, type WorldSnapshot } from '../engine/runtime/engineLoop';
import type { VoronoiContext } from '../engine/world/types';

declare global {
  var __POKE_RPG_WORLD_STORE_BOUND__: boolean | undefined;
}

export type WorldState = {
  world: WorldSnapshot;
  voronoiContext: VoronoiContext | undefined;
  onHexClicked: (hexId: string) => void;
  onHexHovered: (hexId: string | null) => void;
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
      useWorldStore.setState({ world: hexes });
    });
  }

  return {
    world: engineLoop.getWorldSnapshot(),
    voronoiContext: engineLoop.getVoronoiContext(),
    onHexClicked: (hexId: string) => engineLoop.onHexClicked(hexId),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onHexHovered: (_hexId: string | null) => {
      // Hook for later (engineLoop can expose a hover intent if needed).
    },
  };
});
