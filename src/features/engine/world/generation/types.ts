import type { SeedString } from './seed';

export type WorldGeneratorType = 'centered_voronoi_noise_v1';

export type CenteredVoronoiNoiseConfig = {
  /**
   * Candidate grid boundary distance (in hex steps) used to build an organic world shape.
   * The final world is a connected subset ("blob") selected from this candidate area.
   * This is the maximum possible distance from center for any hex in the world.
   */
  maxDistance: number;

  /**
   * Target coverage (as a fraction of maxDistance, between 0 and 1).
   * Determines the desired world size via the formula: tiles = 1 + 3×R×(R+1)
   * where R = coverage × maxDistance.
   * The actual world size will be limited by `maxDistance` (the candidate pool boundary).
   */
  coverage: number;

  /** Number of sites (regions). */
  pointsCount: number;
  /**
   * Max distance (in hex steps) where sites may spawn, relative to the world center.
   * Should be <= `maxDistance`.
   */
  sitesMaxDistance: number;
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
  generator: {
    type: WorldGeneratorType;
    centeredVoronoiNoise: CenteredVoronoiNoiseConfig;
  };
};
