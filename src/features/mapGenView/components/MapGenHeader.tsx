import { Download, Upload } from 'lucide-react';
import { Button } from '@/common/ui/button';
import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';
import { exportJsonToFile } from '@/common/utils/json-export.util';
import { importJsonFromFile } from '@/common/utils/json-import.util';

type MapGenHeaderProps = {
  config: WorldGenerationConfig;
  onConfigImported: (config: WorldGenerationConfig) => void;
};

export const MapGenHeader = ({
  config,
  onConfigImported,
}: MapGenHeaderProps) => {
  const handleExport = () => {
    exportJsonToFile(config, 'map-config');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importJsonFromFile<WorldGenerationConfig>(file)
      .then(imported => {
        onConfigImported(imported);
      })
      .catch(error => {
        alert(error.message || 'Failed to import config: Invalid JSON');
      });

    // Reset input
    event.target.value = '';
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Map Generator</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
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
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
