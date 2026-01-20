import { Frame } from '@/common/components/Frame';
import { useCombatStore } from '@/features/store/combatStore';
import { CombatantCard } from './components/CombatantCard';
import { CombatControls } from './components/CombatControls';
import { CombatHeader } from './components/CombatHeader';

export const CombatView = () => {
  const encounter = useCombatStore(s => s.encounter);
  const startCombat = useCombatStore(s => s.startCombat);
  const closeEncounter = useCombatStore(s => s.closeEncounter);

  if (!encounter) {
    return <Frame id="combat-view-main">No combat (select a hex)</Frame>;
  }

  const ended = encounter.ended;
  const resultText =
    ended && encounter.result
      ? `Result: ${encounter.result.victory ? 'Victory' : 'Defeat'} in ${encounter.result.ticks} ticks`
      : undefined;

  return (
    <Frame id="combat-view-main" className="space-y-4">
      <CombatHeader
        hexId={encounter.hexId}
        statusText={encounter.running ? 'Running' : ended ? 'Ended' : 'Ready'}
        fightIndex={encounter.fightIndex}
        fightTarget={encounter.fightTarget}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <CombatantCard
          sideLabel="Player"
          combatant={encounter.player}
          speed={encounter.player.spd}
        />
        <CombatantCard
          sideLabel="Enemy"
          combatant={encounter.enemy}
          speed={encounter.enemy.spd}
        />
      </div>

      <CombatControls
        canStart={!ended}
        running={encounter.running}
        ended={ended}
        resultText={resultText}
        onStart={startCombat}
        onClose={closeEncounter}
      />
    </Frame>
  );
};
