export type CombatHeaderProps = {
  hexId: string;
  statusText?: string;
  fightIndex?: number;
  fightTarget?: number;
};

/**
 * Title/header for the combat panel.
 * Keeps `CombatView` focused on orchestration.
 */
export const CombatHeader = ({
  hexId,
  statusText,
  fightIndex,
  fightTarget,
}: CombatHeaderProps) => {
  const progress =
    typeof fightIndex === 'number' && typeof fightTarget === 'number'
      ? `${fightIndex}/${Number.isFinite(fightTarget) ? fightTarget : '∞'}`
      : null;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[10px] text-slate-300 tracking-wide">
          Encounter
        </div>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
          <div className="min-w-0">
            <strong className="tracking-wide">Hex</strong>{' '}
            <span className="font-mono text-slate-200">{hexId}</span>
          </div>
          {progress ? (
            <div className="text-xs text-slate-300">
              Fights:{' '}
              <span className="font-mono text-slate-200">{progress}</span>
            </div>
          ) : null}
        </div>
      </div>

      {statusText ? (
        <div className="shrink-0 rounded-md border border-slate-700/70 bg-black/20 px-2 py-1 text-[11px] text-slate-200">
          {statusText}
        </div>
      ) : null}
    </div>
  );
};
