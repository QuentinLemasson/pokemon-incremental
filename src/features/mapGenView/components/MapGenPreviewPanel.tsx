import type { HexMapTile } from '@/features/ui/mapView/components/HexMapSvg';
import { MapPreview } from '@/features/ui/mapView/components/MapPreview';
import type { VoronoiContext } from '@/features/engine/world/generation/centeredVoronoiNoise.generator';

type MapGenPreviewPanelProps = {
  tiles: HexMapTile[];
  tileCount: number;
  voronoiContext?: VoronoiContext;
};

export const MapGenPreviewPanel = ({
  tiles,
  tileCount,
  voronoiContext,
}: MapGenPreviewPanelProps) => {
  return (
    <div className="flex flex-col min-h-0">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <p className="text-sm text-slate-400">
          Generated map with {tileCount} tiles
        </p>
      </div>
      <div className="flex-1 min-h-0 border border-border rounded overflow-hidden">
        <MapPreview
          tiles={tiles}
          className="h-full"
          voronoiContext={voronoiContext}
        />
      </div>
    </div>
  );
};
