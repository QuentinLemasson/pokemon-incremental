import { CombatView } from '@/features/ui/combatView/CombatView.main';
import { LogView } from '@/features/ui/logView/LogView.main';
import { MapView } from '@/features/ui/mapView/MapView.main';
import { TeamView } from '@/features/ui/teamView/TeamView.main';
import { MainLayout } from '@/app/layout/MainLayout';

export const GamePage = () => {
  return (
    <MainLayout
      header={<div></div>}
      left={<TeamView />}
      centerTop={<CombatView />}
      centerMain={<MapView />}
      right={<LogView />}
    />
  );
};
