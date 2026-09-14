'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import type { MenuItem } from '@/lib/types';

interface FeaturedDishesProps {
  initialItems: MenuItem[];
}

export function FeaturedDishes({ initialItems }: FeaturedDishesProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Chef&apos;s Selection
            </p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Featured Dishes
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Our most-loved dishes, crafted with care and bursting with the
              flavors of the subcontinent.
            </p>
          </div>
          <Button asChild variant="outline" className="btn-shimmer">
            <Link href="/menu">
              View Full Menu <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {initialItems.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 100} direction="up">
              <MenuItemCard item={item} linkToMenu={true} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

