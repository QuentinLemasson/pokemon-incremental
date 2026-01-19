/**
 * Encounter / exploration configuration.
 *
 * This controls how many fights are chained when a hex is explored.
 * Keep this in a dedicated file so progression tuning is easy.
 */

/**
 * Number of fights to win to clear a hex.
 *
 * P1: simple constant.
 * Later: can be derived from biome, difficulty, player progression, etc.
 */
export const FIGHTS_TO_CLEAR_HEX = 5;
