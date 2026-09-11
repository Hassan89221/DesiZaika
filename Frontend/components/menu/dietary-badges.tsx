import { Leaf, Wheat, Vegan, AlertCircle } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export function VegIndicator({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={cn(
        'flex h-5 w-5 items-center justify-center rounded border-2',
        isVeg ? 'border-success' : 'border-destructive'
      )}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          isVeg ? 'bg-success' : 'bg-destructive'
        )}
      />
    </span>
  );
}

export function DietaryBadges({ item }: { item: MenuItem }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {item.isVegetarian && (
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
          <Leaf className="h-3 w-3" /> Veg
        </span>
      )}
      {item.isVegan && (
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
          <Vegan className="h-3 w-3" /> Vegan
        </span>
      )}
      {item.isGlutenFree && (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent-foreground">
          <Wheat className="h-3 w-3" /> GF
        </span>
      )}
      {item.allergens.length > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground" title={`Contains: ${item.allergens.join(', ')}`}>
          <AlertCircle className="h-3 w-3" /> {item.allergens.join(', ')}
        </span>
      )}
    </div>
  );
}

export function FeatureBadges({ item }: { item: MenuItem }) {
  return (
    <>
      {item.isBestseller && (
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-md">
          Bestseller
        </span>
      )}
      {item.isNew && !item.isBestseller && (
        <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground shadow-md">
          New
        </span>
      )}
    </>
  );
}
