import { BIOMES } from '@/features/engine/world/biomes';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/common/ui/card';

export const BiomesConfigTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Biome Configuration</CardTitle>
        <CardDescription>
          View and configure biome settings (read-only for now)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(BIOMES).map(biome => (
          <Card key={biome.id} className="bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: biome.color }}
                />
                <CardTitle className="text-base">{biome.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Type:</span> {biome.type}
                </div>
                <div>
                  <span className="text-slate-400">Level Range:</span>{' '}
                  {biome.levelRange.min}-{biome.levelRange.max}
                </div>
                <div>
                  <span className="text-slate-400">Clear Threshold:</span>{' '}
                  {biome.clearTreshold}
                </div>
                <div>
                  <span className="text-slate-400">Travel Threshold:</span>{' '}
                  {biome.travelThreshold}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
