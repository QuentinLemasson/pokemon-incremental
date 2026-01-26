import { useState } from 'react';
import type {
  WorldGenerationConfig,
  ChunkConfig,
  CenteredVoronoiNoiseConfig,
  GeneratorConfig,
} from '@/features/engine/world/generation/types';
import { BIOMES, BIOME_IDS } from '@/features/engine/world/biomes';
import { loadChunkConfigs } from '@/features/engine/world/chunk-config/loadChunkConfigs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/ui/card';
import { Button } from '@/common/ui/button';
import { Input } from '@/common/ui/input';
import { FieldWithTooltip } from '@/common/components/FieldWithTooltip';
import { Separator } from '@/common/ui/separator';

type ChunksConfigTabProps = {
  config: WorldGenerationConfig;
  onUpdateConfig: <K extends keyof WorldGenerationConfig>(
    key: K,
    value: WorldGenerationConfig[K]
  ) => void;
  onUpdateChunk: (chunkId: string, updates: Partial<ChunkConfig>) => void;
};

export const ChunksConfigTab = ({
  config,
  onUpdateConfig,
  onUpdateChunk,
}: ChunksConfigTabProps) => {
  const [expandedChunk, setExpandedChunk] = useState<string | null>(
    config.chunks[0]?.id ?? null
  );

  const handleLoadChunksFromFiles = () => {
    const loadedChunks = loadChunkConfigs();
    onUpdateConfig('chunks', loadedChunks);
    if (loadedChunks.length > 0) {
      setExpandedChunk(loadedChunks[0].id);
    }
  };

  const handleUpdateChunkBiomeList = (
    chunkId: string,
    biomeId: string,
    checked: boolean
  ) => {
    const chunk = config.chunks.find(c => c.id === chunkId);
    if (!chunk) return;

    const newBiomeList = checked
      ? [...chunk.biomeList, biomeId]
      : chunk.biomeList.filter(id => id !== biomeId);

    onUpdateChunk(chunkId, { biomeList: newBiomeList });
  };

  const handleUpdateChunkGeneratorOverride = <
    K extends keyof CenteredVoronoiNoiseConfig,
  >(
    chunkId: string,
    key: K,
    value: CenteredVoronoiNoiseConfig[K] | undefined
  ) => {
    const chunk = config.chunks.find(c => c.id === chunkId);
    if (!chunk) return;

    const existingCustomGenerator = chunk.customGenerator;
    const existingNoise = existingCustomGenerator?.centeredVoronoiNoise ?? {};

    // If value is undefined, remove the override (use base value)
    // Otherwise, set the override
    const newNoiseEntries = Object.entries(existingNoise).filter(
      ([k]) => k !== key
    );
    if (value !== undefined) {
      newNoiseEntries.push([key, value]);
    }
    const newNoise = Object.fromEntries(
      newNoiseEntries
    ) as Partial<CenteredVoronoiNoiseConfig>;

    // If noise config is empty and no other custom generator settings, remove customGenerator entirely
    if (
      Object.keys(newNoise ?? {}).length === 0 &&
      !existingCustomGenerator?.type
    ) {
      onUpdateChunk(chunkId, { customGenerator: undefined });
    } else {
      // customGenerator is Partial<GeneratorConfig>
      // Note: TypeScript's Partial<GeneratorConfig> makes centeredVoronoiNoise optional but not partial
      // However, in practice we allow partial overrides, so we use a type assertion
      const updatedCustomGenerator = {
        type: existingCustomGenerator?.type ?? 'centered_voronoi_noise_v1',
        centeredVoronoiNoise: newNoise,
      } as Partial<GeneratorConfig>;
      onUpdateChunk(chunkId, { customGenerator: updatedCustomGenerator });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chunks Configuration</CardTitle>
        <CardDescription>
          Configure chunks: select biomes and override generator settings per
          chunk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadChunksFromFiles}
            className="flex-1"
          >
            Load Chunks from Files
          </Button>
        </div>

        <div className="text-sm text-slate-400">
          {config.chunks.length} chunk(s) loaded
        </div>

        <Separator />

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {config.chunks.map(chunk => {
            const isExpanded = expandedChunk === chunk.id;
            const baseGenerator = config.baseGenerator.centeredVoronoiNoise;
            const chunkGenerator =
              chunk.customGenerator?.centeredVoronoiNoise ??
              ({} as Partial<typeof baseGenerator>);

            return (
              <Card key={chunk.id} className="bg-slate-800">
                <CardHeader
                  className="pb-3 cursor-pointer"
                  onClick={() => setExpandedChunk(isExpanded ? null : chunk.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {chunk.id} ({chunk.coord.q}, {chunk.coord.r})
                    </CardTitle>
                    <span className="text-sm text-slate-400">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-4">
                    {/* Biome List Selection */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">
                        Biome List
                      </h4>
                      <div className="space-y-2">
                        {BIOME_IDS.map(biomeId => {
                          const biome = BIOMES[biomeId];
                          const isSelected = chunk.biomeList.includes(biomeId);
                          return (
                            <label
                              key={biomeId}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e =>
                                  handleUpdateChunkBiomeList(
                                    chunk.id,
                                    biomeId,
                                    e.target.checked
                                  )
                                }
                                className="rounded"
                              />
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: biome.color }}
                                />
                                <span className="text-sm">{biome.name}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Generator Overrides */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">
                        Generator Overrides (optional)
                      </h4>
                      <div className="text-xs text-slate-400 mb-3">
                        Leave empty to use base generator settings
                      </div>

                      <div className="space-y-3">
                        <FieldWithTooltip
                          field={{
                            title: 'Max Distance Override',
                            description:
                              'Override maxDistance for this chunk (clamped by chunkRadius). Leave empty to use base value.',
                          }}
                        >
                          <Input
                            type="number"
                            min="1"
                            max={config.chunkRadius}
                            value={
                              chunkGenerator.maxDistance !== undefined
                                ? chunkGenerator.maxDistance
                                : ''
                            }
                            onChange={e => {
                              const value = e.target.value
                                ? parseInt(e.target.value, 10)
                                : undefined;
                              handleUpdateChunkGeneratorOverride(
                                chunk.id,
                                'maxDistance',
                                value
                              );
                            }}
                            placeholder={`Base: ${baseGenerator.maxDistance}`}
                          />
                        </FieldWithTooltip>

                        <FieldWithTooltip
                          field={{
                            title: 'Coverage Override',
                            description:
                              'Override coverage for this chunk. Leave empty to use base value.',
                          }}
                        >
                          <div className="space-y-2">
                            <div className="text-sm text-slate-400">
                              Value:{' '}
                              {(
                                (chunkGenerator.coverage !== undefined
                                  ? chunkGenerator.coverage
                                  : baseGenerator.coverage) * 100
                              ).toFixed(0)}
                              %{' '}
                              {chunkGenerator.coverage !== undefined && (
                                <span className="text-xs">(override)</span>
                              )}
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={
                                chunkGenerator.coverage !== undefined
                                  ? chunkGenerator.coverage
                                  : baseGenerator.coverage
                              }
                              onChange={e =>
                                handleUpdateChunkGeneratorOverride(
                                  chunk.id,
                                  'coverage',
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                            {chunkGenerator.coverage !== undefined && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateChunkGeneratorOverride(
                                    chunk.id,
                                    'coverage',
                                    undefined
                                  )
                                }
                                className="w-full"
                              >
                                Reset to Base
                              </Button>
                            )}
                          </div>
                        </FieldWithTooltip>

                        <FieldWithTooltip
                          field={{
                            title: 'Points Count Override',
                            description:
                              'Override pointsCount for this chunk. Leave empty to use base value.',
                          }}
                        >
                          <Input
                            type="number"
                            min="1"
                            value={
                              chunkGenerator.pointsCount !== undefined
                                ? chunkGenerator.pointsCount
                                : ''
                            }
                            onChange={e => {
                              const value = e.target.value
                                ? parseInt(e.target.value, 10)
                                : undefined;
                              handleUpdateChunkGeneratorOverride(
                                chunk.id,
                                'pointsCount',
                                value
                              );
                            }}
                            placeholder={`Base: ${baseGenerator.pointsCount}`}
                          />
                        </FieldWithTooltip>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {config.chunks.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              No chunks loaded. Click "Load Chunks from Files" to load chunk
              configurations.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
