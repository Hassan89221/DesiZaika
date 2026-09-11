'use client';

import { useState, useMemo, useEffect } from 'react';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { ItemDetailModal } from '@/components/menu/item-detail-modal';
import { menuItems as fallbackItems, categories as fallbackCategories } from '@/lib/dummy-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import type { MenuCategory, MenuItem, CategoryInfo, Allergen } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

type FilterType = 'all' | MenuCategory | string;
type DietFilter = 'all' | 'veg' | 'vegan' | 'gf';

export function MenuPageClient() {
  const [categories, setCategories] = useState<CategoryInfo[]>(fallbackCategories);
  const [items, setItems] = useState<MenuItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Modal state for viewing dish details
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        if (!res.ok) throw new Error('Failed to fetch menu');
        const data = await res.json();

        if (Array.isArray(data.categories) && data.categories.length > 0) {
          const catMap = new Map<string, string>();
          const mappedCats: CategoryInfo[] = data.categories.map((c: any) => {
            const slug = c.name.toLowerCase().replace(/\s+/g, '-');
            catMap.set(c.id, slug);
            return {
              id: slug as MenuCategory,
              label: c.name,
              icon: 'Flame',
              description: `${c.name} dishes`,
            };
          });
          setCategories(mappedCats);

          if (Array.isArray(data.items) && data.items.length > 0) {
            const mappedItems: MenuItem[] = data.items.map((item: any) => {
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
            setItems(mappedItems);
          }
        }
      } catch (err) {
        console.error('Error fetching live menu, using fallback data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;
    if (activeCategory !== 'all') {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (dietFilter === 'veg') result = result.filter((i) => i.isVegetarian);
    if (dietFilter === 'vegan') result = result.filter((i) => i.isVegan);
    if (dietFilter === 'gf') result = result.filter((i) => i.isGlutenFree);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, activeCategory, dietFilter, searchQuery]);

  const activeCategoryInfo = categories.find((c) => c.id === activeCategory);
  const categoryLabel = activeCategory === 'all' ? 'All Dishes' : activeCategoryInfo?.label || activeCategory;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Our Menu
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Explore authentic Indian &amp; Pakistani delicacies, prepared daily with
            fresh ingredients and traditional spices.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Controls: Search, Categories, Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {/* Category pills */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Diet filter */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-4 animate-fade-in">
              <p className="w-full text-sm font-semibold text-muted-foreground">
                Dietary Preferences
              </p>
              {([
                { id: 'all', label: 'All' },
                { id: 'veg', label: 'Vegetarian' },
                { id: 'vegan', label: 'Vegan' },
                { id: 'gf', label: 'Gluten-Free' },
              ] as const).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDietFilter(f.id)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    dietFilter === f.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            {categoryLabel}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredItems.length}{' '}
            {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Loading fresh menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium">No dishes found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setActiveCategory('all');
                setDietFilter('all');
                setSearchQuery('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item, i) => (
              <ScrollReveal key={item.id} delay={(i % 4) * 80} direction="up">
                <MenuItemCard item={item} onSelect={(selected) => setSelectedItem(selected)} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Dish Detail & Quantity Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
