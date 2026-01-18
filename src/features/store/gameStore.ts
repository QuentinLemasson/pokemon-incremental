import { create } from 'zustand';
import { Game } from '../engine/game/game';

// Define the shape of your store
export interface GameState {
  game: Game;
  version: number; // Version counter to force re-renders when game state changes
  exploreHex: (id: string) => void;
}

// Create the store with proper TypeScript typing
export const useGameStore = create<GameState>(set => {
  const game = new Game();

  return {
    game,
    version: 0,
    exploreHex: (id: string) => {
      console.log('exploring hex', id);
      // Mutate the game object directly
      game.exploreHex(id);
      // Trigger a re-render by incrementing version counter
      // This ensures React components re-render when game state changes
      set(state => ({ ...state, version: state.version + 1 }));
    },
  };
});
