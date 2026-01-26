/**
 * Field descriptions and help text for map generation editor.
 * These explain the role and impact of each configuration parameter.
 */

export const FIELD_DESCRIPTIONS = {
  // World Configuration
  seed: {
    title: 'Seed',
    description:
      'Deterministic seed for world generation. Same seed + config = same world. Use random seed for variety.',
  },

  // Algorithm Selection
  generatorType: {
    title: 'Generator Algorithm',
    description:
      'Select the algorithm used for world generation. Currently only Voronoi-based generation is available.',
  },

  // Voronoi Configuration
  maxDistance: {
    title: 'Max Distance',
    description:
      'Candidate boundary distance (in hex steps) for Voronoi generation. Defines the maximum possible distance from center for any hex in the world. This is the hard limit for world size.',
  },
  coverage: {
    title: 'Coverage',
    description:
      'Target coverage as a fraction of maxDistance (0-1). Determines desired world size: radius = coverage × maxDistance, tiles = 1 + 3×R×(R+1). Higher = larger world, but limited by maxDistance.',
  },
  pointsCount: {
    title: 'Points Count',
    description:
      'Number of Voronoi sites (regions). More points = more biome regions, smaller individual regions. Affects biome distribution.',
  },
  sitesMaxDistance: {
    title: 'Sites Max Distance',
    description:
      'Maximum distance (in hex steps) where Voronoi sites can spawn, relative to the world center. Controls how far from center biome regions can start. Should be <= maxDistance.',
  },
  jitter: {
    title: 'Jitter',
    description:
      'Noise jitter strength (0-1) applied to boundaries. 0 = pure Voronoi (sharp boundaries), higher = more organic/wavy boundaries.',
  },
  minSiteDistance: {
    title: 'Min Site Distance',
    description:
      'Minimum distance between Voronoi sites. Prevents sites from clustering. Auto-calculated if not set. Higher = more uniform distribution.',
  },
  maxSiteSampleAttempts: {
    title: 'Max Site Sample Attempts',
    description:
      'Maximum attempts when placing sites with spacing constraints. Higher = more uniform placement but slower generation. Default: 600.',
  },
} as const;

export type FieldKey = keyof typeof FIELD_DESCRIPTIONS;
