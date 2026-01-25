import { useState, useCallback } from 'react';
import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';
import { DEFAULT_WORLD_GENERATION } from '@/features/engine/world/generator';
import { createSeedString } from '@/features/engine/world/generation/seed';

/**
 * Hook for managing map generation configuration state.
 */
export function useMapGenConfig(initialConfig?: WorldGenerationConfig) {
  const [config, setConfig] = useState<WorldGenerationConfig>(
    () =>
      initialConfig ?? {
        ...DEFAULT_WORLD_GENERATION,
        seed: createSeedString(),
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
    randomizeSeed,
    resetConfig,
  };
}
