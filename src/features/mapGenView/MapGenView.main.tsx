import { useState, useMemo } from 'react';
import { generateMaps } from '@/features/engine/world/generator';
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

  const [generatedHexes, setGeneratedHexes] = useState(() =>
    generateMaps(config)
  );

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

  const tileCount = generatedHexes.length;

  const handleGenerate = () => {
    const newHexes = generateMaps(config);
    setGeneratedHexes(newHexes);
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
        <MapGenPreviewPanel tiles={previewTiles} tileCount={tileCount} />
      </div>
    </div>
  );
};
