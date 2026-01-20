import { generateMaps } from '../world/generator';
import type { Hex } from '../world/hex';

export class Game {
  maps: Hex[];

  constructor() {
    this.maps = generateMaps();
  }

  exploreHex(hexId: string) {
    const hex = this.maps.find((hex: Hex) => hex.id === hexId);
    if (!hex || hex.explored) return;

    hex.explored = true;
    console.log('hex explored', hex.id);
  }
}
