import { MapViewBase } from './MapViewBase';
import type { HexMapTile } from './HexMapSvg';

export type MapPreviewProps = {
  tiles: HexMapTile[];
  className?: string;
};

/**
 * Standalone map preview component that can render a map from any tile data.
 * Used for map generation editor and other preview scenarios.
 */
export const MapPreview = ({ tiles, className }: MapPreviewProps) => {
  return (
    <MapViewBase
      tiles={tiles}
      activeHexId={null}
      showDistantHexes={false}
      className={className ?? 'p-0'}
      frameId="map-preview"
    />
  );
};
