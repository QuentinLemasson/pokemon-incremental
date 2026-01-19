import { create } from 'zustand';
import { engineLoop } from '../engine/runtime/engineLoop';
import type { EncounterSnapshot } from '../engine/combat/combatManager';

declare global {
  var __POKE_RPG_COMBAT_STORE_BOUND__: boolean | undefined;
}

export type CombatState = {
  encounter: EncounterSnapshot | null;
  startCombat: () => void;
  closeEncounter: () => void;
};

/**
 * Combat store: UI-facing encounter snapshot + combat intents.
 *
 * No combat decision logic; delegates to `engineLoop` / `CombatManager`.
 */
export const useCombatStore = create<CombatState>(() => {
  engineLoop.start();

  if (!globalThis.__POKE_RPG_COMBAT_STORE_BOUND__) {
    globalThis.__POKE_RPG_COMBAT_STORE_BOUND__ = true;
    engineLoop.onEncounter(encounter => {
      useCombatStore.setState({ encounter });
    });
  }

  return {
    encounter: engineLoop.getEncounterSnapshot(),
    startCombat: () => engineLoop.startCombat(),
    closeEncounter: () => engineLoop.closeEncounter(),
  };
});
