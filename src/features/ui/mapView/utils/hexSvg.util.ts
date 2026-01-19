import type { HexCoordinates } from '@/common/types/hex.types';
import { MAP_VIEW_CONFIG } from '../mapView.config';

const SQRT3 = 1.7320508075688772;

/**
 * Flat-top axial layout (Red Blob Games):
 * x = size * 3/2 * q
 * y = size * sqrt(3) * (r + q/2)
 */
export function axialToPixelFlat(coord: HexCoordinates) {
  const size = MAP_VIEW_CONFIG.hexSizePx;
  return {
    x: size * (1.5 * coord.q),
    y: size * (SQRT3 * (coord.r + coord.q / 2)),
  };
}

/**
 * Returns SVG polygon points for a flat-top hex centered at (cx, cy).
 */
export function flatTopHexPoints(cx: number, cy: number) {
  const size = MAP_VIEW_CONFIG.hexSizePx;
  const pts: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 180) * (60 * i);
    const px = cx + size * Math.cos(angle);
    const py = cy + size * Math.sin(angle);
    pts.push(`${px},${py}`);
  }
  return pts.join(' ');
}
