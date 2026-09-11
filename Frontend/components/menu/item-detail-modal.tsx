'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, Clock, Flame, ShoppingBag } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/components/cart/cart-context';
import { SpiceLevelIndicator } from './spice-level';
import { VegIndicator, DietaryBadges, FeatureBadges } from './dietary-badges';
import { toast } from 'sonner';

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when modal opens for a new item
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleAddToCart = () => {
    addItem(item, quantity);
    toast.success(`Added ${quantity} × ${item.name} to cart`);
    onClose();
  };

  const lineTotal = item.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-border">
        {/* Hero Image Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          <FeatureBadges item={item} />
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {item.rating} ({item.reviewCount} reviews)
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <VegIndicator isVeg={item.isVegetarian} />
                  <DialogTitle className="font-display text-2xl font-bold">
                    {item.name}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
                  {item.description}
                </DialogDescription>
              </div>
              <span className="text-2xl font-extrabold text-primary whitespace-nowrap">
                €{item.price.toFixed(2)}
              </span>
            </div>
          </DialogHeader>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 p-3 text-xs">
            <SpiceLevelIndicator level={item.spiceLevel} />
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" /> {item.prepTime}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-primary" /> {item.calories} cal
            </span>
          </div>

          {/* Dietary Tags */}
          <DietaryBadges item={item} />

          {/* Allergens warning if present */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-md p-2.5">
              <strong className="text-amber-600 dark:text-amber-400">Allergen Info:</strong> Contains {item.allergens.join(', ')}.
            </div>
          )}

          {/* Quantity & Add to Cart Controls */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between w-full sm:w-auto rounded-lg border border-border bg-muted/50 p-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-bold text-base">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="btn-shimmer w-full flex-1 font-semibold text-base justify-between gap-2 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Add to Order
              </span>
              <span className="font-bold">€{lineTotal.toFixed(2)}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
