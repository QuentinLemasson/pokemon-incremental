import { useEngineStore } from '@/features/store/engineStore';

export const TpsMeter = () => {
  const tps = useEngineStore(s => s.tps);

  const isEngineRunning = tps !== undefined && tps !== null;
  const isEngineKO = isEngineRunning && tps === 0;

  if (!isEngineRunning) return null;

  return (
    <div className="text-sm">
      {(() => {
        if (isEngineKO)
          return <span className="text-destructive">Engine KO</span>;
        return <span>TPS: {tps.toFixed(1)}</span>;
      })()}
    </div>
  );
};
