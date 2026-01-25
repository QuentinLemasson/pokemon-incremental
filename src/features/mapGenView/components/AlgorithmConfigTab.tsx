import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';
import { Input } from '@/common/ui/input';
import { Separator } from '@/common/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/ui/card';
import { FieldWithTooltip } from '@/common/components/FieldWithTooltip';
import { FIELD_DESCRIPTIONS } from '../utils/fieldDescriptions';

type AlgorithmConfigTabProps = {
  config: WorldGenerationConfig;
  onUpdateGeneratorConfig: <
    K extends keyof WorldGenerationConfig['generator']['centeredVoronoiNoise'],
  >(
    key: K,
    value: WorldGenerationConfig['generator']['centeredVoronoiNoise'][K]
  ) => void;
};

export const AlgorithmConfigTab = ({
  config,
  onUpdateGeneratorConfig,
}: AlgorithmConfigTabProps) => {
  const voronoiConfig = config.generator.centeredVoronoiNoise;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generator Algorithm</CardTitle>
        <CardDescription>
          Select and configure the generation algorithm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldWithTooltip field={FIELD_DESCRIPTIONS.generatorType}>
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

          <FieldWithTooltip field={FIELD_DESCRIPTIONS.maxRadius}>
            <div className="space-y-2">
              <div className="text-sm text-slate-400">
                Value: {voronoiConfig.maxRadius}
              </div>
              <input
                type="range"
                min="4"
                max="15"
                value={voronoiConfig.maxRadius}
                onChange={e =>
                  onUpdateGeneratorConfig(
                    'maxRadius',
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full"
              />
            </div>
          </FieldWithTooltip>

          <FieldWithTooltip field={FIELD_DESCRIPTIONS.pointsCount}>
            <div className="space-y-2">
              <div className="text-sm text-slate-400">
                Value: {voronoiConfig.pointsCount}
              </div>
              <input
                type="range"
                min="4"
                max="24"
                value={voronoiConfig.pointsCount}
                onChange={e =>
                  onUpdateGeneratorConfig(
                    'pointsCount',
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full"
              />
            </div>
          </FieldWithTooltip>

          <FieldWithTooltip field={FIELD_DESCRIPTIONS.sitesMaxRadius}>
            <div className="space-y-2">
              <div className="text-sm text-slate-400">
                Value: {voronoiConfig.sitesMaxRadius}
              </div>
              <input
                type="range"
                min="2"
                max="12"
                value={voronoiConfig.sitesMaxRadius}
                onChange={e =>
                  onUpdateGeneratorConfig(
                    'sitesMaxRadius',
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full"
              />
            </div>
          </FieldWithTooltip>

          <FieldWithTooltip field={FIELD_DESCRIPTIONS.jitter}>
            <div className="space-y-2">
              <div className="text-sm text-slate-400">
                Value: {voronoiConfig.jitter.toFixed(2)}
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={voronoiConfig.jitter}
                onChange={e =>
                  onUpdateGeneratorConfig(
                    'jitter',
                    parseFloat(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>
          </FieldWithTooltip>

          <FieldWithTooltip field={FIELD_DESCRIPTIONS.minSiteDistance}>
            <Input
              type="number"
              min="1"
              value={voronoiConfig.minSiteDistance ?? ''}
              onChange={e =>
                onUpdateGeneratorConfig(
                  'minSiteDistance',
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              placeholder="Auto"
            />
          </FieldWithTooltip>

          <FieldWithTooltip field={FIELD_DESCRIPTIONS.maxSiteSampleAttempts}>
            <Input
              type="number"
              min="50"
              value={voronoiConfig.maxSiteSampleAttempts ?? ''}
              onChange={e =>
                onUpdateGeneratorConfig(
                  'maxSiteSampleAttempts',
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              placeholder="Default: 600"
            />
          </FieldWithTooltip>
        </div>
      </CardContent>
    </Card>
  );
};
