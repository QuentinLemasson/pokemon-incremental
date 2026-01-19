/**
 * Unified hex coordinates type used across the app.
 *
 * - Stored as axial coordinates (q, r)
 * - Cube coordinate s is optional and can be derived when needed: s = -q - r
 */
export type HexCoordinates = { q: number; r: number; s?: number };
