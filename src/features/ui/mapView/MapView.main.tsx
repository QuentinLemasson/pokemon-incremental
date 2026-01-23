import { useCombatStore } from '@/features/store/combatStore';
import { useWorldStore } from '@/features/store/worldStore';
import { MapViewBase } from './components/MapViewBase';

export const MapView = () => {
  const world = useWorldStore(s => s.world);
  const onHexClicked = useWorldStore(s => s.onHexClicked);
  const onHexHovered = useWorldStore(s => s.onHexHovered);
  const activeHexId = useCombatStore(s => s.encounter?.hexId ?? null);

  const tiles = world.ids.map(id => world.byId[id]).filter(Boolean);

  return (
    <MapViewBase
      tiles={tiles}
      activeHexId={activeHexId}
      onHover={onHexHovered}
      onClick={onHexClicked}
      showDistantHexes
      frameId="map-view-main"
    />
  );
};
