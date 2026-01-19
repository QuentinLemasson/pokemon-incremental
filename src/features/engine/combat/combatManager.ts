import type { Pokemon } from '../pokemon/pokemon';
import { Combatant } from './Combatant';
import { Combat } from './CombatSession';
import { CombatLog, type CombatLogEvent } from './CombatLog';

export type EncounterSnapshot = {
  hexId: string;
  fightIndex: number;
  fightTarget: number;
  running: boolean;
  ended: boolean;
  result: { victory: boolean; ticks: number } | null;
  player: {
    name: string;
    level: number;
    spd: number;
    hp: number;
    hpMax: number;
    gauge: number;
    gaugeMax: number;
    gaugeGainPerTick: number;
  };
  enemy: {
    name: string;
    level: number;
    spd: number;
    hp: number;
    hpMax: number;
    gauge: number;
    gaugeMax: number;
    gaugeGainPerTick: number;
  };
};

type CreateEncounterParams = {
  hexId: string;
  playerPokemon: Pokemon;
  enemyPool: Pokemon[];
  fightsToClear: number;
};

type TickResult =
  | { type: 'log'; message: string }
  | { type: 'world_cleared'; hexId: string }
  | null;

/**
 * CombatManager
 *
 * Low-level combat session logic:
 * - Creates encounters
 * - Runs combat ticks
 * - Chains fights on victory (new enemy each time)
 * - Reuses the same player `Combatant` instance across all fights in the encounter
 *
 * Stores should not decide fight chaining or enemy selection: they only
 * invoke intents (start/close) and display snapshots.
 */
export class CombatManager {
  private encounter: {
    hexId: string;
    fightIndex: number;
    fightTarget: number;
    enemyPool: Pokemon[];
    player: Combatant;
    enemy: Combatant;
    combat: Combat;
    running: boolean;
  } | null = null;

  private readonly log = new CombatLog();
  private lastLogIndex = 0;

  getSnapshot(): EncounterSnapshot | null {
    if (!this.encounter) return null;
    const { hexId, fightIndex, fightTarget, player, enemy, combat, running } =
      this.encounter;

    const result = combat.getResult();

    return {
      hexId,
      fightIndex,
      fightTarget,
      running,
      ended: combat.ended,
      result: result ? { victory: result.victory, ticks: result.ticks } : null,
      player: toSnapshot(player),
      enemy: toSnapshot(enemy),
    };
  }

  createEncounter(params: CreateEncounterParams) {
    // reset log cursor for this encounter
    this.lastLogIndex = this.log.events.length;

    const player = new Combatant({ pokemon: params.playerPokemon });
    const enemyPokemon = pickRandom(params.enemyPool);
    const enemy = new Combatant({ pokemon: enemyPokemon });
    const combat = new Combat({ player, enemy, log: this.log });

    this.encounter = {
      hexId: params.hexId,
      fightIndex: 1,
      fightTarget: params.fightsToClear,
      enemyPool: params.enemyPool,
      player,
      enemy,
      combat,
      running: false,
    };
  }

  startCombat(): boolean {
    if (!this.encounter) return false;
    if (this.encounter.running) return false;
    if (this.encounter.combat.ended) return false;
    this.encounter.running = true;
    return true;
  }

  closeEncounter(): boolean {
    if (!this.encounter) return false;
    this.encounter = null;
    return true;
  }

  onTick(): TickResult {
    if (!this.encounter) return null;
    if (!this.encounter.running) return null;

    // advance simulation
    const result = this.encounter.combat.tick();

    // surface new combat log events as human-readable lines
    const maybeLog = this.emitNewLogLines();
    if (maybeLog) return maybeLog;

    // handle end-of-fight transitions
    if (!result) return null;

    if (result.victory) {
      const nextFightIndex = this.encounter.fightIndex + 1;

      if (nextFightIndex > this.encounter.fightTarget) {
        // encounter complete
        this.encounter.running = false;
        return { type: 'world_cleared', hexId: this.encounter.hexId };
      }

      // chain: new enemy, same player instance
      this.encounter.fightIndex = nextFightIndex;
      const enemyPokemon = pickRandom(this.encounter.enemyPool);
      const newEnemy = new Combatant({ pokemon: enemyPokemon });
      this.encounter.enemy = newEnemy;
      this.encounter.combat = new Combat({
        player: this.encounter.player,
        enemy: newEnemy,
        log: this.log,
      });

      return {
        type: 'log',
        message: `Enemy defeated. Next fight ${this.encounter.fightIndex}/${this.encounter.fightTarget}`,
      };
    }

    // defeat: stop running, keep encounter open for UI to close
    this.encounter.running = false;
    return { type: 'log', message: 'Defeat' };
  }

  private emitNewLogLines(): TickResult {
    if (this.lastLogIndex >= this.log.events.length) return null;

    const event = this.log.events[this.lastLogIndex] as CombatLogEvent;
    this.lastLogIndex += 1;

    if (event.type === 'attack') {
      return {
        type: 'log',
        message: `t=${event.tick} ${event.attacker}->${event.defender} dmg=${event.damage} hp=${event.defenderHpAfter}`,
      };
    }

    if (event.type === 'combat_end') {
      return {
        type: 'log',
        message: `t=${event.tick} end winner=${event.winner}`,
      };
    }

    if (event.type === 'combat_start') {
      return { type: 'log', message: `t=${event.tick} start` };
    }

    if (event.type === 'system') {
      return { type: 'log', message: `#${event.sequence} ${event.message}` };
    }

    return null;
  }
}

function toSnapshot(c: Combatant) {
  return {
    name: c.pokemon.name,
    level: c.pokemon.level,
    spd: c.pokemon.baseStats.spd,
    hp: c.currentHp,
    hpMax: c.pokemon.baseStats.hp,
    gauge: c.gauge,
    gaugeMax: c.gaugeMax,
    gaugeGainPerTick: c.gaugeGainPerTick,
  };
}

function pickRandom<T>(pool: T[]): T {
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// Placeholder for future deterministic/seeded selection + variety rules.
// TODO (later): replace `pickRandom` with seeded deterministic RNG + variety rules.
