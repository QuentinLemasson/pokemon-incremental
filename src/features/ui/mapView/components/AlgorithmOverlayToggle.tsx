import { Toggle } from '@/common/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/common/ui/tooltip';
import { Layers } from 'lucide-react';

export type AlgorithmOverlayToggleProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
};

/**
 * Toggle control for showing/hiding the algorithm overlay (e.g., Voronoi sites and borders).
 * Positioned in the top-left corner of the map view.
 */
export const AlgorithmOverlayToggle = ({
  enabled,
  onToggle,
  disabled = false,
}: AlgorithmOverlayToggleProps) => {
  return (
    <div className="absolute top-2 left-2 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={enabled}
            onPressedChange={onToggle}
            disabled={disabled}
            variant="outline"
            size="sm"
            aria-label="Toggle algorithm overlay"
            className="bg-background/80 backdrop-blur-sm"
          >
            <Layers className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{enabled ? 'Hide' : 'Show'} algorithm overlay</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
