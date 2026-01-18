import type { Pokemon } from '../pokemon/pokemon';
import {
  computeGaugeGainPerTickFromSpeed,
  computeGaugeMaxFromSpeed,
} from './gauge.config';

/**
 * Per-combat mutable state for a Pokémon.
 *
 * Role (P1 prototype):
 * - Wraps a `Pokemon` template.
 * - Holds mutable combat state: HP and gauge (ATB-like system).
 * - Exists only during combat (no persistence outside the combat session).
 */
export class Combatant {
  /** The immutable Pokémon template this combatant is based on. */
  readonly pokemon: Pokemon;

  /** Current HP during this combat. */
  currentHp: number;

  /**
   * Current gauge value.
   *
   * When `gauge >= gaugeMax`, the combatant can act (attack).
   * Overflow carries over after acting.
   */
  gauge: number;

  /**
   * Gauge threshold required to perform an action.
   * (Configurable via `gauge.config.ts`.)
   */
  readonly gaugeMax: number;

  /** Cached per-tick gain derived from the Pokémon speed stat. */
  readonly gaugeGainPerTick: number;

  constructor(params: { pokemon: Pokemon }) {
    this.pokemon = params.pokemon;
    this.currentHp = params.pokemon.baseStats.hp;
    this.gauge = 0;
    this.gaugeMax = computeGaugeMaxFromSpeed(params.pokemon.baseStats.spd);
    this.gaugeGainPerTick = computeGaugeGainPerTickFromSpeed(
      params.pokemon.baseStats.spd
    );
  }

  /** True if HP > 0. */
  get alive(): boolean {
    return this.currentHp > 0;
  }

  /**
   * Advances gauge by one tick.
   * (Gauge gain is fixed per combatant and derived from speed.)
   */
  tickGauge() {
    this.gauge += this.gaugeGainPerTick;
  }

  /** True if this combatant can act right now. */
  get ready(): boolean {
    return this.gauge >= this.gaugeMax;
  }

  /**
   * Consumes gauge for a single action, preserving overflow.
   * Should only be called if `ready` is true.
   */
  consumeGaugeForAction() {
    this.gauge -= this.gaugeMax;
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
