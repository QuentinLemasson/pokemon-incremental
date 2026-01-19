import type { HexCoordinates } from '@/common/types/hex.types';

export type MapHoverOverlayProps = {
  coordinates?: HexCoordinates;
};

export const MapHoverOverlay = ({ coordinates }: MapHoverOverlayProps) => {
  return (
    <div className="absolute right-3 top-3 z-10 rounded-md border border-slate-700/70 bg-black/40 px-3 py-2 text-xs text-slate-100 ring-1 ring-white/5">
      <div className="text-[11px] text-slate-300">Hovered</div>
      <div className="font-mono">
        {coordinates ? `q=${coordinates.q} r=${coordinates.r}` : 'q=?, r=?'}
      </div>
    </div>
  );
};
