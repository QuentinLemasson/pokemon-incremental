import { MAP_VIEW_CONFIG } from '../mapView.config';

export type MapViewTransform = {
  panX: number;
  panY: number;
  scale: number;
};

/**
 * Zoom centered around a screen-space point (cx, cy).
 */
export function zoomAtPoint(params: {
  view: MapViewTransform;
  cx: number;
  cy: number;
  zoomFactor: number;
}): MapViewTransform {
  const { view, cx, cy, zoomFactor } = params;

  const unclamped = view.scale * zoomFactor;
  const newScale = Math.min(
    MAP_VIEW_CONFIG.maxScale,
    Math.max(MAP_VIEW_CONFIG.minScale, unclamped)
  );

  const worldX = (cx - view.panX) / view.scale;
  const worldY = (cy - view.panY) / view.scale;
  const newPanX = cx - worldX * newScale;
  const newPanY = cy - worldY * newScale;

  return { panX: newPanX, panY: newPanY, scale: newScale };
}
