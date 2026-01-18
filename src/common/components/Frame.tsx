import type { ClassValue } from 'clsx';
import { cn } from '../utils/shadcn.util';

export type FrameProps = {
  id?: string;
  className?: ClassValue;
  children: React.ReactNode;
};

export const Frame = ({ id, className, children }: FrameProps) => {
  return (
    <div
      id={id}
      className={cn(
        'frame-component',
        // Game-ish panel: subtle depth, darker surface, stronger border.
        'relative overflow-hidden rounded-lg border-2 p-4',
        'border-slate-700/80 bg-slate-950/70 text-slate-100',
        'shadow-[0_10px_30px_rgba(0,0,0,0.35)]',
        'ring-1 ring-white/5',
        // Inner sheen.
        "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-40 before:content-['']",
        className
      )}
    >
      {children}
    </div>
  );
};
