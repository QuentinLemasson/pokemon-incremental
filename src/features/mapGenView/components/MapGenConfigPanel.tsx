import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/ui/tabs';
import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';
import { WorldConfigTab } from './WorldConfigTab';
import { AlgorithmConfigTab } from './AlgorithmConfigTab';
import { BiomesConfigTab } from './BiomesConfigTab';

type MapGenConfigPanelProps = {
  config: WorldGenerationConfig;
  onUpdateConfig: <K extends keyof WorldGenerationConfig>(
    key: K,
    value: WorldGenerationConfig[K]
  ) => void;
  onUpdateGeneratorConfig: <
    K extends keyof WorldGenerationConfig['generator']['centeredVoronoiNoise'],
  >(
    key: K,
    value: WorldGenerationConfig['generator']['centeredVoronoiNoise'][K]
  ) => void;
  onRandomSeed: () => void;
};

export const MapGenConfigPanel = ({
  config,
  onUpdateConfig,
  onUpdateGeneratorConfig,
  onRandomSeed,
}: MapGenConfigPanelProps) => {
  return (
    <Tabs defaultValue="world" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="world">World</TabsTrigger>
        <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
        <TabsTrigger value="biomes">Biomes</TabsTrigger>
      </TabsList>

      <TabsContent value="world" className="space-y-4 mt-4">
        <WorldConfigTab
          config={config}
          onUpdateConfig={onUpdateConfig}
          onRandomSeed={onRandomSeed}
        />
      </TabsContent>

      <TabsContent value="algorithm" className="space-y-4 mt-4">
        <AlgorithmConfigTab
          config={config}
          onUpdateGeneratorConfig={onUpdateGeneratorConfig}
        />
      </TabsContent>

      <TabsContent value="biomes" className="space-y-4 mt-4">
        <BiomesConfigTab />
      </TabsContent>
    </Tabs>
  );
};
