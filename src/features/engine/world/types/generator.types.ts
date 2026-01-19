export type WorldGenConfig = {
  /**
   * World radius (hex distance from center to corners).
   */
  radius: number;

  /**
   * Optional hardcaps on tile count (used to clamp radius).
   * Useful to ensure stable/controlled world size across seeds.
   */
  minTiles?: number;
  maxTiles?: number;
};
