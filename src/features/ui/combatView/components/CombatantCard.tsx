import type { Combatant } from '@/features/engine/combat/Combatant';
import { StatBar } from './StatBar';

export type CombatantCardProps = {
  sideLabel: 'Player' | 'Enemy';
  combatant: Combatant;
};

/**
 * Displays a single combatant (name/level + HP bar + gauge bar).
 *
 * Presentational only: no gameplay logic.
 */
export const CombatantCard = ({ sideLabel, combatant }: CombatantCardProps) => {
  const { pokemon } = combatant;

  return (
    <div className="rounded-lg border border-slate-700/70 bg-black/20 p-3 ring-1 ring-white/5">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <div className="text-slate-300 text-xs">{sideLabel}</div>
          <div className="font-semibold tracking-wide">
            {pokemon.name}{' '}
            <span className="text-slate-300 font-normal">
              Lv {pokemon.level}
            </span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-300">
          SPD {pokemon.baseStats.spd}
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <StatBar
          label="HP"
          current={combatant.currentHp}
          max={pokemon.baseStats.hp}
          fillClassName="bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-400"
        />

        <StatBar
          label="GAUGE"
          current={combatant.gauge}
          max={combatant.gaugeMax}
          rightLabel={`+${combatant.gaugeGainPerTick.toFixed(2)}/tick`}
          fillClassName="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-300"
        />
      </div>
    </div>
  );
};
