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
  radius: {
    title: 'World Radius',
    description:
      'Target world radius in hex steps. Controls overall world size. Formula: tiles = 1 + 3×R×(R+1). Higher = larger world.',
  },
  minTiles: {
    title: 'Min Tiles',
    description:
      'Optional minimum tile count. World will grow until it reaches at least this many tiles. Useful for ensuring minimum size.',
  },
  maxTiles: {
    title: 'Max Tiles',
    description:
      'Optional maximum tile count. World will be capped at this size. Useful for performance or consistency across seeds.',
  },

  // Algorithm Selection
  generatorType: {
    title: 'Generator Algorithm',
    description:
      'Select the algorithm used for world generation. Currently only Voronoi-based generation is available.',
  },

  // Voronoi Configuration
  maxRadius: {
    title: 'Max Radius',
    description:
      'Candidate boundary radius for Voronoi generation. Defines the maximum area where candidate tiles can exist. Should be >= world radius.',
  },
  pointsCount: {
    title: 'Points Count',
    description:
      'Number of Voronoi sites (regions). More points = more biome regions, smaller individual regions. Affects biome distribution.',
  },
  sitesMaxRadius: {
    title: 'Sites Max Radius',
    description:
      'Maximum radius where Voronoi sites can spawn. Controls how far from center biome regions can start. Should be <= maxRadius.',
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
