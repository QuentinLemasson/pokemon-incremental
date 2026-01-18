# Engine (P1 Prototype)

This folder contains the **gameplay engine**: deterministic simulation code that is **independent from React/UI**.

The P1 goal is a minimal, scalable foundation for an incremental/auto-battler:
- Fixed-step combat simulation (20 ticks/sec, \(dt = 0.05s\))
- No gameplay logic in React
- UI is a read-only renderer of engine state

## Modules

### `pokemon/pokemon.ts`

#### `Pokemon`
- **Role**: immutable combat template.
- **Contains**: identity, level, types, base stats.
- **Does not contain**: timers, current HP, combat logic.

**Why**: A `Pokemon` can be reused across combats and is safe to persist in a save file.

---

### `combat/combat.ts`

#### `Combatant`
- **Role**: per-combat mutable state.
- **Wraps**: a `Pokemon` template.
- **Contains**: `currentHp`, `attackCooldownRemainingSeconds`, `attackCooldownTotalSeconds`.
- **Lifetime**: exists only during combat.

#### `Combat`
- **Role**: combat orchestrator / simulation.
- **Owns**: 2 combatants: `player`, `enemy`.
- **Advances time** only via `tick(dtSeconds)`.
- **Ends** by producing a `CombatResult`.
- **No knowledge of**: world/map/hexes, UI, stores.

#### `CombatResult`
- **Role**: immutable outcome container.
- **Contains**: winner, duration (seconds), tick count.
- **Consumed by**: the game/engine layer to apply progression (clear hex, rewards, etc).

#### `CombatLog`
- **Role**: deterministic debug log (validation tool).
- **Contains**: ordered `CombatLogEvent[]` emitted by the simulation (`combat_start`, `attack`, `combat_end`).
- **Used by**: dev tooling / UI display only (never as gameplay logic).

---

### `world/*`

#### `Hex` (`world/hex.ts`)
- **Role**: world node / tile state (biome, explored/cleared flags).
- **P1 note**: combat should not be started *inside* `Hex`. It should be orchestrated by the engine/game layer.

#### `generateMaps` (`world/generator.ts`)
- **Role**: produces a list of hexes (placeholder generator for now).

---

### `game/game.ts`

#### `Game`
- **Role (today)**: very small container owning `maps`.
- **Target role (P1)**: orchestration layer that:
  - receives player intentions (explore hex)
  - creates a `Combat` session (`startCombat(hexId)`)
  - advances combat via ticks (through a runner/clock later)
  - applies `CombatResult` back to the world (`applyCombatResult(hexId)`)

## Relationship diagram (P1 target)

```
Map click (UI intent)
  -> Store facade
    -> Game/Engine (orchestrator)
      -> create Combat (player Combatant + enemy Combatant)
        -> Combat.tick(dt) at 20 TPS
          -> emits CombatLog events
          -> returns CombatResult when ended
      -> apply CombatResult to World (Hex explored/cleared)
```

## Invariants / rules (P1)
- **Only the engine advances gameplay time** (via ticks).
- **Combat never mutates the world directly**.
- **UI never changes timers/HP**; it only reads engine state and renders.

