'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { menuItems as fallbackItems } from '@/lib/dummy-data';
import { ChevronRight, Loader2 } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import type { MenuCategory, MenuItem, Allergen } from '@/lib/types';

export function FeaturedDishes() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/menu');
        if (!res.ok) throw new Error('Failed to fetch menu');
        const data = await res.json();

        if (Array.isArray(data.items) && data.items.length > 0) {
          const catMap = new Map<string, string>();
          if (Array.isArray(data.categories)) {
            data.categories.forEach((c: any) => {
              catMap.set(c.id, c.name.toLowerCase().replace(/\s+/g, '-'));
            });
          }

          const mapped: MenuItem[] = data.items.map((item: any) => {
            const catSlug = catMap.get(item.category_id) || 'starters';
            const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80';
            const imageUrl = item.image_url && item.image_url.startsWith('http') ? item.image_url : FALLBACK_IMAGE;
            return {
              id: item.id,
              name: item.name,
              description: item.description || '',
              price: Number(item.price),
              category: catSlug as MenuCategory,
              image: imageUrl,
              spiceLevel: item.spice_level === 1 ? 'mild' : item.spice_level === 2 ? 'medium' : item.spice_level === 3 ? 'extra-hot' : 'mild',
              isVegetarian: Boolean(item.is_veg),
              isVegan: false,
              isGlutenFree: Array.isArray(item.allergens) ? !item.allergens.includes('gluten') : true,
              isFeatured: Boolean(item.is_featured),
              isBestseller: false,
              isNew: false,
              allergens: Array.isArray(item.allergens) ? (item.allergens as Allergen[]) : [],
              prepTime: '20-25 min',
              calories: 450,
              rating: 4.8,
              reviewCount: 24,
            };
          });

          // Prefer items marked as featured, or fall back to first 6 items
          const featuredOnly = mapped.filter((i) => i.isFeatured);
          setItems(featuredOnly.length > 0 ? featuredOnly.slice(0, 6) : mapped.slice(0, 6));
        } else {
          setItems(fallbackItems.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching featured dishes:', err);
        setItems(fallbackItems.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 100} direction="up">
                <MenuItemCard item={item} linkToMenu={true} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
