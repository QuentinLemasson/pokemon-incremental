import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';
import { Input } from '@/common/ui/input';
import { Button } from '@/common/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/ui/card';
import { FieldWithTooltip } from '@/common/components/FieldWithTooltip';
import { FIELD_DESCRIPTIONS } from '../utils/fieldDescriptions';

type WorldConfigTabProps = {
  config: WorldGenerationConfig;
  onUpdateConfig: <K extends keyof WorldGenerationConfig>(
    key: K,
    value: WorldGenerationConfig[K]
  ) => void;
  onRandomSeed: () => void;
};

export const WorldConfigTab = ({
  config,
  onUpdateConfig,
  onRandomSeed,
}: WorldConfigTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>World Configuration</CardTitle>
        <CardDescription>
          Global settings that affect world size and generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldWithTooltip field={FIELD_DESCRIPTIONS.seed}>
          <div className="flex gap-2">
            <Input
              value={config.seed}
              onChange={e => onUpdateConfig('seed', e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={onRandomSeed}>
              Random
            </Button>
          </div>
        </FieldWithTooltip>

        <FieldWithTooltip field={FIELD_DESCRIPTIONS.radius}>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Value: {config.radius}</span>
              <span>Tiles: {1 + 3 * config.radius * (config.radius + 1)}</span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              value={config.radius}
              onChange={e =>
                onUpdateConfig('radius', parseInt(e.target.value, 10))
              }
              className="w-full"
            />
          </div>
        </FieldWithTooltip>

        <FieldWithTooltip field={FIELD_DESCRIPTIONS.minTiles}>
          <Input
            type="number"
            min="1"
            value={config.minTiles ?? ''}
            onChange={e =>
              onUpdateConfig(
                'minTiles',
                e.target.value ? parseInt(e.target.value, 10) : undefined
              )
            }
            placeholder="No limit"
          />
        </FieldWithTooltip>

        <FieldWithTooltip field={FIELD_DESCRIPTIONS.maxTiles}>
          <Input
            type="number"
            min="1"
            value={config.maxTiles ?? ''}
            onChange={e =>
              onUpdateConfig(
                'maxTiles',
                e.target.value ? parseInt(e.target.value, 10) : undefined
              )
            }
            placeholder="No limit"
          />
        </FieldWithTooltip>
      </CardContent>
    </Card>
  );
};
