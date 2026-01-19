import { Frame } from '@/common/components/Frame';
import { useLogStore } from '@/features/store/logStore';

export const LogView = () => {
  const entries = useLogStore(s => s.entries);

  return (
    <Frame id="log-view-main" className="h-full">
      <div className="flex items-center justify-between mb-2">
        <strong>Log</strong>
        <span className="text-xs text-slate-300">{entries.length} events</span>
      </div>

      {entries.length === 0 ? (
        <div className="text-sm text-slate-300">No events yet.</div>
      ) : (
        <div className="max-h-[60vh] overflow-auto rounded-md border border-slate-700/60 bg-black/20 p-2 font-mono text-xs leading-relaxed">
          <div className="space-y-1">
            {entries.map(e => (
              <div key={e.id} className="whitespace-pre-wrap text-slate-100">
                {e.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </Frame>
  );
};
