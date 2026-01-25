import type { VoronoiContext } from '@/features/engine/world/generation/centeredVoronoiNoise.generator';
import type { HexMapTile } from './HexMapSvg';
import { axialToPixelFlat } from '../utils/hexSvg.util';
import { ALGORITHM_OVERLAY_CONFIG } from '../algorithmOverlay.config';
import { MAP_VIEW_CONFIG } from '../mapView.config';
import type { HexCoordinates } from '@/common/types/hex.types';
import { noise2dSigned } from '@/features/engine/world/generation/seed';

export type VoronoiOverlayProps = {
  tiles: HexMapTile[];
  voronoiContext: VoronoiContext;
};

/**
 * Axial hex distance (same as in generator).
 */
function axialDistance(a: HexCoordinates, b: HexCoordinates): number {
  const aq = a.q;
  const ar = a.r;
  const bq = b.q;
  const br = b.r;
  const as = -aq - ar;
  const bs = -bq - br;
  return Math.max(Math.abs(aq - bq), Math.abs(ar - br), Math.abs(as - bs));
}

/**
 * Computes which Voronoi site a hex belongs to (same logic as computeVoronoiBiome).
 */
function getSiteForHex(
  coord: HexCoordinates,
  voronoiContext: VoronoiContext
): number {
  const { sites, jitter, seed } = voronoiContext;
  let bestIndex = 0;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let i = 0; i < sites.length; i += 1) {
    const s = sites[i];
    const d = axialDistance(coord, s.coord);
    const n =
      jitter === 0 ? 0 : noise2dSigned(seed, coord.q, coord.r, i) * jitter;
    const score = d + n;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return bestIndex;
}

/**
 * Gets the 6 axial neighbors of a hex coordinate.
 */
function getNeighbors(coord: HexCoordinates): HexCoordinates[] {
  return [
    { q: coord.q + 1, r: coord.r },
    { q: coord.q + 1, r: coord.r - 1 },
    { q: coord.q, r: coord.r - 1 },
    { q: coord.q - 1, r: coord.r },
    { q: coord.q - 1, r: coord.r + 1 },
    { q: coord.q, r: coord.r + 1 },
  ];
}

/**
 * Finds a tile by coordinates.
 */
function findTileByCoord(
  tiles: HexMapTile[],
  coord: HexCoordinates
): HexMapTile | undefined {
  return tiles.find(
    t => t.coordinates.q === coord.q && t.coordinates.r === coord.r
  );
}

/**
 * Renders Voronoi algorithm overlay: sites and borders.
 */
export const VoronoiOverlay = ({
  tiles,
  voronoiContext,
}: VoronoiOverlayProps) => {
  const config = ALGORITHM_OVERLAY_CONFIG.voronoi;

  // Build a map of tile coordinates to site indices
  const tileToSite = new Map<string, number>();
  for (const tile of tiles) {
    const siteIndex = getSiteForHex(tile.coordinates, voronoiContext);
    tileToSite.set(tile.id, siteIndex);
  }

  // Compute border edges: edges between hexes that belong to different sites
  const borderEdges: Array<{ x1: number; y1: number; x2: number; y2: number }> =
    [];

  for (const tile of tiles) {
    const siteIndex = tileToSite.get(tile.id);
    if (siteIndex === undefined) continue;

    const neighbors = getNeighbors(tile.coordinates);
    const { x: x1, y: y1 } = axialToPixelFlat(tile.coordinates);

    // Check each neighbor
    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      const neighborTile = findTileByCoord(tiles, neighbor);
      if (!neighborTile) continue;

      const neighborSiteIndex = tileToSite.get(neighborTile.id);
      if (neighborSiteIndex === undefined || neighborSiteIndex === siteIndex)
        continue;

      // This is a border edge - draw a line segment along the shared hex edge
      // For simplicity, we'll draw a short line perpendicular to the center-to-center line
      const { x: x2, y: y2 } = axialToPixelFlat(neighbor);

      // Midpoint between the two hex centers
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Direction vector from center to center
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) continue;

      // Perpendicular direction (rotated 90 degrees)
      const perpX = -dy / len;
      const perpY = dx / len;

      // Hex size from config (radius in pixels)
      const hexSize = MAP_VIEW_CONFIG.hexSizePx;
      // Edge length for flat-top
      const edgeLength = hexSize;

      borderEdges.push({
        x1: midX - perpX * (edgeLength / 2),
        y1: midY - perpY * (edgeLength / 2),
        x2: midX + perpX * (edgeLength / 2),
        y2: midY + perpY * (edgeLength / 2),
      });
    }
  }

  // Render sites
  const siteElements = voronoiContext.sites.map((site, index) => {
    const { x, y } = axialToPixelFlat(site.coord);
    return (
      <circle
        key={`site-${index}`}
        cx={x}
        cy={y}
        r={config.site.radius}
        fill={config.site.fill}
        stroke={config.site.stroke}
        strokeWidth={config.site.strokeWidth}
        opacity={config.site.opacity}
      />
    );
  });

  // Render borders
  const borderElements = borderEdges.map((edge, index) => (
    <line
      key={`border-${index}`}
      x1={edge.x1}
      y1={edge.y1}
      x2={edge.x2}
      y2={edge.y2}
      stroke={config.border.stroke}
      strokeWidth={config.border.strokeWidth}
      strokeDasharray={config.border.dashArray}
      opacity={config.border.opacity}
    />
  ));

  return (
    <g className="voronoi-overlay" pointerEvents="none">
      {borderElements}
      {siteElements}
    </g>
  );
};
