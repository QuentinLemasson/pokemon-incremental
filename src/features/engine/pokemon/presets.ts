import { Pokemon, type PokemonType, type Type } from './pokemon';

/**
 * Utility to create a very small set of Pokémon templates for the P1 prototype.
 *
 * Notes:
 * - These are **engine-level templates**, not UI fixtures.
 * - Per-combat mutable state is created by wrapping templates in `Combatant`.
 * - Stats are intentionally simple and can be adjusted later.
 */

function createPokemon(params: {
  id: string;
  name: string;
  type: PokemonType;
  level?: number;
  hp: number;
  atk: number;
  def: number;
  spAtk?: number;
  spDef?: number;
  spd?: number;
}) {
  return new Pokemon({
    id: params.id,
    name: params.name,
    type: params.type,
    level: params.level ?? 1,
    baseStats: {
      hp: params.hp,
      atk: params.atk,
      def: params.def,
      spAtk: params.spAtk ?? 1,
      spDef: params.spDef ?? 1,
      spd: params.spd ?? 1,
    },
  });
}

function mono(t: Type): PokemonType {
  return [t, null];
}

function duo(t1: Type, t2: Type): PokemonType {
  return [t1, t2];
}

/**
 * Small pool of enemy Pokémon templates (used to pick a random opponent).
 */
export const DEFAULT_ENEMY_POKEMON_POOL: Pokemon[] = [];

export const POKEMON_REGISTRY: Record<string, Pokemon> = {
  // PLAINS
  // common
  zigzaton: createPokemon({
    id: 'zigzaton',
    name: 'Zigzaton',
    type: mono('normal'),
    level: 1,
    hp: 38,
    atk: 30,
    def: 41,
    spd: 65,
  }),
  doduo: createPokemon({
    id: 'doduo',
    name: 'Doduo',
    type: duo('flying', 'normal'),
    level: 1,
    hp: 35,
    atk: 85,
    def: 45,
    spd: 75,
  }),
  gourmelet: createPokemon({
    id: 'gourmelet',
    name: 'Gourmelet',
    type: mono('normal'),
    level: 1,
    hp: 54,
    atk: 45,
    def: 40,
    spd: 35,
  }),
  moumouton: createPokemon({
    id: 'moumouton',
    name: 'Moumouton',
    type: mono('normal'),
    level: 1,
    hp: 42,
    atk: 40,
    def: 55,
    spd: 48,
  }),
  // uncommon
  voltoutou: createPokemon({
    id: 'voltoutou',
    name: 'Voltoutou',
    type: mono('electric'),
    level: 1,
    hp: 59,
    atk: 45,
    def: 50,
    spd: 26,
  }),
  crikzik: createPokemon({
    id: 'crikzik',
    name: 'Crikzik',
    type: mono('bug'),
    level: 1,
    hp: 37,
    atk: 25,
    def: 41,
    spd: 25,
  }),
  // rare
  tauros: createPokemon({
    id: 'tauros',
    name: 'Tauros',
    type: mono('normal'),
    level: 1,
    hp: 75,
    atk: 100,
    def: 95,
    spd: 110,
  }),
  // FOREST
  // common
  tissemboule: createPokemon({
    id: 'tissemboule',
    name: 'Tissemboule',
    type: mono('bug'),
    level: 1,
    hp: 35,
    atk: 41,
    def: 45,
    spd: 20,
  }),
  hoothoot: createPokemon({
    id: 'doduo',
    name: 'Doduo',
    type: duo('flying', 'normal'),
    level: 1,
    hp: 60,
    atk: 30,
    def: 30,
    spd: 50,
  }),
  lepidonille: createPokemon({
    id: 'lepidonille',
    name: 'Lépidonille',
    type: mono('bug'),
    level: 1,
    hp: 38,
    atk: 35,
    def: 40,
    spd: 35,
  }),
  paras: createPokemon({
    id: 'paras',
    name: 'Paras',
    type: duo('bug', 'grass'),
    level: 1,
    hp: 35,
    atk: 70,
    def: 55,
    spd: 25,
  }),
  // uncommon
  grainipiot: createPokemon({
    id: 'grainipiot',
    name: 'Grainipiot',
    type: mono('grass'),
    level: 1,
    hp: 40,
    atk: 40,
    def: 50,
    spd: 30,
  }),
  croquine: createPokemon({
    id: 'croquine',
    name: 'Croquine',
    type: mono('grass'),
    level: 1,
    hp: 42,
    atk: 30,
    def: 38,
    spd: 32,
  }),
  // rare
  scarhino: createPokemon({
    id: 'scarhino',
    name: 'Scarhino',
    type: duo('bug', 'fighting'),
    level: 1,
    hp: 80,
    atk: 125,
    def: 75,
    spd: 85,
  }),
  // Mountains
  // common
  machoc: createPokemon({
    id: 'machoc',
    name: 'Machoc',
    type: mono('fighting'),
    level: 1,
    hp: 70,
    atk: 80,
    def: 50,
    spd: 35,
  }),
  selutin: createPokemon({
    id: 'selutin',
    name: 'Selutin',
    type: mono('rock'),
    level: 1,
    hp: 55,
    atk: 55,
    def: 75,
    spd: 25,
  }),
  furaiglon: createPokemon({
    id: 'furaiglon',
    name: 'Furaiglon',
    type: duo('normal', 'flying'),
    level: 1,
    hp: 70,
    atk: 83,
    def: 50,
    spd: 60,
  }),
  khelocrok: createPokemon({
    id: 'khelocrok',
    name: 'Khélocrok',
    type: duo('water', 'rock'),
    level: 1,
    hp: 50,
    atk: 64,
    def: 50,
    spd: 44,
  }),
  // uncommon
  cabriolaine: createPokemon({
    id: 'cabriolaine',
    name: 'Cabriolaine',
    type: mono('grass'),
    level: 1,
    hp: 66,
    atk: 65,
    def: 48,
    spd: 52,
  }),
  nodulithe: createPokemon({
    id: 'nodulithe',
    name: 'Nodulithe',
    type: mono('rock'),
    level: 1,
    hp: 55,
    atk: 75,
    def: 85,
    spd: 15,
  }),
  // rare
  airmure: createPokemon({
    id: 'airmure',
    name: 'Airmure',
    type: duo('flying', 'steel'),
    level: 1,
    hp: 65,
    atk: 80,
    def: 140,
    spd: 70,
  }),
  // player's pokemon
  koraidon: createPokemon({
    id: 'koraidon',
    name: 'Koraidon',
    type: duo('fighting', 'dragon'),
    level: 1,
    hp: 100,
    atk: 135,
    def: 115,
    spd: 135,
  }),
};

/**
 * The default player Pokémon template (always present for now).
 */
export const DEFAULT_PLAYER_POKEMON = POKEMON_REGISTRY.koraidon;
