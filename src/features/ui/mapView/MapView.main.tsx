import { Frame } from '@/common/components/Frame';
import { useCombatStore } from '@/features/store/combatStore';
import { useWorldStore } from '@/features/store/worldStore';
import * as React from 'react';

export const MapView = () => {
  const world = useWorldStore(s => s.world);
  const onHexClicked = useWorldStore(s => s.onHexClicked);
  const onHexHovered = useWorldStore(s => s.onHexHovered);
  const activeHexId = useCombatStore(s => s.encounter?.hexId ?? null);
  const [hoveredHexId, setHoveredHexId] = React.useState<string | null>(null);

  // Rendering config (P1)
  const HEX_SIZE = 20; // px
  const SQRT3 = 1.7320508075688772;

  const axialToPixel = (q: number, r: number) => {
    // Flat-top axial layout (Red Blob Games):
    // x = size * 3/2 * q
    // y = size * sqrt(3) * (r + q/2)
    return {
      x: HEX_SIZE * (1.5 * q),
      y: HEX_SIZE * (SQRT3 * (r + q / 2)),
    };
  };

  const hexPoints = (cx: number, cy: number) => {
    // Flat-top: start at angle 0° (point to the right), steps of 60°
    const pts: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI / 180) * (60 * i);
      const px = cx + HEX_SIZE * Math.cos(angle);
      const py = cy + HEX_SIZE * Math.sin(angle);
      pts.push(`${px},${py}`);
    }
    return pts.join(' ');
  };

  // Simple pan+zoom (mouse)
  const [view, setView] = React.useState({ panX: 180, panY: 120, scale: 1 });
  const dragRef = React.useRef<{
    dragging: boolean;
    lastX: number;
    lastY: number;
  }>({ dragging: false, lastX: 0, lastY: 0 });

  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const onWheel: React.WheelEventHandler<SVGSVGElement> = e => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setView(v => {
      const newScale = Math.min(3, Math.max(0.4, v.scale * zoomFactor));
      const worldX = (cx - v.panX) / v.scale;
      const worldY = (cy - v.panY) / v.scale;
      const newPanX = cx - worldX * newScale;
      const newPanY = cy - worldY * newScale;
      return { panX: newPanX, panY: newPanY, scale: newScale };
    });
  };

  const onMouseDown: React.MouseEventHandler<SVGSVGElement> = e => {
    dragRef.current.dragging = true;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
  };

  const onMouseMove: React.MouseEventHandler<SVGSVGElement> = e => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    setView(v => ({ ...v, panX: v.panX + dx, panY: v.panY + dy }));
  };

  const onMouseUp: React.MouseEventHandler<SVGSVGElement> = () => {
    dragRef.current.dragging = false;
  };

  const hoveredHex = hoveredHexId ? world.byId[hoveredHexId] : undefined;

  return (
    <Frame id="map-view-main" className="p-0">
      <style>
        {`
          .hex-tile { transition: filter 140ms ease, opacity 140ms ease, stroke 140ms ease; }
          .hex-hover { filter: drop-shadow(0 0 10px rgba(255,255,255,0.18)); }
          .hex-active { stroke: rgba(250, 204, 21, 0.95); stroke-width: 3; filter: drop-shadow(0 0 12px rgba(250, 204, 21, 0.22)); }
        `}
      </style>

      <div className="relative w-full h-[420px]">
        {hoveredHex ? (
          <div className="absolute right-3 top-3 z-10 rounded-md border border-slate-700/70 bg-black/40 px-3 py-2 text-xs text-slate-100 ring-1 ring-white/5">
            <div className="text-[11px] text-slate-300">Hovered</div>
            <div className="font-mono">
              q={hoveredHex.coordinates.q} r={hoveredHex.coordinates.r}
            </div>
          </div>
        ) : (
          <div className="absolute right-3 top-3 z-10 rounded-md border border-slate-700/50 bg-black/20 px-3 py-2 text-xs text-slate-300 ring-1 ring-white/5">
            <div className="text-[11px]">Hover a hex</div>
            <div className="font-mono">q=?, r=?</div>
          </div>
        )}

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: dragRef.current.dragging ? 'grabbing' : 'grab' }}
        >
          <g
            transform={`translate(${view.panX} ${view.panY}) scale(${view.scale})`}
          >
            {world.ids.map(id => {
              const h = world.byId[id];
              if (!h) return null;

              const { x, y } = axialToPixel(h.coordinates.q, h.coordinates.r);
              const points = hexPoints(x, y);

              const isActive = activeHexId === h.id;
              const fill = h.cleared
                ? 'rgba(100,116,139,0.35)'
                : h.explored
                  ? h.biome === 'forest'
                    ? 'rgba(34,197,94,0.28)'
                    : h.biome === 'plains'
                      ? 'rgba(250,204,21,0.20)'
                      : 'rgba(148,163,184,0.22)'
                  : 'rgba(15,23,42,0.55)';

              const stroke = h.explored
                ? 'rgba(148,163,184,0.45)'
                : 'rgba(71,85,105,0.45)';

              return (
                <polygon
                  key={h.id}
                  className={`hex-tile ${isActive ? 'hex-active' : ''}`}
                  points={points}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                  onMouseEnter={() => {
                    setHoveredHexId(h.id);
                    onHexHovered(h.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredHexId(null);
                    onHexHovered(null);
                  }}
                  onClick={() => onHexClicked(h.id)}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </Frame>
  );
};
