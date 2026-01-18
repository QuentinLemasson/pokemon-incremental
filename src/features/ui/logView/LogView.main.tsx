import { Frame } from '@/common/components/Frame';
import { useGameStore } from '@/features/store/gameStore';
import type { CombatLogEvent } from '@/features/engine/combat/CombatLog';

export const LogView = () => {
  const { log } = useGameStore();

  const events = log.events;

  const renderEvent = (event: CombatLogEvent) => {
    switch (event.type) {
      case 'system':
        return `#${event.sequence} ${event.message}`;
      case 'combat_start':
        return `t=${event.tick} start (elapsed=${event.elapsedSeconds.toFixed(2)}s)`;
      case 'attack':
        return `t=${event.tick} ${event.attacker}->${event.defender} dmg=${event.damage} hp=${event.defenderHpAfter}`;
      case 'combat_end':
        return `t=${event.tick} end winner=${event.winner} (elapsed=${event.elapsedSeconds.toFixed(2)}s)`;
    }
  };

  return (
    <Frame id="log-view-main" className="h-full">
      <div className="flex items-center justify-between mb-2">
        <strong>Log</strong>
        <span className="text-xs text-slate-300">{events.length} events</span>
      </div>

      {events.length === 0 ? (
        <div className="text-sm text-slate-300">No events yet.</div>
      ) : (
        <div className="max-h-[60vh] overflow-auto rounded-md border border-slate-700/60 bg-black/20 p-2 font-mono text-xs leading-relaxed">
          <div className="space-y-1">
            {events.map((e, idx) => (
              <div key={idx} className="whitespace-pre-wrap text-slate-100">
                {renderEvent(e)}
              </div>
            ))}
          </div>
        </div>
      )}
    </Frame>
  );
};
