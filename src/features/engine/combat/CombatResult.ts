/**
 * The immutable outcome of a finished combat.
 *
 * Role:
 * - Consumed by the game/engine layer to apply world progression.
 * - Not consumed as gameplay logic by the UI (UI may display it).
 */
export class CombatResult {
  /** Winner side. */
  readonly winner: 'player' | 'enemy';
  /** Total simulated duration in seconds. */
  readonly durationSeconds: number;
  /** Total simulated ticks processed by the combat. */
  readonly ticks: number;

  constructor(params: {
    winner: 'player' | 'enemy';
    durationSeconds: number;
    ticks: number;
  }) {
    this.winner = params.winner;
    this.durationSeconds = params.durationSeconds;
    this.ticks = params.ticks;
  }

  /** Convenience boolean for common game logic. */
  get victory(): boolean {
    return this.winner === 'player';
  }
}
