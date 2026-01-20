import { Frame } from '@/common/components/Frame';
import { useCombatStore } from '@/features/store/combatStore';
import { useWorldStore } from '@/features/store/worldStore';
import * as React from 'react';
import { HexMapSvg } from './components/HexMapSvg';
import { MapHoverOverlay } from './components/MapHoverOverlay';
import { MAP_VIEW_CONFIG } from './mapView.config';

export const MapView = () => {
  const world = useWorldStore(s => s.world);
  const onHexClicked = useWorldStore(s => s.onHexClicked);
  const onHexHovered = useWorldStore(s => s.onHexHovered);
  const activeHexId = useCombatStore(s => s.encounter?.hexId ?? null);
  const [hoveredHexId, setHoveredHexId] = React.useState<string | null>(null);

  const hoveredHex = hoveredHexId ? world.byId[hoveredHexId] : undefined;
  const activeHex = activeHexId ? world.byId[activeHexId] : undefined;
  const overlayHex = hoveredHex ?? activeHex;

  return (
    <Frame id="map-view-main" className="p-0">
      <style>{MAP_VIEW_CONFIG.tileCss}</style>

      <div className="relative w-full h-full min-h-0">
        <MapHoverOverlay
          coordinates={overlayHex?.coordinates}
          biomeId={overlayHex?.biome}
          explored={overlayHex?.explored}
          cleared={overlayHex?.cleared}
        />

        <HexMapSvg
          tiles={world.ids.map(id => world.byId[id]).filter(Boolean)}
          activeHexId={activeHexId}
          onHover={onHexHovered}
          onClick={onHexClicked}
          onHoveredHexChange={setHoveredHexId}
          showDistantHexes
        />
      </div>
    </Frame>
  );
};
