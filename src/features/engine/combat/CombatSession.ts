import type { BaseStats } from '../pokemon/pokemon';
import { Combatant } from './Combatant';
import { CombatLog } from './CombatLog';
import { CombatResult } from './CombatResult';
import {
  DEF_REDUCTION_DIVISOR,
  MAX_ACTIONS_PER_TICK,
  MIN_DAMAGE,
} from './gauge.config';
import { TICK_DURATION } from '../runtime/tick.config';

/**
 * Deterministic tick-based combat orchestrator.
 *
 * Responsibilities (P1 prototype):
 * - Owns player + enemy combatants.
 * - Advances time only via `tick()` (fixed timestep).
 * - Resolves attacks using a gauge (ATB-like) system.
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
   * @returns `CombatResult` when combat ends, otherwise null.
   */
  tick(): CombatResult | null {
    if (this.result) return this.result;

    this.tickCount += 1;
    this.elapsedSeconds += TICK_DURATION / 1000;

    // 1) Gauges advance deterministically (same tick for both).
    if (this.player.alive) this.player.tickGauge();
    if (this.enemy.alive) this.enemy.tickGauge();

    // 2) Resolve actions within the same tick as long as gauge overflows.
    // Deterministic tie-breaks:
    // - If both are ready: higher gauge acts first; if equal, player first.
    let actions = 0;
    while (
      actions < MAX_ACTIONS_PER_TICK &&
      this.player.alive &&
      this.enemy.alive
    ) {
      const playerReady = this.player.ready;
      const enemyReady = this.enemy.ready;

      if (!playerReady && !enemyReady) break;

      let attackerSide: 'player' | 'enemy';
      if (playerReady && enemyReady) {
        if (this.player.gauge === this.enemy.gauge) attackerSide = 'player';
        else
          attackerSide =
            this.player.gauge > this.enemy.gauge ? 'player' : 'enemy';
      } else {
        attackerSide = playerReady ? 'player' : 'enemy';
      }

      if (attackerSide === 'player') {
        this.player.consumeGaugeForAction();
        this.resolveAttack('player', 'enemy');
        if (!this.enemy.alive) return this.endCombat('player');
      } else {
        this.enemy.consumeGaugeForAction();
        this.resolveAttack('enemy', 'player');
        if (!this.player.alive) return this.endCombat('enemy');
      }

      actions += 1;
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
  const raw = attacker.atk - Math.floor(defender.def / DEF_REDUCTION_DIVISOR);
  return Math.max(MIN_DAMAGE, raw);
}
