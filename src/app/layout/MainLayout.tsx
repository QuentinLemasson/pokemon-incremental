export type MainLayoutProps = {
  header: React.ReactNode;
  left: React.ReactNode;
  centerTop: React.ReactNode;
  centerMain: React.ReactNode;
  right: React.ReactNode;
};

/**
 * Main application layout (fixed 5x5 grid).
 *
 * Goals:
 * - Stable grid (no page scroll)
 * - Panels can manage their own internal overflow if needed
 */
export const MainLayout = ({
  left,
  centerTop,
  centerMain,
  right,
}: MainLayoutProps) => {
  return (
    <div className="grid grid-cols-[280px_1fr_280px] grid-rows-[auto_1fr] gap-4 h-full min-h-0">
      <div className="row-span-2 col-start-1 row-start-1 min-h-0 min-w-0">
        {left}
      </div>

      <div className="col-span-1 col-start-2 row-start-1 min-h-0 min-w-0">
        {centerTop}
      </div>

      <div className="col-span-1 row-span-3 col-start-2 row-start-2 min-h-0 min-w-0">
        {centerMain}
      </div>

      <div className="row-span-2 col-start-3 row-start-1 min-h-0 min-w-0">
        {right}
      </div>
    </div>
  );
};
