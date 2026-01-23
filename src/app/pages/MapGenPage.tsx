import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  generateMaps,
  DEFAULT_WORLD_GENERATION,
} from '@/features/engine/world/generator';
import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';
import { createSeedString } from '@/features/engine/world/generation/seed';
import { MapPreview } from '@/features/ui/mapView/components/MapPreview';
import type { HexMapTile } from '@/features/ui/mapView/components/HexMapSvg';

export const MapGenPage = () => {
  const [config, setConfig] = useState<WorldGenerationConfig>(() => ({
    ...DEFAULT_WORLD_GENERATION,
    seed: createSeedString(),
  }));

  const [generatedHexes, setGeneratedHexes] = useState(() =>
    generateMaps(config)
  );

  const previewTiles: HexMapTile[] = useMemo(
    () =>
      generatedHexes.map(hex => ({
        id: hex.id,
        biome: hex.biome,
        explored: true, // Show all tiles as explored in preview
        cleared: false,
        coordinates: hex.coordinates,
      })),
    [generatedHexes]
  );

  const handleGenerate = () => {
    const newHexes = generateMaps(config);
    setGeneratedHexes(newHexes);
  };

  const handleRandomSeed = () => {
    const newSeed = createSeedString();
    setConfig(prev => ({ ...prev, seed: newSeed }));
  };

  const updateConfig = <K extends keyof WorldGenerationConfig>(
    key: K,
    value: WorldGenerationConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateGeneratorConfig = <
    K extends keyof WorldGenerationConfig['generator']['centeredVoronoiNoise'],
  >(
    key: K,
    value: WorldGenerationConfig['generator']['centeredVoronoiNoise'][K]
  ) => {
    setConfig(prev => ({
      ...prev,
      generator: {
        ...prev.generator,
        centeredVoronoiNoise: {
          ...prev.generator.centeredVoronoiNoise,
          [key]: value,
        },
      },
    }));
  };

  const tileCount = generatedHexes.length;

  return (
    <div className="flex flex-col min-h-screen p-8 bg-slate-900 text-white">
      <div className="mb-6">
        <Link
          to="/game"
          className="text-sm text-slate-400 hover:text-slate-300"
        >
          ← Back to game
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Map Generator</h1>

      <div className="grid grid-cols-[400px_1fr] gap-6 flex-1 min-h-0">
        {/* Controls Panel */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">World Configuration</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Seed</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.seed}
                  onChange={e => updateConfig('seed', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-600 rounded bg-slate-800 text-white text-sm"
                />
                <button
                  onClick={handleRandomSeed}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  Random
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Radius: {config.radius}
              </label>
              <input
                type="range"
                min="3"
                max="12"
                value={config.radius}
                onChange={e =>
                  updateConfig('radius', parseInt(e.target.value, 10))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Min Tiles (optional)
              </label>
              <input
                type="number"
                min="1"
                value={config.minTiles ?? ''}
                onChange={e =>
                  updateConfig(
                    'minTiles',
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-slate-600 rounded bg-slate-800 text-white"
                placeholder="No limit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Tiles (optional)
              </label>
              <input
                type="number"
                min="1"
                value={config.maxTiles ?? ''}
                onChange={e =>
                  updateConfig(
                    'maxTiles',
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-slate-600 rounded bg-slate-800 text-white"
                placeholder="No limit"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Voronoi Configuration</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Radius: {config.generator.centeredVoronoiNoise.maxRadius}
              </label>
              <input
                type="range"
                min="4"
                max="15"
                value={config.generator.centeredVoronoiNoise.maxRadius}
                onChange={e =>
                  updateGeneratorConfig(
                    'maxRadius',
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Points Count:{' '}
                {config.generator.centeredVoronoiNoise.pointsCount}
              </label>
              <input
                type="range"
                min="4"
                max="24"
                value={config.generator.centeredVoronoiNoise.pointsCount}
                onChange={e =>
                  updateGeneratorConfig(
                    'pointsCount',
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Sites Max Radius:{' '}
                {config.generator.centeredVoronoiNoise.sitesMaxRadius}
              </label>
              <input
                type="range"
                min="2"
                max="12"
                value={config.generator.centeredVoronoiNoise.sitesMaxRadius}
                onChange={e =>
                  updateGeneratorConfig(
                    'sitesMaxRadius',
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Jitter:{' '}
                {config.generator.centeredVoronoiNoise.jitter.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.generator.centeredVoronoiNoise.jitter}
                onChange={e =>
                  updateGeneratorConfig('jitter', parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Min Site Distance:{' '}
                {config.generator.centeredVoronoiNoise.minSiteDistance ??
                  'auto'}
              </label>
              <input
                type="number"
                min="1"
                value={
                  config.generator.centeredVoronoiNoise.minSiteDistance ?? ''
                }
                onChange={e =>
                  updateGeneratorConfig(
                    'minSiteDistance',
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-slate-600 rounded bg-slate-800 text-white"
                placeholder="Auto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Site Sample Attempts:{' '}
                {config.generator.centeredVoronoiNoise.maxSiteSampleAttempts ??
                  'default'}
              </label>
              <input
                type="number"
                min="50"
                value={
                  config.generator.centeredVoronoiNoise.maxSiteSampleAttempts ??
                  ''
                }
                onChange={e =>
                  updateGeneratorConfig(
                    'maxSiteSampleAttempts',
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-slate-600 rounded bg-slate-800 text-white"
                placeholder="Default: 600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleGenerate}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded font-semibold transition-colors"
            >
              Generate Map
            </button>
            <p className="text-sm text-slate-400 text-center">
              {tileCount} tiles generated
            </p>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col min-h-0">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <p className="text-sm text-slate-400">
              Generated map with {tileCount} tiles
            </p>
          </div>
          <div className="flex-1 min-h-0 border border-slate-700 rounded overflow-hidden">
            <MapPreview tiles={previewTiles} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
