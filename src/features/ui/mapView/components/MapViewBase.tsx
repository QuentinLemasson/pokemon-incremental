import { Frame } from '@/common/components/Frame';
import * as React from 'react';
import { HexMapSvg, type HexMapTile } from './HexMapSvg';
import { MapHoverOverlay } from './MapHoverOverlay';
import { MAP_VIEW_CONFIG } from '../mapView.config';
import type { VoronoiContext } from '@/features/engine/world/types';
import { cn } from '@/common/utils/shadcn.util';
import { AlgorithmOverlayToggle } from './AlgorithmOverlayToggle';

export type MapViewBaseProps = {
  tiles: HexMapTile[];
  activeHexId?: string | null;
  onHover?: (hexId: string | null) => void;
  onClick?: (hexId: string) => void;
  showDistantHexes?: boolean;
  showAlgorithmOverlay?: boolean;
  className?: string;
  frameId?: string;
  /**
   * Optional hex to show in overlay (for hover/active states).
   * If not provided, will be derived from activeHexId or hover state.
   */
  overlayHex?: HexMapTile | null;
  /**
   * Voronoi context for algorithm overlay visualization.
   */
  voronoiContext?: VoronoiContext;
};

/**
 * Base map view component that handles common rendering logic.
 * Used by both MapView (game view) and MapPreview (editor/preview).
 */
export const MapViewBase = ({
  tiles,
  activeHexId = null,
  onHover,
  onClick,
  showDistantHexes = false,
  showAlgorithmOverlay: initialShowAlgorithmOverlay = false,
  className = 'p-0',
  frameId = 'map-view',
  overlayHex: providedOverlayHex,
  voronoiContext,
}: MapViewBaseProps) => {
  const [hoveredHexId, setHoveredHexId] = React.useState<string | null>(null);
  const [showAlgorithmOverlay, setShowAlgorithmOverlay] = React.useState(
    initialShowAlgorithmOverlay
  );

  const hoveredHex = hoveredHexId
    ? tiles.find(t => t.id === hoveredHexId)
    : undefined;
  const activeHex = activeHexId
    ? tiles.find(t => t.id === activeHexId)
    : undefined;

  // Use provided overlay hex, or fall back to hovered/active
  const overlayHex = providedOverlayHex ?? hoveredHex ?? activeHex ?? null;

  return (
    <Frame id={frameId} className={cn('p-0', className)}>
      <style>{MAP_VIEW_CONFIG.tileCss}</style>

      <div className="relative w-full h-full min-h-0">
        {voronoiContext && (
          <AlgorithmOverlayToggle
            enabled={showAlgorithmOverlay}
            onToggle={setShowAlgorithmOverlay}
            disabled={!voronoiContext}
          />
        )}

        <MapHoverOverlay
          coordinates={overlayHex?.coordinates}
          biomeId={overlayHex?.biome}
          explored={overlayHex?.explored}
          cleared={overlayHex?.cleared}
        />

        <HexMapSvg
          tiles={tiles}
          activeHexId={activeHexId}
          onHover={onHover ?? (() => {})}
          onClick={onClick ?? (() => {})}
          onHoveredHexChange={setHoveredHexId}
          showDistantHexes={showDistantHexes}
          showAlgorithmOverlay={showAlgorithmOverlay}
          voronoiContext={voronoiContext}
        />
      </div>
    </Frame>
  );
};
