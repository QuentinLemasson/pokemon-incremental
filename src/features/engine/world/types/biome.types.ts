export type BiomeType = 'FOREST' | 'PLAINS' | 'MOUNTAIN';

/**
 * World tile biome identifier.
 *
 * Biomes are data-driven, so this is a free-form id (backed by `BiomeConfig.id`).
 */
export type HexBiome = string;

export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE';

export type EncounterEntry = {
  pokemonId: string;
};

export type EncounterPool = Record<Rarity, EncounterEntry[]>;

export type Range = {
  min: number;
  max: number;
};

export type LevelRarityAddition = Record<Rarity, number>;

export type BiomeConfig = {
  id: string;
  name: string;
  type: BiomeType;
  color: string;
  encounterPool: EncounterPool;
  clearTreshold: number;
  travelThreshold: number;
  levelRange: Range;
  rarityLevelBonus: LevelRarityAddition;
};
