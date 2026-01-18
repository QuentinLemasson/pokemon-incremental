import type { BaseStats } from '../pokemon/pokemon';
import { Combatant } from './Combatant';
import { CombatLog } from './CombatLog';
import { CombatResult } from './CombatResult';

/**
 * Deterministic tick-based combat orchestrator.
 *
 * Responsibilities (P1 prototype):
 * - Owns player + enemy combatants.
 * - Advances time only via `tick(dtSeconds)` (fixed dt recommended).
 * - Resolves attacks when cooldown reaches 0.
 * - Detects combat end and produces a `CombatResult`.
 *
 * Rules:
 * - No world/map knowledge.
 * - No UI knowledge.
 * - No side effects outside itself (except writing to its `CombatLog`).
 */
export class Combat {
  readonly player: Combatant;
  readonly enemy: Combatant;
  readonly log: CombatLog;

  private elapsedSeconds = 0;
  private tickCount = 0;
  private result: CombatResult | null = null;

  constructor(params: {
    player: Combatant;
    enemy: Combatant;
    log?: CombatLog;
  }) {
    this.player = params.player;
    this.enemy = params.enemy;
    this.log = params.log ?? new CombatLog();

    this.log.push({ type: 'combat_start', tick: 0, elapsedSeconds: 0 });
  }

  /** True once a `CombatResult` has been produced. */
  get ended(): boolean {
    return this.result !== null;
  }

  /** The result if the combat has ended; otherwise null. */
  getResult(): CombatResult | null {
    return this.result;
  }

  /**
   * Advances the simulation by a single tick.
   *
   * @param dtSeconds Fixed tick delta (P1 recommended: 0.05).
   * @returns `CombatResult` when combat ends, otherwise null.
   */
  tick(dtSeconds: number): CombatResult | null {
    if (this.result) return this.result;

    this.tickCount += 1;
    this.elapsedSeconds += dtSeconds;

    this.player.tick(dtSeconds);
    this.enemy.tick(dtSeconds);

    // Deterministic resolution order for P1:
    // - Player attack first, then enemy (if still alive).
    if (
      this.player.alive &&
      this.enemy.alive &&
      this.player.attackCooldownRemainingSeconds <= 0
    ) {
      this.resolveAttack('player', 'enemy');
      if (!this.enemy.alive) return this.endCombat('player');
    }

    if (
      this.player.alive &&
      this.enemy.alive &&
      this.enemy.attackCooldownRemainingSeconds <= 0
    ) {
      this.resolveAttack('enemy', 'player');
      if (!this.player.alive) return this.endCombat('enemy');
    }

    return null;
  }

  private endCombat(winner: 'player' | 'enemy'): CombatResult {
    const result = new CombatResult({
      winner,
      durationSeconds: this.elapsedSeconds,
      ticks: this.tickCount,
    });
    this.result = result;
    this.log.push({
      type: 'combat_end',
      tick: this.tickCount,
      elapsedSeconds: this.elapsedSeconds,
      winner,
    });
    return result;
  }

  private resolveAttack(
    attackerSide: 'player' | 'enemy',
    defenderSide: 'player' | 'enemy'
  ) {
    const attacker = attackerSide === 'player' ? this.player : this.enemy;
    const defender = defenderSide === 'player' ? this.player : this.enemy;

    const damage = computePrototypeDamage(
      attacker.pokemon.baseStats,
      defender.pokemon.baseStats
    );
    const defenderHpAfter = defender.receiveDamage(damage);

    attacker.resetCooldown();

    this.log.push({
      type: 'attack',
      tick: this.tickCount,
      elapsedSeconds: this.elapsedSeconds,
      attacker: attackerSide,
      defender: defenderSide,
      damage,
      defenderHpAfter,
    });
  }
}

/**
 * Ultra-simple prototype damage function.
 *
 * P1 constraints:
 * - Based on attacker ATK vs defender DEF
 * - Always >= 1
 * - No crits, no types, no misses
 */
function computePrototypeDamage(
  attacker: BaseStats,
  defender: BaseStats
): number {
  const raw = attacker.atk - Math.floor(defender.def / 2);
  return Math.max(1, raw);
}
