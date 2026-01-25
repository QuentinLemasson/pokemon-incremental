import type { HexMapTile } from '@/features/ui/mapView/components/HexMapSvg';
import { MapPreview } from '@/features/ui/mapView/components/MapPreview';

type MapGenPreviewPanelProps = {
  tiles: HexMapTile[];
  tileCount: number;
};

export const MapGenPreviewPanel = ({
  tiles,
  tileCount,
}: MapGenPreviewPanelProps) => {
  return (
    <div className="flex flex-col min-h-0">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <p className="text-sm text-slate-400">
          Generated map with {tileCount} tiles
        </p>
      </div>
      <div className="flex-1 min-h-0 border border-slate-700 rounded overflow-hidden">
        <MapPreview tiles={tiles} className="h-full" />
      </div>
    </div>
  );
};
