import { MAX_TICKS_PER_FRAME, TICK_DURATION, TICK_RATE } from './tick.config';

/**
 * Fixed-timestep tick context provided to tick subscribers.
 *
 * Notes:
 * - `tickIndex` is monotonic and deterministic for a given tick sequence.
 * - `dtMs` is always exactly `TICK_DURATION` (fixed timestep).
 * - `simTimeMs` is simulated time (not wall time).
 */
export type TickContext = {
  tickIndex: number;
  dtMs: number;
  simTimeMs: number;
};

/**
 * Runtime stats exported by the engine runner.
 *
 * This is intended for diagnostics (TPS display) and future offline-progress work.
 */
export type EngineRunnerStats = {
  /** Configured target tick rate (ticks/sec). */
  targetTps: number;
  /** Measured ticks/sec over the last sampling window. */
  currentTps: number;
  /** Total ticks executed since start. */
  totalTicks: number;
  /** Total simulated time executed (ms). */
  simulatedTimeMs: number;
  /**
   * Last real delta (ms) between animation frames (unclamped).
   * Useful later for offline/inactive-tab progress strategies.
   */
  lastRealDeltaMs: number;
};

type TickSubscriber = (ctx: TickContext) => void;
type TpsSubscriber = (tps: number) => void;

/**
 * Deterministic fixed-timestep engine runner (web/incremental-game style).
 *
 * Properties:
 * - Uses `requestAnimationFrame` as the driving clock.
 * - Converts variable frame delta into fixed-size ticks using an accumulator.
 * - Clamps catch-up work to avoid the “spiral of death”.
 * - Can run with zero UI involvement (pure engine runtime).
 *
 * Determinism notes:
 * - The simulation always advances in fixed \(dt\) steps (`TICK_DURATION` ms).
 * - If frame times are large (inactive tab), clamping limits catch-up ticks.
 *   This intentionally trades “simulate all missed time” for stability; later
 *   we can add offline progression as an explicit separate mechanism.
 */
export class EngineRunner {
  private running = false;
  private rafId: number | null = null;

  private lastTimestampMs: number | null = null;
  private accumulatorMs = 0;

  private tickIndex = 0;
  private simTimeMs = 0;

  private lastRealDeltaMs = 0;

  // TPS sampling
  private tpsSampleStartMs: number | null = null;
  private ticksSinceSampleStart = 0;
  private currentTps = 0;

  private readonly tickSubscribers = new Set<TickSubscriber>();
  private readonly tpsSubscribers = new Set<TpsSubscriber>();

  /** Starts the runner. Safe to call multiple times. */
  start() {
    if (this.running) return;
    this.running = true;
    this.rafId = requestAnimationFrame(this.loop);
  }

  /** Stops the runner. Safe to call multiple times. */
  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastTimestampMs = null;
    this.accumulatorMs = 0;
    this.tpsSampleStartMs = null;
    this.ticksSinceSampleStart = 0;
  }

  /** True if the RAF loop is currently active. */
  get isRunning(): boolean {
    return this.running;
  }

  /**
   * Subscribe to fixed-step ticks.
   * @returns unsubscribe function
   */
  subscribeTick(fn: TickSubscriber) {
    this.tickSubscribers.add(fn);
    return () => this.tickSubscribers.delete(fn);
  }

  /**
   * Subscribe to TPS updates (emitted about once per second).
   * @returns unsubscribe function
   */
  subscribeTps(fn: TpsSubscriber) {
    this.tpsSubscribers.add(fn);
    return () => this.tpsSubscribers.delete(fn);
  }

  /** Current runner stats snapshot. */
  getStats(): EngineRunnerStats {
    return {
      targetTps: TICK_RATE,
      currentTps: this.currentTps,
      totalTicks: this.tickIndex,
      simulatedTimeMs: this.simTimeMs,
      lastRealDeltaMs: this.lastRealDeltaMs,
    };
  }

  private loop = (timestampMs: number) => {
    if (!this.running) return;

    if (this.lastTimestampMs === null) {
      // First frame: initialize clocks, don’t simulate yet.
      this.lastTimestampMs = timestampMs;
      this.tpsSampleStartMs = timestampMs;
      this.rafId = requestAnimationFrame(this.loop);
      return;
    }

    const realDeltaMs = Math.max(0, timestampMs - this.lastTimestampMs);
    this.lastRealDeltaMs = realDeltaMs;
    this.lastTimestampMs = timestampMs;

    // Clamp the amount of time we convert into ticks.
    // This keeps per-frame work bounded and avoids runaway catch-up.
    const maxDeltaMs = MAX_TICKS_PER_FRAME * TICK_DURATION;
    const clampedDeltaMs = Math.min(realDeltaMs, maxDeltaMs);
    this.accumulatorMs += clampedDeltaMs;

    let ticksThisFrame = 0;
    while (
      this.accumulatorMs >= TICK_DURATION &&
      ticksThisFrame < MAX_TICKS_PER_FRAME
    ) {
      this.step();
      this.accumulatorMs -= TICK_DURATION;
      ticksThisFrame += 1;
    }

    // If we hit the cap, drop remaining accumulated time to keep things stable/deterministic.
    if (ticksThisFrame >= MAX_TICKS_PER_FRAME) {
      this.accumulatorMs = 0;
    }

    this.maybeEmitTps(timestampMs);
    this.rafId = requestAnimationFrame(this.loop);
  };

  private step() {
    this.tickIndex += 1;
    this.simTimeMs += TICK_DURATION;
    this.ticksSinceSampleStart += 1;

    const ctx: TickContext = {
      tickIndex: this.tickIndex,
      dtMs: TICK_DURATION,
      simTimeMs: this.simTimeMs,
    };

    // Deterministic: consistent iteration order.
    for (const fn of this.tickSubscribers) fn(ctx);
  }

  private maybeEmitTps(nowMs: number) {
    if (this.tpsSampleStartMs === null) {
      this.tpsSampleStartMs = nowMs;
      this.ticksSinceSampleStart = 0;
      return;
    }

    const elapsedMs = nowMs - this.tpsSampleStartMs;
    if (elapsedMs < 1000) return;

    const elapsedSeconds = elapsedMs / 1000;
    const tps = this.ticksSinceSampleStart / elapsedSeconds;

    this.currentTps = tps;
    for (const fn of this.tpsSubscribers) fn(tps);

    this.tpsSampleStartMs = nowMs;
    this.ticksSinceSampleStart = 0;
  }
}

declare global {
  var __POKE_RPG_ENGINE_RUNNER__: EngineRunner | undefined;
}

/**
 * Global singleton instance (HMR-safe).
 *
 * Requirements satisfied:
 * - Created one time only
 * - Independent from the UI
 * - Can run by itself (call `engineRunner.start()`)
 */
export const engineRunner: EngineRunner =
  globalThis.__POKE_RPG_ENGINE_RUNNER__ ??
  (globalThis.__POKE_RPG_ENGINE_RUNNER__ = new EngineRunner());
