import { CombatView } from '@/features/ui/combatView/CombatView.main';
import { LogView } from '@/features/ui/logView/LogView.main';
import { MapView } from '@/features/ui/mapView/MapView.main';
import { TeamView } from '@/features/ui/teamView/TeamView.main';
import { useGameStore } from '@/features/store/gameStore';
export default function App() {
  const tps = useGameStore(s => s.tps);
  return (
    <main className="min-h-screen grid grid-rows-[80px_1fr_40px] p-6 gap-4">
      <header className="flex items-center justify-between">
        <h1>Pokemon RPG incremental game - prototype</h1>
        <div className="text-sm text-slate-200">
          TPS: <span className="font-mono">{tps.toFixed(1)}</span>
        </div>
      </header>
      <div id="main-content" className="grid grid-cols-[1fr_3fr_1fr] gap-4">
        <div id="left">
          <TeamView />
        </div>

        <div id="center" className="flex flex-col gap-4">
          <CombatView />
          <MapView />
        </div>

        <div id="right">
          <LogView />
        </div>
      </div>
    </main>
  );
}
