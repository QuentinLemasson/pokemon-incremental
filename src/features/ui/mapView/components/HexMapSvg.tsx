import * as React from 'react';
import { MAP_VIEW_CONFIG } from '../mapView.config';
import { BIOME_FILL, MAP_TILE_COLORS } from '../mapBiome.config';
import { axialToPixelFlat, flatTopHexPoints } from '../utils/hexSvg.util';
import { zoomAtPoint, type MapViewTransform } from '../utils/panZoom.util';
import { VoronoiOverlay } from './VoronoiOverlay';
import type { VoronoiContext } from '@/features/engine/world/generation/centeredVoronoiNoise.generator';

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
  showDistantHexes?: boolean;
  showAlgorithmOverlay?: boolean;
  voronoiContext?: VoronoiContext;
};

export const HexMapSvg = ({
  tiles,
  activeHexId,
  onHover,
  onClick,
  onHoveredHexChange,
  showDistantHexes = false,
  showAlgorithmOverlay = false,
  voronoiContext,
}: HexMapSvgProps) => {
  const [view, setView] = React.useState<MapViewTransform>(
    MAP_VIEW_CONFIG.initialView
  );
  const [hoveredHexId, setHoveredHexId] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
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
    setIsDragging(true);
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
    setIsDragging(false);
  };

  const hoveredHex = hoveredHexId
    ? tiles.find(t => t.id === hoveredHexId)
    : undefined;
  const activeHex = activeHexId ? tiles.find(t => t.id === activeHexId) : null;
  const normalHexes = tiles;

  const renderHexVisual = (
    h: HexMapTile,
    params?: {
      isActive?: boolean;
      disableHover?: boolean;
      withHitArea?: boolean;
    }
  ) => {
    const { x, y } = axialToPixelFlat(h.coordinates);
    const points = flatTopHexPoints(x, y);

    const isActive = Boolean(params?.isActive);
    const isHovered = !params?.disableHover && hoveredHexId === h.id;
    const withHitArea = params?.withHitArea ?? true;

    const isUnexplored = !h.explored && !h.cleared;

    const baseFill =
      h.explored || h.cleared || showDistantHexes
        ? (BIOME_FILL[h.biome] ?? MAP_TILE_COLORS.unexploredFill)
        : MAP_TILE_COLORS.unexploredFill;

    const showUnexploredOverlay = showDistantHexes && isUnexplored;
    const unexploredOverlayOpacity = 0.3;

    const stroke = h.cleared
      ? MAP_TILE_COLORS.clearedStroke
      : h.explored
        ? MAP_TILE_COLORS.exploredStroke
        : MAP_TILE_COLORS.unexploredStroke;

    const strokeWidth = h.cleared ? 3 : 2;
    const strokeDasharray = h.cleared ? '6 4' : undefined;

    return (
      <g
        key={h.id}
        id={`hex-container-${h.id}`}
        data-hex-id={h.id}
        className={`hex-container ${isHovered ? 'hex-container--hovered' : ''}`}
      >
        {/* Visuals must NOT capture pointer events (hit-layer owns hover/click). */}
        <g pointerEvents="none">
          <polygon
            className={`hex-tile ${isActive ? 'hex-active' : ''} ${isHovered ? 'hex-hover' : ''}`}
            points={points}
            fill={baseFill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
          {showUnexploredOverlay ? (
            <polygon
              className="hex-tile hex-overlay"
              points={points}
              fill={MAP_TILE_COLORS.unexploredFill}
              fillOpacity={unexploredOverlayOpacity}
            />
          ) : null}
        </g>

        {/* Hit area (owns hover/click). */}
        {withHitArea ? (
          <polygon
            points={points}
            fill="transparent"
            stroke="transparent"
            strokeWidth={8}
            pointerEvents="all"
            onMouseEnter={() => {
              if (dragRef.current.dragging) return;
              setHoveredHexId(h.id);
              onHoveredHexChange(h.id);
              onHover(h.id);
            }}
            onMouseLeave={() => {
              if (dragRef.current.dragging) return;
              setHoveredHexId(null);
              onHoveredHexChange(null);
              onHover(null);
            }}
            onClick={() => onClick(h.id)}
          />
        ) : null}
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      className="block w-full h-full select-none"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <g
        transform={`translate(${view.panX} ${view.panY}) scale(${view.scale})`}
      >
        {/* Render order controls z-index: normal -> active -> hovered -> overlay */}
        {normalHexes.map(h => renderHexVisual(h, { disableHover: true }))}
        {activeHex
          ? renderHexVisual(activeHex, { isActive: true, withHitArea: false })
          : null}
        {hoveredHex && hoveredHex.id !== activeHexId
          ? renderHexVisual(hoveredHex, { withHitArea: false })
          : null}
        {/* Algorithm overlay (Voronoi sites and borders) */}
        {showAlgorithmOverlay && voronoiContext ? (
          <VoronoiOverlay tiles={tiles} voronoiContext={voronoiContext} />
        ) : null}
      </g>
    </svg>
  );
};
