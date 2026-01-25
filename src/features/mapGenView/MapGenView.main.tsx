import { useState, useMemo } from 'react';
import { generateMapsWithContext } from '@/features/engine/world/generator';
import type { HexMapTile } from '@/features/ui/mapView/components/HexMapSvg';
import { useMapGenConfig } from './hooks/useMapGenConfig.hook';
import { useMapGenPresets } from './hooks/useMapGenPresets.hook';
import { MapGenHeader } from './components/MapGenHeader';
import { MapGenConfigPanel } from './components/MapGenConfigPanel';
import { MapGenPresetsPanel } from './components/MapGenPresetsPanel';
import { MapGenPreviewPanel } from './components/MapGenPreviewPanel';
import { Button } from '@/common/ui/button';

/**
 * Main map generation view component.
 * Orchestrates all map generation UI components and state.
 */
export const MapGenView = () => {
  const {
    config,
    setConfig,
    updateConfig,
    updateGeneratorConfig,
    randomizeSeed,
  } = useMapGenConfig();

  const { presets, savePreset, deletePreset } = useMapGenPresets();

  const [generationResult, setGenerationResult] = useState(() =>
    generateMapsWithContext(config)
  );

  const previewTiles: HexMapTile[] = useMemo(
    () =>
      generationResult.hexes.map(hex => ({
        id: hex.id,
        biome: hex.biome,
        explored: true,
        cleared: false,
        coordinates: hex.coordinates,
      })),
    [generationResult.hexes]
  );

  const tileCount = generationResult.hexes.length;

  const handleGenerate = () => {
    const result = generateMapsWithContext(config);
    setGenerationResult(result);
  };

  const handleConfigImported = (importedConfig: typeof config) => {
    setConfig(importedConfig);
    handleGenerate();
  };

  const handleLoadPreset = (preset: (typeof presets)[0]) => {
    setConfig(preset.config);
    handleGenerate();
  };

  return (
    <div className="flex flex-col">
      <MapGenHeader config={config} onConfigImported={handleConfigImported} />

      <div className="grid grid-cols-[450px_1fr] gap-6 flex-1 min-h-0">
        {/* Controls Panel */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-4">
          <MapGenConfigPanel
            config={config}
            onUpdateConfig={updateConfig}
            onUpdateGeneratorConfig={updateGeneratorConfig}
            onRandomSeed={randomizeSeed}
          />

          <MapGenPresetsPanel
            presets={presets}
            currentConfig={config}
            onSavePreset={savePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={deletePreset}
          />

          {/* Generate Button */}
          <Button onClick={handleGenerate} className="w-full" size="lg">
            Generate Map
          </Button>
        </div>

        {/* Preview Panel */}
        <MapGenPreviewPanel
          tiles={previewTiles}
          tileCount={tileCount}
          voronoiContext={generationResult.voronoiContext}
        />
      </div>
    </div>
  );
};
