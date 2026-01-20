import type { HexCoordinates } from '@/common/types/hex.types';
import { BIOMES } from '@/features/engine/world/biomes';

export type MapHoverOverlayProps = {
  coordinates?: HexCoordinates;
  biomeId?: string;
  explored?: boolean;
  cleared?: boolean;
};

export const MapHoverOverlay = ({
  coordinates,
  biomeId,
  explored,
  cleared,
}: MapHoverOverlayProps) => {
  const biomeName = biomeId ? (BIOMES[biomeId]?.name ?? biomeId) : undefined;
  const status = cleared ? 'Cleared' : explored ? 'Explored' : 'Unexplored';

  return (
    <div className="absolute right-3 top-3 z-10 rounded-md border border-slate-700/70 bg-black/40 px-3 py-2 text-xs text-slate-100 ring-1 ring-white/5">
      <div className="text-[11px] text-slate-300">{status}</div>
      <div className="text-xs">
        <span className="text-slate-300">Biome</span>{' '}
        <span className="text-slate-100">{biomeName ?? '—'}</span>
      </div>
      <div className="font-mono">
        {coordinates ? `q=${coordinates.q} r=${coordinates.r}` : 'q=?, r=?'}
      </div>
    </div>
  );
};
