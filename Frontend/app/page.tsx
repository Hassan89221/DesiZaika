import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { FloatingCartButton } from '@/components/cart/floating-cart-button';
import { HeroSection } from '@/components/home/hero';
import { HighlightsSection } from '@/components/home/highlights';
import { FeaturedDishes } from '@/components/home/featured-dishes';
import { AboutTeaser } from '@/components/home/about-teaser';
import { TestimonialsSection } from '@/components/home/testimonials';
import { CtaSection } from '@/components/home/cta';
import { createClient } from '@supabase/supabase-js';
import type { MenuCategory, MenuItem, Allergen } from '@/lib/types';
import { menuItems as fallbackItems } from '@/lib/dummy-data';

export type SlideImage = { src: string; alt: string };

// Force this page to always be dynamically rendered (never statically cached)
export const dynamic = 'force-dynamic';

async function getFeaturedDishes(): Promise<MenuItem[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [categoriesRes, itemsRes] = await Promise.all([
      supabase
        .from('menu_categories')
        .select('*')
        .order('sort_order', { ascending: true }),
      supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('name', { ascending: true }),
    ]);

    if (categoriesRes.error || itemsRes.error) {
      return fallbackItems.slice(0, 6);
    }

    const catMap = new Map<string, string>();
    if (Array.isArray(categoriesRes.data)) {
      categoriesRes.data.forEach((c: any) => {
        catMap.set(c.id, c.name.toLowerCase().replace(/\s+/g, '-'));
      });
    }

    const FALLBACK_IMAGE =
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80';

    const mapped: MenuItem[] = (itemsRes.data ?? []).map((item: any) => {
      const catSlug = catMap.get(item.category_id) || 'starters';
      const imageUrl =
        item.image_url && item.image_url.startsWith('http')
          ? item.image_url
          : FALLBACK_IMAGE;
      return {
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: Number(item.price),
        category: catSlug as MenuCategory,
        image: imageUrl,
        spiceLevel:
          item.spice_level === 1
            ? 'mild'
            : item.spice_level === 2
            ? 'medium'
            : item.spice_level === 3
            ? 'extra-hot'
            : 'mild',
        isVegetarian: Boolean(item.is_veg),
        isVegan: false,
        isGlutenFree: Array.isArray(item.allergens)
          ? !item.allergens.includes('gluten')
          : true,
        isFeatured: Boolean(item.is_featured),
        isBestseller: false,
        isNew: false,
        allergens: Array.isArray(item.allergens)
          ? (item.allergens as Allergen[])
          : [],
        prepTime: '20-25 min',
        calories: 450,
        rating: 4.8,
        reviewCount: 24,
      };
    });

    const featuredOnly = mapped.filter((i) => i.isFeatured);
    return featuredOnly.length > 0 ? featuredOnly.slice(0, 6) : mapped.slice(0, 6);
  } catch {
    return fallbackItems.slice(0, 6);
  }
}

// Fallback images per category if DB has none
const CATEGORY_FALLBACKS: SlideImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=940&q=80',
    alt: 'DesiZaika — authentic Pakistani & Indian dining',
  },
  {
    src: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=940&q=80',
    alt: 'Karahi & Main — rich, slow-cooked curries',
  },
  {
    src: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=940&q=80',
    alt: 'Biryani & Rice — fragrant, layered rice dishes',
  },
  {
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=940&q=80',
    alt: 'Vegetarian & Sides — fresh vegetarian delights',
  },
];

async function getSlideImages(): Promise<SlideImage[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from('menu_categories').select('id, name').order('sort_order', { ascending: true }),
      supabase
        .from('menu_items')
        .select('id, name, image_url, category_id')
        .eq('is_available', true)
        .not('image_url', 'is', null)
        .order('name', { ascending: true }),
    ]);

    if (categoriesRes.error || itemsRes.error || !categoriesRes.data || !itemsRes.data) {
      return CATEGORY_FALLBACKS;
    }

    // Build a map: category_id -> first item with a real http image
    const catImageMap = new Map<string, SlideImage>();
    for (const item of itemsRes.data as any[]) {
      if (item.image_url && item.image_url.startsWith('http') && !catImageMap.has(item.category_id)) {
        const cat = (categoriesRes.data as any[]).find((c) => c.id === item.category_id);
        catImageMap.set(item.category_id, {
          src: item.image_url,
          alt: cat ? `${cat.name} — ${item.name}` : item.name,
        });
      }
    }

    // We want at most 3 category images (skip restaurant ambiance slot — always use fallback for first)
    const categoryImages = Array.from(catImageMap.values()).slice(0, 3);

    // Always start with the restaurant ambiance image, then category images
    const slides: SlideImage[] = [
      CATEGORY_FALLBACKS[0], // restaurant ambiance
      ...categoryImages,
    ];

    // If we got fewer than 2 total (no DB images), use full fallbacks
    return slides.length >= 2 ? slides : CATEGORY_FALLBACKS;
  } catch {
    return CATEGORY_FALLBACKS;
  }
}

export default async function Home() {
  const [featuredDishes, slideImages] = await Promise.all([
    getFeaturedDishes(),
    getSlideImages(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HighlightsSection />
        <FeaturedDishes initialItems={featuredDishes} />
        <AboutTeaser slideImages={slideImages} />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </>
  );
}

