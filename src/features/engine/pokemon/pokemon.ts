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

export class Pokemon {
  id: string;
  name: string;
  type: PokemonType;
  level: number;
  baseStats: BaseStats;
  currentHp: number;

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
    this.currentHp = baseStats.hp;
  }
}
