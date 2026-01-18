import { Frame } from '@/common/components/Frame';
import { useGameStore } from '@/features/store/gameStore';

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
    <Frame id="combat-view-main">
      <div>
        <strong>Pending encounter</strong> (hex: {hexId})
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div>
            <strong>Player</strong>: {player.pokemon.name} (Lv{' '}
            {player.pokemon.level})
          </div>
          <div>
            HP: {player.currentHp}/{player.pokemon.baseStats.hp}
          </div>
          <div>
            Gauge: {player.gauge.toFixed(2)} / {player.gaugeMax.toFixed(2)} (+
            {player.gaugeGainPerTick.toFixed(2)}/tick)
          </div>
        </div>

        <div>
          <div>
            <strong>Enemy</strong>: {enemy.pokemon.name} (Lv{' '}
            {enemy.pokemon.level})
          </div>
          <div>
            HP: {enemy.currentHp}/{enemy.pokemon.baseStats.hp}
          </div>
          <div>
            Gauge: {enemy.gauge.toFixed(2)} / {enemy.gaugeMax.toFixed(2)} (+
            {enemy.gaugeGainPerTick.toFixed(2)}/tick)
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <button
          onClick={startCombat}
          disabled={combatRunning || ended || !combat}
        >
          {combatRunning ? 'Running…' : ended ? 'Ended' : 'Start combat'}
        </button>
        {ended && result ? (
          <span style={{ marginLeft: 8 }}>
            Result: {result.victory ? 'Victory' : 'Defeat'} in {result.ticks}{' '}
            ticks
          </span>
        ) : (
          <span style={{ marginLeft: 8 }}>
            (Simulation runs on ticks once started)
          </span>
        )}
        <div style={{ marginTop: 8 }}>
          <button onClick={clearEncounter}>Close</button>
        </div>
      </div>
    </Frame>
  );
};
