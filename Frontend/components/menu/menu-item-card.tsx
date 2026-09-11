'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, Plus, Clock, Flame, ArrowRight, Eye } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/components/cart/cart-context';
import { SpiceLevelIndicator } from './spice-level';
import { VegIndicator, DietaryBadges, FeatureBadges } from './dietary-badges';
import { toast } from 'sonner';

interface MenuItemCardProps {
  item: MenuItem;
  linkToMenu?: boolean;
  onSelect?: (item: MenuItem) => void;
}

export function MenuItemCard({ item, linkToMenu = false, onSelect }: MenuItemCardProps) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(item);
    } else {
      addItem(item);
      toast.success(`${item.name} added to cart`);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const cardContent = (
    <div 
      onClick={handleCardClick}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30 cursor-pointer"
    >
      {/* Image */}
      <div className="img-zoom relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3">
          {onSelect && (
            <span className="text-xs font-semibold text-white flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <Eye className="h-3.5 w-3.5" /> View Details
            </span>
          )}
        </div>
        <FeatureBadges item={item} />
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Star className="h-3 w-3 fill-accent text-accent" />
          {item.rating}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <VegIndicator isVeg={item.isVegetarian} />
            <h3 className="font-display text-base font-semibold leading-tight transition-colors duration-300 group-hover:text-primary">
              {item.name}
            </h3>
          </div>
          <span className="whitespace-nowrap font-bold text-primary">
            €{item.price.toFixed(2)}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        <div className="mt-3">
          <DietaryBadges item={item} />
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <SpiceLevelIndicator level={item.spiceLevel} />
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {item.prepTime}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" /> {item.calories} cal
          </span>
        </div>

        <div className="mt-4 flex-1" />

        {linkToMenu ? (
          <Button
            variant="secondary"
            className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
            size="sm"
          >
            Explore in Menu <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        ) : (
          <Button
            onClick={handleAdd}
            className="btn-shimmer w-full transition-all duration-300 hover:shadow-md"
            size="sm"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /> {onSelect ? 'View & Order' : 'Add to Cart'}
          </Button>
        )}
      </div>
    </div>
  );

  if (linkToMenu) {
    return <Link href="/menu" className="block h-full">{cardContent}</Link>;
  }

  return cardContent;
}
