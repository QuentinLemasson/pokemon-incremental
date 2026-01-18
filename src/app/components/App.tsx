import { CombatView } from '@/features/ui/combatView/CombatView.main';
import { MapView } from '@/features/ui/mapView/MapView.main';
import { TeamView } from '@/features/ui/teamView/TeamView.main';
export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <header>
        <h1>Pokemon RPG incremental game - prototype</h1>
      </header>
      <div id="main-content" className="grid grid-cols-3 gap-4">
        <div id="left">
          <TeamView />
        </div>

        <div id="center">
          <CombatView />
          <MapView />
        </div>

        <div id="right">
          <span>👤</span>
        </div>
      </div>
    </main>
  );
}
