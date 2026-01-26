import { useState, useCallback } from 'react';
import type {
  WorldGenerationConfig,
  ChunkConfig,
} from '@/features/engine/world/generation/types';
import { DEFAULT_WORLD_GENERATION } from '@/features/engine/world/generator';
import { createSeedString } from '@/features/engine/world/generation/seed';
import { loadChunkConfigs } from '@/features/engine/world/chunk-config/loadChunkConfigs';

/**
 * Hook for managing map generation configuration state.
 */
export function useMapGenConfig(initialConfig?: WorldGenerationConfig) {
  const [config, setConfig] = useState<WorldGenerationConfig>(
    () =>
      initialConfig ?? {
        ...DEFAULT_WORLD_GENERATION,
        seed: createSeedString(),
        chunks: loadChunkConfigs(), // Load chunks from files on initialization
      }
  );

  const updateConfig = useCallback(
    <K extends keyof WorldGenerationConfig>(
      key: K,
      value: WorldGenerationConfig[K]
    ) => {
      setConfig(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateGeneratorConfig = useCallback(
    <
      K extends
        keyof WorldGenerationConfig['baseGenerator']['centeredVoronoiNoise'],
    >(
      key: K,
      value: WorldGenerationConfig['baseGenerator']['centeredVoronoiNoise'][K]
    ) => {
      setConfig(prev => ({
        ...prev,
        baseGenerator: {
          ...prev.baseGenerator,
          centeredVoronoiNoise: {
            ...prev.baseGenerator.centeredVoronoiNoise,
            [key]: value,
          },
        },
      }));
    },
    []
  );

  const updateChunk = useCallback(
    (chunkId: string, updates: Partial<ChunkConfig>) => {
      setConfig(prev => ({
        ...prev,
        chunks: prev.chunks.map(chunk =>
          chunk.id === chunkId ? { ...chunk, ...updates } : chunk
        ),
      }));
    },
    []
  );

  const randomizeSeed = useCallback(() => {
    const newSeed = createSeedString();
    setConfig(prev => ({ ...prev, seed: newSeed }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig({
      ...DEFAULT_WORLD_GENERATION,
      seed: createSeedString(),
    });
  }, []);

  return {
    config,
    setConfig,
    updateConfig,
    updateGeneratorConfig,
    updateChunk,
    randomizeSeed,
    resetConfig,
  };
}
