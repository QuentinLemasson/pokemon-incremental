import { cn } from '@/common/utils/shadcn.util';
import { StatBar } from './StatBar';

export type CombatantCardProps = {
  sideLabel: 'Player' | 'Enemy';
  // TODO : replace with Combatant type surcharge
  combatant: {
    name: string;
    level: number;
    hp: number;
    hpMax: number;
    gauge: number;
    gaugeMax: number;
    gaugeGainPerTick: number;
  };
  speed: number;
};

/**
 * Displays a single combatant (name/level + HP bar + gauge bar).
 *
 * Presentational only: no gameplay logic.
 */
export const CombatantCard = ({
  sideLabel,
  combatant,
  speed,
}: CombatantCardProps) => {
  const isEnemy = sideLabel === 'Enemy';

  return (
    <div
      className={cn(
        'rounded-lg border bg-black/20 p-3 ring-1 ring-white/5',
        'border-slate-700/70'
      )}
    >
      <div
        className={cn(
          'flex items-start gap-3',
          // Make enemy layout mirror the player (sprite on the right).
          isEnemy ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        {/* Reserved space for creature sprite (placeholder for now). */}
        <div
          className={cn(
            'shrink-0',
            'h-16 w-16 rounded-md border',
            'bg-slate-950/40 border-slate-700/70',
            'grid place-items-center',
            'text-[10px] uppercase tracking-wider text-slate-500'
          )}
          aria-label={`${sideLabel} sprite placeholder`}
          title="Sprite (placeholder)"
        >
          Sprite
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] text-slate-300 tracking-wide">
                {sideLabel}
              </div>
              <div className="truncate text-sm font-semibold tracking-wide">
                {combatant.name}{' '}
                <span className="text-slate-300 font-normal">
                  Lv {combatant.level}
                </span>
              </div>
            </div>
            <div className="shrink-0 text-[11px] font-mono text-slate-300">
              SPD {speed}
            </div>
          </div>

          <div className="mt-2 space-y-2">
            <StatBar
              label="HP"
              current={combatant.hp}
              max={combatant.hpMax}
              rightLabel={`${combatant.hp.toFixed(0)}/${combatant.hpMax.toFixed(0)}`}
              showNumbers={false}
              fillClassName="bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-400"
            />

            <StatBar
              label="GAUGE"
              current={combatant.gauge}
              max={combatant.gaugeMax}
              rightLabel={`${combatant.gauge.toFixed(0)}/${combatant.gaugeMax.toFixed(0)} • +${combatant.gaugeGainPerTick.toFixed(2)}/tick`}
              showNumbers={false}
              fillClassName="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
