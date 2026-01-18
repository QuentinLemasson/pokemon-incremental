export type Type =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type PokemonType = [Type, Type | null];

export type BaseStats = {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  spd: number;
};

/**
 * Immutable Pokémon template used by the engine.
 *
 * Role (P1 prototype):
 * - Contains identity, types, level, and base stats.
 * - Contains **no combat timers**, **no combat logic**, and **no mutable combat state**.
 *
 * Mutable per-combat state lives in `Combatant` (current HP, cooldowns, etc.).
 */
export class Pokemon {
  /** Stable identifier (e.g. Pokédex id or internal id). */
  readonly id: string;
  /** Display name. */
  readonly name: string;
  /** Pokémon types (primary, secondary or null). */
  readonly type: PokemonType;
  /** Level used for scaling (prototype may keep this simple). */
  readonly level: number;
  /** Base stats template. */
  readonly baseStats: BaseStats;

  constructor({
    id,
    name,
    type,
    baseStats,
    level = 1,
  }: {
    id: string;
    name: string;
    type: PokemonType;
    baseStats: BaseStats;
    level?: number;
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.level = level;
    this.baseStats = baseStats;
  }
}
