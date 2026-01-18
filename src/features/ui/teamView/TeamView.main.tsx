import { useGameStore } from '@/features/store/gameStore';

export const TeamView = () => {
  const { playerPokemon } = useGameStore();

  return (
    <div id="team-view-main">
      <div>
        <strong>Team</strong>
      </div>
      <div>
        {playerPokemon.name} (Lv {playerPokemon.level})
      </div>
      <div>
        HP {playerPokemon.baseStats.hp} / ATK {playerPokemon.baseStats.atk} /
        DEF {playerPokemon.baseStats.def}
      </div>
      <div>
        Types: {playerPokemon.type[0]}
        {playerPokemon.type[1] ? `/${playerPokemon.type[1]}` : ''}
      </div>
    </div>
  );
};
