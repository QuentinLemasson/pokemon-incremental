import { MapViewBase } from './MapViewBase';
import type { HexMapTile } from './HexMapSvg';
import type { VoronoiContext } from '@/features/engine/world/generation/centeredVoronoiNoise.generator';
import { cn } from '@/common/utils/shadcn.util';

export type MapPreviewProps = {
  tiles: HexMapTile[];
  className?: string;
  voronoiContext?: VoronoiContext;
};

/**
 * Standalone map preview component that can render a map from any tile data.
 * Used for map generation editor and other preview scenarios.
 */
export const MapPreview = ({
  tiles,
  className,
  voronoiContext,
}: MapPreviewProps) => {
  return (
    <MapViewBase
      tiles={tiles}
      activeHexId={null}
      showDistantHexes={true}
      showAlgorithmOverlay={true}
      className={cn(className)}
      frameId="map-preview"
      voronoiContext={voronoiContext}
    />
  );
};
