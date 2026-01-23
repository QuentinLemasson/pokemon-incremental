import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { HelpCircle, Save, Download, Upload, Trash2 } from 'lucide-react';
import {
  generateMaps,
  DEFAULT_WORLD_GENERATION,
} from '@/features/engine/world/generator';
import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';
import { createSeedString } from '@/features/engine/world/generation/seed';
import { MapPreview } from '@/features/ui/mapView/components/MapPreview';
import type { HexMapTile } from '@/features/ui/mapView/components/HexMapSvg';
import { BIOMES } from '@/features/engine/world/biomes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/ui/card';
import { Separator } from '@/common/ui/separator';
import { Input } from '@/common/ui/input';
import { Label } from '@/common/ui/label';
import { Button } from '@/common/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/common/ui/tooltip';
import { FIELD_DESCRIPTIONS } from './mapGen/fieldDescriptions';
import {
  savePreset,
  loadAllPresets,
  deletePreset,
  type Preset,
} from './mapGen/presetManager';

export const MapGenPage = () => {
  const [config, setConfig] = useState<WorldGenerationConfig>(() => ({
    ...DEFAULT_WORLD_GENERATION,
    seed: createSeedString(),
  }));

  const [generatedHexes, setGeneratedHexes] = useState(() =>
    generateMaps(config)
  );

  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState<Preset[]>(loadAllPresets());

  const previewTiles: HexMapTile[] = useMemo(
    () =>
      generatedHexes.map(hex => ({
        id: hex.id,
        biome: hex.biome,
        explored: true,
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

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    savePreset(presetName.trim(), config);
    setPresets(loadAllPresets());
    setPresetName('');
  };

  const handleLoadPreset = (preset: Preset) => {
    setConfig(preset.config);
    handleGenerate();
  };

  const handleDeletePreset = (id: string) => {
    deletePreset(id);
    setPresets(loadAllPresets());
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `map-config-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(
          e.target?.result as string
        ) as WorldGenerationConfig;
        setConfig(imported);
        handleGenerate();
      } catch {
        alert('Failed to import config: Invalid JSON');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const tileCount = generatedHexes.length;

  const FieldWithTooltip = ({
    fieldKey,
    children,
  }: {
    fieldKey: keyof typeof FIELD_DESCRIPTIONS;
    children: React.ReactNode;
  }) => {
    const field = FIELD_DESCRIPTIONS[fieldKey];
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>{field.title}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{field.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {children}
      </div>
    );
  };

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

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Map Generator</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportConfig}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild className="gap-2">
              <span>
                <Upload className="h-4 w-4" />
                Import
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-[450px_1fr] gap-6 flex-1 min-h-0">
        {/* Controls Panel */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-4">
          <Tabs defaultValue="world" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="world">World</TabsTrigger>
              <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
              <TabsTrigger value="biomes">Biomes</TabsTrigger>
            </TabsList>

            {/* World Configuration Tab */}
            <TabsContent value="world" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>World Configuration</CardTitle>
                  <CardDescription>
                    Global settings that affect world size and generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldWithTooltip fieldKey="seed">
                    <div className="flex gap-2">
                      <Input
                        value={config.seed}
                        onChange={e => updateConfig('seed', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRandomSeed}
                      >
                        Random
                      </Button>
                    </div>
                  </FieldWithTooltip>

                  <FieldWithTooltip fieldKey="radius">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>Value: {config.radius}</span>
                        <span>
                          Tiles: {1 + 3 * config.radius * (config.radius + 1)}
                        </span>
                      </div>
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
                  </FieldWithTooltip>

                  <FieldWithTooltip fieldKey="minTiles">
                    <Input
                      type="number"
                      min="1"
                      value={config.minTiles ?? ''}
                      onChange={e =>
                        updateConfig(
                          'minTiles',
                          e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined
                        )
                      }
                      placeholder="No limit"
                    />
                  </FieldWithTooltip>

                  <FieldWithTooltip fieldKey="maxTiles">
                    <Input
                      type="number"
                      min="1"
                      value={config.maxTiles ?? ''}
                      onChange={e =>
                        updateConfig(
                          'maxTiles',
                          e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined
                        )
                      }
                      placeholder="No limit"
                    />
                  </FieldWithTooltip>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Algorithm Configuration Tab */}
            <TabsContent value="algorithm" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generator Algorithm</CardTitle>
                  <CardDescription>
                    Select and configure the generation algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldWithTooltip fieldKey="generatorType">
                    <select
                      value={config.generator.type}
                      className="w-full px-3 py-2 border border-slate-600 rounded bg-slate-800 text-white"
                      disabled
                    >
                      <option value="centered_voronoi_noise_v1">
                        Centered Voronoi Noise v1
                      </option>
                    </select>
                  </FieldWithTooltip>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-300">
                      Voronoi Parameters
                    </h3>

                    <FieldWithTooltip fieldKey="maxRadius">
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">
                          Value:{' '}
                          {config.generator.centeredVoronoiNoise.maxRadius}
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="15"
                          value={
                            config.generator.centeredVoronoiNoise.maxRadius
                          }
                          onChange={e =>
                            updateGeneratorConfig(
                              'maxRadius',
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </FieldWithTooltip>

                    <FieldWithTooltip fieldKey="pointsCount">
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">
                          Value:{' '}
                          {config.generator.centeredVoronoiNoise.pointsCount}
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="24"
                          value={
                            config.generator.centeredVoronoiNoise.pointsCount
                          }
                          onChange={e =>
                            updateGeneratorConfig(
                              'pointsCount',
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </FieldWithTooltip>

                    <FieldWithTooltip fieldKey="sitesMaxRadius">
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">
                          Value:{' '}
                          {config.generator.centeredVoronoiNoise.sitesMaxRadius}
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="12"
                          value={
                            config.generator.centeredVoronoiNoise.sitesMaxRadius
                          }
                          onChange={e =>
                            updateGeneratorConfig(
                              'sitesMaxRadius',
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </FieldWithTooltip>

                    <FieldWithTooltip fieldKey="jitter">
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">
                          Value:{' '}
                          {config.generator.centeredVoronoiNoise.jitter.toFixed(
                            2
                          )}
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={config.generator.centeredVoronoiNoise.jitter}
                          onChange={e =>
                            updateGeneratorConfig(
                              'jitter',
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </FieldWithTooltip>

                    <FieldWithTooltip fieldKey="minSiteDistance">
                      <Input
                        type="number"
                        min="1"
                        value={
                          config.generator.centeredVoronoiNoise
                            .minSiteDistance ?? ''
                        }
                        onChange={e =>
                          updateGeneratorConfig(
                            'minSiteDistance',
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined
                          )
                        }
                        placeholder="Auto"
                      />
                    </FieldWithTooltip>

                    <FieldWithTooltip fieldKey="maxSiteSampleAttempts">
                      <Input
                        type="number"
                        min="50"
                        value={
                          config.generator.centeredVoronoiNoise
                            .maxSiteSampleAttempts ?? ''
                        }
                        onChange={e =>
                          updateGeneratorConfig(
                            'maxSiteSampleAttempts',
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined
                          )
                        }
                        placeholder="Default: 600"
                      />
                    </FieldWithTooltip>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Biomes Configuration Tab */}
            <TabsContent value="biomes" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Biome Configuration</CardTitle>
                  <CardDescription>
                    View and configure biome settings (read-only for now)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.values(BIOMES).map(biome => (
                    <Card key={biome.id} className="bg-slate-800">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: biome.color }}
                          />
                          <CardTitle className="text-base">
                            {biome.name}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-400">Type:</span>{' '}
                            {biome.type}
                          </div>
                          <div>
                            <span className="text-slate-400">Level Range:</span>{' '}
                            {biome.levelRange.min}-{biome.levelRange.max}
                          </div>
                          <div>
                            <span className="text-slate-400">
                              Clear Threshold:
                            </span>{' '}
                            {biome.clearTreshold}
                          </div>
                          <div>
                            <span className="text-slate-400">
                              Travel Threshold:
                            </span>{' '}
                            {biome.travelThreshold}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Presets Section */}
          <Card>
            <CardHeader>
              <CardTitle>Presets</CardTitle>
              <CardDescription>
                Save and load configuration presets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={presetName}
                  onChange={e => setPresetName(e.target.value)}
                  placeholder="Preset name"
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSavePreset();
                  }}
                />
                <Button
                  onClick={handleSavePreset}
                  disabled={!presetName.trim()}
                  size="sm"
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>

              {presets.length > 0 && (
                <div className="space-y-2">
                  <Separator />
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {presets.map(preset => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between p-2 bg-slate-800 rounded text-sm"
                      >
                        <span className="truncate flex-1">{preset.name}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoadPreset(preset)}
                            className="h-7 px-2"
                          >
                            Load
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePreset(preset.id)}
                            className="h-7 px-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button onClick={handleGenerate} className="w-full" size="lg">
            Generate Map
          </Button>
          <p className="text-sm text-slate-400 text-center">
            {tileCount} tiles generated
          </p>
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
