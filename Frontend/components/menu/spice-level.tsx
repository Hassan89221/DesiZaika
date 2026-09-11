import { Flame } from 'lucide-react';
import type { SpiceLevel } from '@/lib/types';
import { cn } from '@/lib/utils';

const spiceConfig: Record<
  SpiceLevel,
  { label: string; count: number; color: string }
> = {
  mild: { label: 'Mild', count: 1, color: 'text-success' },
  medium: { label: 'Medium', count: 2, color: 'text-accent' },
  hot: { label: 'Hot', count: 3, color: 'text-primary' },
  'extra-hot': { label: 'Extra Hot', count: 4, color: 'text-destructive' },
};

export function SpiceLevelIndicator({
  level,
  showLabel = true,
}: {
  level: SpiceLevel;
  showLabel?: boolean;
}) {
  const config = spiceConfig[level];
  return (
    <span className="inline-flex items-center gap-1" title={config.label}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Flame
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < config.count ? config.color : 'text-muted/30'
          )}
        />
      ))}
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground">
          {config.label}
        </span>
      )}
    </span>
  );
}
