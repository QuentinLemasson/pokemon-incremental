export type HexBiome = 'forest' | 'plains' | 'mountain';

export class Hex {
  id: string;
  biome: HexBiome;
  explored = false;
  cleared = false;

  constructor(id: string, biome: HexBiome) {
    this.id = id;
    this.biome = biome;
  }

  startCombat() {
    console.log('starting combat', this.id);
    this.cleared = true;
    console.log('combat ended', this.id);
  }
}
