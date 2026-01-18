/**
 * Gauge-based combat configuration (P1).
 *
 * Keep all tunables here so the combat system stays easy to tweak without
 * refactoring the simulation logic.
 */

/**
 * Base gauge gain per tick, independent of speed.
 *
 * Units: gauge points / tick.
 */
export const GAUGE_BASE_GAIN_PER_TICK = 1;

/**
 * Additional gauge gain per tick derived from the Pokémon speed stat.
 *
 * We use a logarithmic curve to avoid speed exploding at high values while still
 * making low-to-mid speed increases feel impactful.
 */
export const GAUGE_SPEED_GAIN_MULTIPLIER = 1.5;

/**
 * Controls how quickly speed contributes to the log curve.
 *
 * Larger value => speed has a smaller effect.
 */
export const SPEED_LOG_DENOMINATOR = 20;

/**
 * Base "time to act" window expressed as ticks.
 *
 * P1 spec: "X * 40 ticks" where 40 ticks = 2 seconds at 20 TPS.
 */
export const GAUGE_MAX_BASE_TICKS = 40;

/**
 * Multiplier (X) applied to `GAUGE_MAX_BASE_TICKS`.
 *
 * Increasing this slows everyone down; decreasing speeds everyone up.
 */
export const GAUGE_MAX_MULTIPLIER = 1;

/**
 * Safety cap to prevent infinite loops if configuration ever causes
 * a combatant to gain too much gauge in a single tick.
 */
export const MAX_ACTIONS_PER_TICK = 10;

/**
 * Prototype damage constants.
 */
export const MIN_DAMAGE = 1;
export const DEF_REDUCTION_DIVISOR = 2; // damage = atk - def/divisor

/**
 * Computes the gauge max (threshold) for a given speed stat.
 *
 * P1: keep it mostly constant (X * 40 ticks). If later you want speed to also
 * affect the threshold (not just gain), adjust it here.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function computeGaugeMaxFromSpeed(_speed: number): number {
  return GAUGE_MAX_BASE_TICKS * GAUGE_MAX_MULTIPLIER;
}

/**
 * Computes the per-tick gauge gain for a given speed stat.
 *
 * P1 spec:
 * - "base amount" + "logarithmic interpolation of its speed stat"
 */
export function computeGaugeGainPerTickFromSpeed(speed: number): number {
  const speedTerm = Math.log1p(Math.max(0, speed) / SPEED_LOG_DENOMINATOR);
  return GAUGE_BASE_GAIN_PER_TICK + GAUGE_SPEED_GAIN_MULTIPLIER * speedTerm;
}
