import { useGameStore } from '@/features/store/gameStore';

export const CombatView = () => {
  const { pendingEncounter, clearEncounter } = useGameStore();

  if (!pendingEncounter) {
    return <div id="combat-view-main">No combat (select a hex)</div>;
  }

  const { player, enemy, hexId } = pendingEncounter;

  return (
    <div id="combat-view-main">
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
            CD: {player.attackCooldownRemainingSeconds.toFixed(2)}/
            {player.attackCooldownTotalSeconds.toFixed(2)}s
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
            CD: {enemy.attackCooldownRemainingSeconds.toFixed(2)}/
            {enemy.attackCooldownTotalSeconds.toFixed(2)}s
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={clearEncounter}>Close</button>
        <span style={{ marginLeft: 8 }}>
          (Combat not started yet — no ticking)
        </span>
      </div>
    </div>
  );
};
