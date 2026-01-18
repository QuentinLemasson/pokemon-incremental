export function resolveCombat(
  playerPower: number,
  enemyPower: number
): boolean {
  return playerPower >= enemyPower;
}
