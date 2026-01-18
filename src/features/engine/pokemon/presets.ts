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

/**
 * The default player Pokémon template (always present for now).
 */
export const DEFAULT_PLAYER_POKEMON = createPokemon({
  id: 'player-001',
  name: 'Sprout',
  type: mono('grass'),
  level: 1,
  hp: 25,
  atk: 8,
  def: 6,
});

/**
 * Small pool of enemy Pokémon templates (used to pick a random opponent).
 */
export const DEFAULT_ENEMY_POKEMON_POOL: Pokemon[] = [
  createPokemon({
    id: 'enemy-001',
    name: 'Emberling',
    type: mono('fire'),
    level: 1,
    hp: 18,
    atk: 9,
    def: 4,
  }),
  createPokemon({
    id: 'enemy-002',
    name: 'Ripple',
    type: mono('water'),
    level: 1,
    hp: 22,
    atk: 7,
    def: 6,
  }),
  createPokemon({
    id: 'enemy-003',
    name: 'Pebble',
    type: mono('rock'),
    level: 1,
    hp: 28,
    atk: 6,
    def: 8,
  }),
];
