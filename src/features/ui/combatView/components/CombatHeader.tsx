export type CombatHeaderProps = {
  hexId: string;
  statusText?: string;
};

/**
 * Title/header for the combat panel.
 * Keeps `CombatView` focused on orchestration.
 */
export const CombatHeader = ({ hexId, statusText }: CombatHeaderProps) => {
  return (
    <div className="flex items-baseline justify-between">
      <div className="space-y-1">
        <div className="text-xs text-slate-300 tracking-wide">Encounter</div>
        <div className="text-sm">
          <strong className="tracking-wide">Hex</strong>{' '}
          <span className="font-mono text-slate-200">{hexId}</span>
        </div>
      </div>
      {statusText ? (
        <div className="text-xs text-slate-300">{statusText}</div>
      ) : null}
    </div>
  );
};
