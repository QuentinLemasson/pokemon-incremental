/**
 * Preset management for map generation configurations.
 * Handles saving and loading presets to/from localStorage.
 */

import type { WorldGenerationConfig } from '@/features/engine/world/generation/types';

export type Preset = {
  id: string;
  name: string;
  config: WorldGenerationConfig;
  createdAt: number;
};

const STORAGE_KEY = 'poke-rpg-map-gen-presets';

export function savePreset(
  name: string,
  config: WorldGenerationConfig
): Preset {
  const preset: Preset = {
    id: crypto.randomUUID(),
    name,
    config,
    createdAt: Date.now(),
  };

  const presets = loadAllPresets();
  presets.push(preset);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));

  return preset;
}

export function loadAllPresets(): Preset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Preset[];
  } catch {
    return [];
  }
}

export function loadPreset(id: string): Preset | null {
  const presets = loadAllPresets();
  return presets.find(p => p.id === id) ?? null;
}

export function deletePreset(id: string): boolean {
  const presets = loadAllPresets();
  const filtered = presets.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length < presets.length;
}

export function updatePreset(id: string, updates: Partial<Preset>): boolean {
  const presets = loadAllPresets();
  const index = presets.findIndex(p => p.id === id);
  if (index === -1) return false;

  presets[index] = { ...presets[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return true;
}
