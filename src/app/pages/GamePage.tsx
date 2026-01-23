import { CombatView } from '@/features/ui/combatView/CombatView.main';
import { LogView } from '@/features/ui/logView/LogView.main';
import { MapView } from '@/features/ui/mapView/MapView.main';
import { TeamView } from '@/features/ui/teamView/TeamView.main';
import { useEngineStore } from '@/features/store/engineStore';
import { MainLayout } from '@/app/layout/MainLayout';

export const GamePage = () => {
  const tps = useEngineStore(s => s.tps);
  return (
    <MainLayout
      header={
        <header className="flex items-center justify-between h-full">
          <h1>Pokemon RPG incremental game - prototype</h1>
          <div className="text-sm text-slate-200">
            TPS: <span className="font-mono">{tps.toFixed(1)}</span>
          </div>
        </header>
      }
      left={<TeamView />}
      centerTop={<CombatView />}
      centerMain={<MapView />}
      right={<LogView />}
    />
  );
};
