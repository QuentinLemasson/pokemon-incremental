import type { Hex } from '@/features/engine/world/hex';
import { useGameStore } from '@/features/store/gameStore';

export const MapView = () => {
  const { game, exploreHex } = useGameStore();

  return (
    <div id="map-view-main">
      {game.maps.map((hex: Hex) => (
        <button key={hex.id} onClick={() => exploreHex(hex.id)}>
          {hex.id} {hex.explored ? '✓' : '?'}
        </button>
      ))}
    </div>
  );
};
