import { Button } from '@/common/ui/button';

export type CombatControlsProps = {
  canStart: boolean;
  running: boolean;
  ended: boolean;
  resultText?: string;
  onStart: () => void;
  onClose: () => void;
};

/**
 * Combat action buttons + status text.
 *
 * Presentational only (handlers passed in).
 */
export const CombatControls = ({
  canStart,
  running,
  ended,
  resultText,
  onStart,
  onClose,
}: CombatControlsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button onClick={onStart} disabled={!canStart || running || ended}>
          {running ? 'Running…' : ended ? 'Ended' : 'Start combat'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>

        <div className="text-xs text-slate-300">
          {ended ? resultText : '(Simulation runs on ticks once started)'}
        </div>
      </div>
    </div>
  );
};
