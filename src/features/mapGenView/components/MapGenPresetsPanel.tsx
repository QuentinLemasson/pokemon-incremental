import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';
import { Input } from '@/common/ui/input';
import { Button } from '@/common/ui/button';
import { Separator } from '@/common/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/ui/card';
import type { Preset } from '../utils/presetManager';

type MapGenPresetsPanelProps = {
  presets: Preset[];
  currentConfig: WorldGenerationConfig;
  onSavePreset: (name: string, config: WorldGenerationConfig) => void;
  onLoadPreset: (preset: Preset) => void;
  onDeletePreset: (id: string) => void;
};

export const MapGenPresetsPanel = ({
  presets,
  currentConfig,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: MapGenPresetsPanelProps) => {
  const [presetName, setPresetName] = useState('');

  const handleSave = () => {
    if (!presetName.trim()) return;
    onSavePreset(presetName.trim(), currentConfig);
    setPresetName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presets</CardTitle>
        <CardDescription>Save and load configuration presets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
            placeholder="Preset name"
            onKeyDown={e => {
              if (e.key === 'Enter' && presetName.trim()) {
                handleSave();
              }
            }}
          />
          <Button
            onClick={handleSave}
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
                      onClick={() => onLoadPreset(preset)}
                      className="h-7 px-2"
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePreset(preset.id)}
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
  );
};
