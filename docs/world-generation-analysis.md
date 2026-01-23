# World Generation Feature Analysis

## Overview
This document analyzes the world generation feature (`src/features/engine/world`) to identify magic numbers, configuration patterns, and design strategies.

---

## Magic Numbers

### Generator Configuration (`generator.ts`)
- **`radius: 6`** (line 17) - Default world radius in hex steps
- **`maxRadius: 8`** (line 24) - Candidate boundary radius for Voronoi generation
- **`pointsCount: 12`** (line 25) - Number of Voronoi sites/regions
- **`sitesMaxRadius: 6`** (line 26) - Maximum radius where sites can spawn
- **`jitter: 0.35`** (line 27) - Noise jitter strength for organic boundaries
- **`minSiteDistance: 2`** (line 28) - Minimum distance between Voronoi sites
- **`maxSiteSampleAttempts: 1200`** (line 29) - Maximum attempts for site sampling

### Tile Calculation (`generator.ts`)
- **`1 + 3 * r * (r + 1)`** (line 119) - Formula for tiles in a hexagon of radius `r`
  - This is the standard hexagon tile count formula
  - Could be extracted as a named constant or utility function

### Voronoi Generation (`centeredVoronoiNoise.generator.ts`)
- **`1337`** (line 92) - Salt value for shape score noise calculation
- **`50`** (line 46) - Minimum attempts for site sampling (fallback)
- **`600`** (line 47) - Default max site sample attempts if not provided
- **`Math.sqrt(pointsCount)`** (line 42) - Heuristic for calculating minSiteDistance

### Seed/RNG (`seed.ts`)
- **`0x811c9dc5`** (line 34) - FNV-1a hash initial value
- **`0x01000193`** (line 37) - FNV-1a hash multiplier
- **`0x6d2b79f5`** (line 55) - Mulberry32 RNG increment
- **`0x9e3779b1`**, **`0x85ebca6b`**, **`0x7feb352d`**, **`0x846ca68b`** (lines 88-91) - Noise mixing constants
- **`4294967296`** (line 59) - 2^32 for float normalization
- **`0xffffffff`** (line 93) - Max uint32 for noise normalization

### Biome Configuration
- **`clearTreshold: 10`** - Number of fights to clear a hex (all biomes)
- **`travelThreshold: 5`** - Threshold for travel (all biomes)
- Level ranges vary by biome:
  - Windswept Plains: `min: 2, max: 5`
  - Verdant Forest: `min: 4, max: 7`
  - Canaro Mountains: `min: 6, max: 10`
- Rarity level bonuses:
  - COMMON: `0` (all biomes)
  - UNCOMMON: `1-2` (varies by biome)
  - RARE: `3-5` (varies by biome)

### Encounter Configuration (`encounter.config.ts`)
- **`FIGHTS_TO_CLEAR_HEX = 5`** - Number of fights required to clear a hex

---

## Configuration Patterns

### 1. **Nested Configuration Structure**
The world generation uses a deeply nested configuration pattern:
```typescript
WorldGenerationConfig
  ├── seed: string
  ├── radius: number
  ├── minTiles?: number
  ├── maxTiles?: number
  └── generator
      ├── type: 'centered_voronoi_noise_v1'
      └── centeredVoronoiNoise
          ├── maxRadius
          ├── pointsCount
          ├── sitesMaxRadius
          ├── jitter
          ├── minSiteDistance?
          └── maxSiteSampleAttempts?
```

**Pattern**: Configuration is split into:
- Top-level: World size constraints (`radius`, `minTiles`, `maxTiles`)
- Generator-specific: Algorithm parameters (`centeredVoronoiNoise.*`)

### 2. **Default Configuration Object**
`DEFAULT_WORLD_GENERATION` serves as a single source of truth for default values.

**Pattern**: Centralized defaults with spread operator for overrides.

### 3. **Optional Constraints with Fallbacks**
- `minSiteDistance` has a fallback calculation if not provided
- `maxSiteSampleAttempts` has a default of 600 if not provided
- Tile count constraints (`minTiles`, `maxTiles`) are optional

**Pattern**: Sensible defaults with optional overrides.

### 4. **Biome Data Structure**
Biomes are defined as static configuration objects with:
- ID, name, type, color (visual/identity)
- Encounter pools (gameplay)
- Thresholds and ranges (progression)

**Pattern**: Data-driven biome definitions with consistent structure.

---

## Design Strategies

### 1. **Deterministic Generation**
- All randomness is seeded
- Same seed + config = same world
- Uses custom RNG (`mulberry32`) for performance
- Hash-based noise for jitter

**Strategy**: Reproducible procedural generation for testing and sharing seeds.

### 2. **Two-Phase Generation**
1. **Candidate Generation**: Create a full hexagon within `maxRadius`
2. **Selection Phase**: Grow a connected "blob" using best-first expansion

**Strategy**: Separates shape definition from selection, allowing organic boundaries.

### 3. **Voronoi-Based Biome Assignment**
- Sites are placed with spacing constraints
- Each coordinate assigned to nearest site
- Noise jitter applied for organic boundaries

**Strategy**: Creates natural-looking biome regions with smooth transitions.

### 4. **Connected Blob Growth**
- Starts from center (`q0-r0`)
- Uses min-heap for best-first expansion
- Score based on Voronoi distance + noise

**Strategy**: Ensures world is always connected and has organic shape.

### 5. **Axial Coordinate System**
- Uses axial coordinates (q, r) for hexagons
- Standard 6-direction neighbor pattern
- Distance calculated using cube coordinates (s = -q - r)

**Strategy**: Efficient hex grid representation (Red Blob Games pattern).

### 6. **Separation of Concerns**
- `generator.ts`: World shape generation
- `centeredVoronoiNoise.generator.ts`: Voronoi algorithm
- `worldManager.ts`: State management
- `hex.ts`: Individual hex data

**Strategy**: Modular design with clear responsibilities.

### 7. **Snapshot Pattern**
- `WorldManager` maintains internal state
- Exposes immutable snapshots to UI
- Prevents direct mutation from outside

**Strategy**: Encapsulation and controlled state updates.

---

## Recommendations

### Extract Magic Numbers to Constants
1. Create `WORLD_GENERATION_CONSTANTS.ts` for:
   - Default radius values
   - Voronoi parameters
   - Tile calculation formulas
   - RNG constants

2. Create `BIOME_CONSTANTS.ts` for:
   - Default thresholds
   - Level range presets
   - Rarity bonuses

### Configuration Validation
Add runtime validation for:
- `radius >= 0`
- `maxRadius >= sitesMaxRadius`
- `pointsCount > 0`
- `jitter >= 0 && jitter <= 1` (or reasonable max)

### Type Safety
- Consider branded types for `SeedString` to prevent mixing with regular strings
- Add validation types for configuration ranges

### Documentation
- Add JSDoc comments explaining the formulas (e.g., hex tile count)
- Document the Voronoi algorithm parameters and their effects
- Explain the blob growth strategy

### Testing
- Unit tests for tile count formula
- Tests for deterministic generation (same seed = same result)
- Tests for configuration validation
- Tests for blob connectivity

---

## Configuration Surface Area

The world generation has **15+ configurable parameters**:
- 1 seed
- 3 size constraints (radius, minTiles, maxTiles)
- 6 Voronoi parameters
- 5+ biome-specific parameters per biome

This suggests a UI editor would be valuable for:
- Visualizing parameter effects
- Testing different configurations
- Sharing interesting seeds/configs
