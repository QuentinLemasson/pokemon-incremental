/**
 * Seed utilities for deterministic procedural generation.
 *
 * Goals:
 * - Given the same seed + config, generation is identical.
 * - Provide helpers to create a new seed string for UI later.
 */

export type SeedString = string;

/**
 * Creates a random seed string.
 * Uses `crypto.getRandomValues` when available.
 */
export function createSeedString(): SeedString {
  const bytes = new Uint8Array(8);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1)
      bytes[i] = Math.floor(Math.random() * 256);
  }
  // base36-ish
  let acc = 0n;
  for (const b of bytes) acc = (acc << 8n) + BigInt(b);
  return acc.toString(36);
}

/**
 * Hashes an arbitrary seed string into a uint32.
 * (FNV-1a 32-bit)
 */
export function seedToUint32(seed: SeedString): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export type Rng = {
  nextFloat: () => number; // [0,1)
  int: (minInclusive: number, maxInclusive: number) => number;
  pick: <T>(arr: readonly T[]) => T;
};

/**
 * Small fast deterministic RNG (mulberry32).
 */
export function createRng(seed: SeedString): Rng {
  let a = seedToUint32(seed) >>> 0;

  const nextFloat = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (minInclusive: number, maxInclusive: number) => {
    const min = Math.ceil(minInclusive);
    const max = Math.floor(maxInclusive);
    if (max < min) return min;
    return min + Math.floor(nextFloat() * (max - min + 1));
  };

  const pick = <T>(arr: readonly T[]) => {
    return arr[int(0, arr.length - 1)];
  };

  return { nextFloat, int, pick };
}

/**
 * 2D deterministic noise in [-1, 1] based on integer coords and a seed.
 * This is not “smooth” noise; it’s hash noise (good enough for P1 jitter).
 */
export function noise2dSigned(
  seed: SeedString,
  x: number,
  y: number,
  salt = 0
): number {
  // Mix coordinates + salt into a uint32 using integer ops
  let h = seedToUint32(seed) ^ (salt >>> 0);
  h ^= Math.imul(x | 0, 0x9e3779b1);
  h ^= Math.imul(y | 0, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
  h = (h ^ (h >>> 16)) >>> 0;
  return (h / 0xffffffff) * 2 - 1;
}
