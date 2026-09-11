'use client';

import { useCart } from './cart-context';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export function FloatingCartButton() {
  const { totalItems, openCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const prevItems = useRef(totalItems);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (totalItems > prevItems.current) {
      setBouncing(true);
      const t = setTimeout(() => setBouncing(false), 600);
      return () => clearTimeout(t);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    prevItems.current = totalItems;
  }, [totalItems]);

  if (totalItems === 0) return null;

  return (
    <button
      onClick={openCart}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:bg-primary/90',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0',
        bouncing && 'animate-gentle-pulse'
      )}
      aria-label="Open cart"
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="font-semibold">{totalItems}</span>
      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
        {totalItems}
      </span>
    </button>
  );
}
