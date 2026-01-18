import type { Pokemon } from '../pokemon/pokemon';

/**
 * Per-combat mutable state for a Pokémon.
 *
 * Role (P1 prototype):
 * - Wraps a `Pokemon` template.
 * - Holds mutable combat state: HP and attack cooldown timers.
 * - Exists only during combat (no persistence outside the combat session).
 */
export class Combatant {
  /** The immutable Pokémon template this combatant is based on. */
  readonly pokemon: Pokemon;

  /** Current HP during this combat. */
  currentHp: number;

  /** Remaining cooldown in seconds until next attack. */
  attackCooldownRemainingSeconds: number;
  /** Total cooldown duration in seconds (used for UI progress bars). */
  readonly attackCooldownTotalSeconds: number;

  constructor(params: {
    pokemon: Pokemon;
    /** Defaults to 1 second. */
    attackCooldownTotalSeconds?: number;
  }) {
    this.pokemon = params.pokemon;
    this.currentHp = params.pokemon.baseStats.hp;
    this.attackCooldownTotalSeconds = params.attackCooldownTotalSeconds ?? 1;
    this.attackCooldownRemainingSeconds = this.attackCooldownTotalSeconds;
  }

  /** True if HP > 0. */
  get alive(): boolean {
    return this.currentHp > 0;
  }

  /**
   * Decreases cooldown by dt seconds. Cooldown is clamped to 0.
   * @param dtSeconds Fixed tick delta (P1: 0.05s).
   */
  tick(dtSeconds: number) {
    this.attackCooldownRemainingSeconds = Math.max(
      0,
      this.attackCooldownRemainingSeconds - dtSeconds
    );
  }

  /** Resets the cooldown to its total duration. */
  resetCooldown() {
    this.attackCooldownRemainingSeconds = this.attackCooldownTotalSeconds;
  }

  /**
   * Applies damage (minimum 0) and clamps HP to 0.
   * @returns The defender HP after damage.
   */
  receiveDamage(damage: number): number {
    const dmg = Math.max(0, Math.floor(damage));
    this.currentHp = Math.max(0, this.currentHp - dmg);
    return this.currentHp;
  }
}
