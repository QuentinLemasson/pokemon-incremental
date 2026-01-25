/**
 * Configuration for algorithm overlay visualization.
 * Used to display generation algorithm data (e.g., Voronoi sites, borders).
 */

export const ALGORITHM_OVERLAY_CONFIG = {
  voronoi: {
    /** Site marker styling */
    site: {
      /** Radius of the site circle in pixels */
      radius: 6,
      /** Fill color of the site marker */
      fill: '#1E1E46',
      /** Stroke color of the site marker */
      stroke: '#000000',
      /** Stroke width of the site marker */
      strokeWidth: 1.5,
      /** Opacity of the site marker */
      opacity: 0.9,
    },
    /** Border/edge styling */
    border: {
      /** Stroke color of Voronoi borders */
      stroke: '#000000',
      /** Stroke width of Voronoi borders */
      strokeWidth: 3,
      /** Opacity of Voronoi borders */
      opacity: 0.9,
      /** Dash array for border lines (undefined = solid) */
      dashArray: '3 6',
    },
    /** Region fill styling (optional, for debugging) */
    region: {
      /** Whether to show region fills */
      showFill: false,
      /** Fill opacity (0-1) */
      fillOpacity: 0.1,
    },
  },
} as const;
