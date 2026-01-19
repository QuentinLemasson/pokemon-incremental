import type { SeedString } from './seed';

export type WorldGeneratorType = 'centered_voronoi_noise_v1';

export type CenteredVoronoiNoiseConfig = {
  /**
   * Candidate grid boundary radius (in hex steps) used to build an organic world shape.
   * The final world is a connected subset ("blob") selected from this candidate area.
   */
  maxRadius: number;

  /** Number of sites (regions). */
  pointsCount: number;
  /**
   * Max radius (in hex steps) where sites may spawn, relative to the world center.
   * Should be <= `maxRadius`.
   */
  sitesMaxRadius: number;
  /**
   * Jitter strength (in hex-distance units) applied as hash-noise to boundaries.
   * 0 => pure Voronoi.
   */
  jitter: number;
  /**
   * Optional minimum distance between sites to improve uniform coverage.
   * If omitted, an internal heuristic is used.
   */
  minSiteDistance?: number;
  /**
   * Max attempts used for sampling sites with spacing constraints.
   * Higher values -> more uniform, slower.
   */
  maxSiteSampleAttempts?: number;
};

export type WorldGenerationConfig = {
  seed: SeedString;
  /**
   * World radius (hex distance from center to corners).
   * Tile count is stable for a given radius: \(1 + 3R(R+1)\).
   */
  radius: number;
  /**
   * Optional hardcaps on tile count (used to clamp radius).
   * This ensures “similar coverage” between seeds by keeping size constant
   * (or at least within bounds).
   */
  minTiles?: number;
  maxTiles?: number;
  generator: {
    type: WorldGeneratorType;
    centeredVoronoiNoise: CenteredVoronoiNoiseConfig;
  };
};
