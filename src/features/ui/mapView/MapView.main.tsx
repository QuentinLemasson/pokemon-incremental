import type { Hex } from '@/features/engine/world/hex';
import { useGameStore } from '@/features/store/gameStore';

export const MapView = () => {
  const { game, beginEncounter, pendingEncounter } = useGameStore();

  return (
    <div id="map-view-main">
      {game.maps.map((hex: Hex) => (
        <button
          key={hex.id}
          onClick={() => beginEncounter(hex.id)}
          disabled={pendingEncounter !== null}
        >
          {hex.id}{' '}
          {pendingEncounter?.hexId === hex.id ? '▶' : hex.explored ? '✓' : '?'}
        </button>
      ))}
    </div>
  );
};
