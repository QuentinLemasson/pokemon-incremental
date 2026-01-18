/**
 * A single log event emitted by `Combat` for debugging/validation.
 *
 * Notes:
 * - Designed for P1 determinism validation (you can diff logs between runs).
 * - This is engine data; the UI may render it but must never influence logic.
 */
export type CombatLogEvent =
  | {
      /**
       * Engine/system message (non-simulation).
       *
       * Use this for UX/debug messages emitted by the game layer
       * (e.g. encounter created/closed) before the combat tick loop exists.
       */
      type: 'system';
      /** Monotonic sequence (store-controlled), useful for ordering. */
      sequence: number;
      message: string;
    }
  | {
      type: 'combat_start';
      tick: number;
      elapsedSeconds: number;
    }
  | {
      type: 'attack';
      tick: number;
      elapsedSeconds: number;
      attacker: 'player' | 'enemy';
      defender: 'player' | 'enemy';
      damage: number;
      defenderHpAfter: number;
    }
  | {
      type: 'combat_end';
      tick: number;
      elapsedSeconds: number;
      winner: 'player' | 'enemy';
    };

/**
 * Append-only combat log.
 *
 * Role:
 * - Collect deterministic events from `Combat` to validate tick decisions.
 * - Can be safely disabled in production by never reading/rendering it.
 */
export class CombatLog {
  /** Append-only list of events emitted by the combat simulation. */
  readonly events: CombatLogEvent[] = [];

  /**
   * Adds an event to the log.
   * Keep this method side-effect free beyond pushing to `events`.
   */
  push(event: CombatLogEvent) {
    this.events.push(event);
  }

  /** Clears the log (useful for repeated simulations in dev tools). */
  clear() {
    this.events.length = 0;
  }
}
