import { BIOMES } from '../world/biomes';
import type { HexBiome, Rarity } from '../world/types';
import { DEFAULT_PLAYER_POKEMON, POKEMON_REGISTRY } from '../pokemon/presets';
import type { Pokemon } from '../pokemon/pokemon';

const RARITY_WEIGHT: Record<Rarity, number> = {
  COMMON: 7,
  UNCOMMON: 2,
  RARE: 1,
};

function getFallbackEnemyPool(): Pokemon[] {
  return Object.values(POKEMON_REGISTRY).filter(
    p => p.id !== DEFAULT_PLAYER_POKEMON.id
  );
}

export function createEnemyPoolForBiome(biome: HexBiome): Pokemon[] {
  const cfg = BIOMES[biome];
  if (!cfg) return getFallbackEnemyPool();

  const out: Pokemon[] = [];

  (Object.keys(cfg.encounterPool) as Rarity[]).forEach(rarity => {
    const entries = cfg.encounterPool[rarity] ?? [];
    const w = Math.max(1, RARITY_WEIGHT[rarity] ?? 1);

    for (const e of entries) {
      const template = POKEMON_REGISTRY[e.pokemonId];
      if (!template) continue;
      for (let i = 0; i < w; i += 1) out.push(template);
    }
  });

  return out.length > 0 ? out : getFallbackEnemyPool();
}
