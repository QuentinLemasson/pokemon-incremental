import { Frame } from '@/common/components/Frame';
import { useCombatStore } from '@/features/store/combatStore';
import { useWorldStore } from '@/features/store/worldStore';

export const MapView = () => {
  const { hexes, onHexClicked } = useWorldStore();
  const encounterHexId = useCombatStore(s => s.encounter?.hexId ?? null);

  return (
    <Frame id="map-view-main">
      {hexes.map(hex => (
        <button
          key={hex.id}
          onClick={() => onHexClicked(hex.id)}
          disabled={encounterHexId !== null}
        >
          {hex.id} {encounterHexId === hex.id ? '▶' : hex.explored ? '✓' : '?'}
        </button>
      ))}
    </Frame>
  );
};
