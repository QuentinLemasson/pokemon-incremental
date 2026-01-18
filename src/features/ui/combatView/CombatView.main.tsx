import { Frame } from '@/common/components/Frame';
import { useGameStore } from '@/features/store/gameStore';
import { CombatantCard } from './components/CombatantCard';
import { CombatControls } from './components/CombatControls';
import { CombatHeader } from './components/CombatHeader';

export const CombatView = () => {
  const {
    pendingEncounter,
    clearEncounter,
    startCombat,
    combat,
    combatRunning,
  } = useGameStore();

  if (!pendingEncounter) {
    return <Frame id="combat-view-main">No combat (select a hex)</Frame>;
  }

  const { player, enemy, hexId } = pendingEncounter;
  const ended = combat?.ended ?? false;
  const result = combat?.getResult();

  return (
    <Frame id="combat-view-main" className="space-y-4">
      <CombatHeader
        hexId={hexId}
        statusText={combatRunning ? 'Running' : ended ? 'Ended' : 'Ready'}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <CombatantCard sideLabel="Player" combatant={player} />
        <CombatantCard sideLabel="Enemy" combatant={enemy} />
      </div>

      <CombatControls
        canStart={!!combat}
        running={combatRunning}
        ended={ended}
        resultText={
          ended && result
            ? `Result: ${result.victory ? 'Victory' : 'Defeat'} in ${result.ticks} ticks`
            : undefined
        }
        onStart={startCombat}
        onClose={clearEncounter}
      />
    </Frame>
  );
};
