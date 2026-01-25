import { HelpCircle } from 'lucide-react';
import { Label } from '@/common/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/common/ui/tooltip';

export type FieldDescription = {
  /** The title of the field. */
  title: string;
  /** The description of the field. */
  description: string;
};

export type FieldWithTooltipProps = {
  /** The field to display the tooltip for. */
  field: FieldDescription;
  /** The children to display the field for. */
  children: React.ReactNode;
};

/**
 * A field with a tooltip.
 * @param field - The field to display the tooltip for.
 * @param children - The children to display the field for.
 * @returns A field with a tooltip.
 */
export const FieldWithTooltip = ({
  field,
  children,
}: FieldWithTooltipProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>{field.title}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{field.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );
};
