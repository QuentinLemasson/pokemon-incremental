import * as React from 'react';
import { MAP_VIEW_CONFIG } from '../mapView.config';
import { BIOME_FILL, MAP_TILE_COLORS } from '../mapBiome.config';
import { axialToPixelFlat, flatTopHexPoints } from '../utils/hexSvg.util';
import { zoomAtPoint, type MapViewTransform } from '../utils/panZoom.util';

export type HexMapTile = {
  id: string;
  biome: string;
  explored: boolean;
  cleared: boolean;
  coordinates: { q: number; r: number };
};

export type HexMapSvgProps = {
  tiles: HexMapTile[];
  activeHexId: string | null;
  onHover: (hexId: string | null) => void;
  onClick: (hexId: string) => void;
  onHoveredHexChange: (hexId: string | null) => void;
};

export const HexMapSvg = ({
  tiles,
  activeHexId,
  onHover,
  onClick,
  onHoveredHexChange,
}: HexMapSvgProps) => {
  const [view, setView] = React.useState<MapViewTransform>(
    MAP_VIEW_CONFIG.initialView
  );
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

    const zoomFactor =
      e.deltaY < 0
        ? MAP_VIEW_CONFIG.zoomInFactor
        : MAP_VIEW_CONFIG.zoomOutFactor;

    setView(v => zoomAtPoint({ view: v, cx, cy, zoomFactor }));
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

  return (
    <svg
      ref={svgRef}
      className="block w-full h-full"
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
        {tiles.map(h => {
          const { x, y } = axialToPixelFlat(h.coordinates);
          const points = flatTopHexPoints(x, y);

          const isActive = activeHexId === h.id;
          const fill = h.cleared
            ? MAP_TILE_COLORS.clearedFill
            : h.explored
              ? (BIOME_FILL[h.biome] ?? MAP_TILE_COLORS.unexploredFill)
              : MAP_TILE_COLORS.unexploredFill;

          const stroke = h.explored
            ? MAP_TILE_COLORS.exploredStroke
            : MAP_TILE_COLORS.unexploredStroke;

          return (
            <polygon
              key={h.id}
              className={`hex-tile ${isActive ? 'hex-active' : ''}`}
              points={points}
              fill={fill}
              stroke={stroke}
              strokeWidth={2}
              onMouseEnter={() => {
                onHoveredHexChange(h.id);
                onHover(h.id);
              }}
              onMouseLeave={() => {
                onHoveredHexChange(null);
                onHover(null);
              }}
              onClick={() => onClick(h.id)}
            />
          );
        })}
      </g>
    </svg>
  );
};
