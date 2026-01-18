import { cn } from '@/common/utils/shadcn.util';

export type StatBarProps = {
  label: string;
  current: number;
  max: number;
  /**
   * Optional secondary text displayed on the right of the label line
   * (e.g. "+1.23/tick").
   */
  rightLabel?: string;
  /** Tailwind classes for the fill (gradient/color). */
  fillClassName: string;
};

/**
 * Video-game style bar (HP / gauge).
 *
 * Purely presentational:
 * - Does not change gameplay values.
 * - Computes percentages for display only.
 */
export const StatBar = ({
  label,
  current,
  max,
  rightLabel,
  fillClassName,
}: StatBarProps) => {
  const safeMax = max <= 0 ? 1 : max;
  const ratio = Math.max(0, Math.min(1, current / safeMax));

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-xs text-slate-200/90">
        <span className="tracking-wide">{label}</span>
        {rightLabel ? (
          <span className="font-mono text-[11px] text-slate-300">
            {rightLabel}
          </span>
        ) : null}
      </div>

      <div className="relative h-3 rounded-md border border-slate-700/80 bg-black/40 shadow-inner">
        <div
          className={cn(
            'h-full rounded-[5px] transition-[width] duration-150',
            'shadow-[0_0_12px_rgba(255,255,255,0.08)]',
            fillClassName
          )}
          style={{ width: `${ratio * 100}%` }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-white/5" />
      </div>

      <div className="flex justify-between text-[11px] text-slate-300 font-mono">
        <span>{current.toFixed(0)}</span>
        <span>{max.toFixed(0)}</span>
      </div>
    </div>
  );
};
