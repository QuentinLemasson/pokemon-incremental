export const MAP_VIEW_CONFIG = {
  /** Pixel size of a hex radius. */
  hexSizePx: 32,

  /** Initial camera transform (in screen space). */
  initialView: { panX: 520, panY: 338, scale: 1 },

  /** Zoom constraints. */
  minScale: 0.4,
  maxScale: 3,

  /** Wheel zoom factor per notch. */
  zoomInFactor: 1.1,
  zoomOutFactor: 0.9,

  /** CSS (kept co-located for now; can be moved to a CSS module later). */
  tileCss: `
    .hex-tile { transition: filter 140ms ease, opacity 140ms ease, stroke 140ms ease; }
    .hex-hover { filter: drop-shadow(0 0 10px rgba(255,255,255,0.18)); }
    .hex-active { stroke: rgba(250, 204, 21, 0.95); stroke-width: 3; filter: drop-shadow(0 0 12px rgba(250, 204, 21, 0.22)); }
  `,
} as const;
