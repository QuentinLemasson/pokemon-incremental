import { useState, useCallback, useEffect } from 'react';
import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';
import {
  savePreset,
  loadAllPresets,
  deletePreset,
  type Preset,
} from '../utils/presetManager';

/**
 * Hook for managing map generation presets.
 */
export function useMapGenPresets() {
  const [presets, setPresets] = useState<Preset[]>(() => loadAllPresets());

  const refreshPresets = useCallback(() => {
    setPresets(loadAllPresets());
  }, []);

  const handleSavePreset = useCallback(
    (name: string, config: WorldGenerationConfig) => {
      if (!name.trim()) return;
      savePreset(name.trim(), config);
      refreshPresets();
    },
    [refreshPresets]
  );

  const handleDeletePreset = useCallback(
    (id: string) => {
      deletePreset(id);
      refreshPresets();
    },
    [refreshPresets]
  );

  useEffect(() => {
    // Refresh presets on mount
    refreshPresets();
  }, [refreshPresets]);

  return {
    presets,
    savePreset: handleSavePreset,
    deletePreset: handleDeletePreset,
    refreshPresets,
  };
}
