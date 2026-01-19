import { create } from 'zustand';
import { engineLoop } from '../engine/runtime/engineLoop';

declare global {
  var __POKE_RPG_LOG_STORE_BOUND__: boolean | undefined;
}

export type LogEntry = {
  id: number;
  message: string;
  ts: number;
};

export type LogState = {
  entries: LogEntry[];
  clear: () => void;
};

/**
 * Log store: immutable log entries for the UI.
 *
 * The engine emits log lines; the store just appends them for display.
 */
export const useLogStore = create<LogState>(() => {
  engineLoop.start();

  if (!globalThis.__POKE_RPG_LOG_STORE_BOUND__) {
    globalThis.__POKE_RPG_LOG_STORE_BOUND__ = true;
    engineLoop.onLog(message => {
      useLogStore.setState(state => ({
        entries: [
          ...state.entries,
          { id: state.entries.length + 1, message, ts: Date.now() },
        ],
      }));
    });
  }

  return {
    entries: [],
    clear: () => useLogStore.setState({ entries: [] }),
  };
});
