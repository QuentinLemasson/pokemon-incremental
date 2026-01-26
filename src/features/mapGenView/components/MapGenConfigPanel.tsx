import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/ui/tabs';
import type {
  WorldGenerationConfig,
  ChunkConfig,
} from '@/features/engine/world/generation/types';
import { WorldConfigTab } from './WorldConfigTab';
import { AlgorithmConfigTab } from './AlgorithmConfigTab';
import { BiomesConfigTab } from './BiomesConfigTab';
import { ChunksConfigTab } from './ChunksConfigTab';

type MapGenConfigPanelProps = {
  config: WorldGenerationConfig;
  onUpdateConfig: <K extends keyof WorldGenerationConfig>(
    key: K,
    value: WorldGenerationConfig[K]
  ) => void;
  onUpdateGeneratorConfig: <
    K extends
      keyof WorldGenerationConfig['baseGenerator']['centeredVoronoiNoise'],
  >(
    key: K,
    value: WorldGenerationConfig['baseGenerator']['centeredVoronoiNoise'][K]
  ) => void;
  onUpdateChunk: (chunkId: string, updates: Partial<ChunkConfig>) => void;
  onRandomSeed: () => void;
};

export const MapGenConfigPanel = ({
  config,
  onUpdateConfig,
  onUpdateGeneratorConfig,
  onUpdateChunk,
  onRandomSeed,
}: MapGenConfigPanelProps) => {
  return (
    <Tabs defaultValue="world" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="world">World</TabsTrigger>
        <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
        <TabsTrigger value="chunks">Chunks</TabsTrigger>
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

      <TabsContent value="chunks" className="space-y-4 mt-4">
        <ChunksConfigTab
          config={config}
          onUpdateConfig={onUpdateConfig}
          onUpdateChunk={onUpdateChunk}
        />
      </TabsContent>

      <TabsContent value="biomes" className="space-y-4 mt-4">
        <BiomesConfigTab />
      </TabsContent>
    </Tabs>
  );
};
