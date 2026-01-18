/**
 * Legacy helper kept temporarily while the engine is being refactored.
 *
 * @deprecated Use `Combat` instead.
 */
export function resolveCombat(
  playerPower: number,
  enemyPower: number
): boolean {
  return playerPower >= enemyPower;
}
