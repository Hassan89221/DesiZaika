'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Heart, Users, Utensils } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';

// One image per category + restaurant exterior
const SLIDESHOW_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=940&q=80',
    alt: 'DesiZaika restaurant — authentic Pakistani & Indian dining',
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

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05, rootMargin: '0px 0px 50px 0px' });
  const count = useAnimatedCounter(isVisible ? value : 0, 1800);
  return (
    <div ref={ref}>
      <p className="font-display text-2xl font-bold text-primary">
        {Math.round(count)}{suffix}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export type SlideImage = { src: string; alt: string };

interface AboutTeaserProps {
  slideImages?: SlideImage[];
}

export function AboutTeaser({ slideImages }: AboutTeaserProps) {
  const images = slideImages && slideImages.length > 0 ? slideImages : SLIDESHOW_IMAGES;
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative overflow-hidden border-y border-border bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Image slideshow side */}
          <ScrollReveal direction="right">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg bg-muted">
                {images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.src + i}
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: i === activeIdx ? 1 : 0 }}
                  />
                ))}

                {/* Slide indicator dots */}
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeIdx
                          ? 'w-6 bg-white'
                          : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -bottom-6 -right-4 hidden animate-float rounded-xl border border-border bg-background p-5 shadow-xl sm:block">
                <div className="flex gap-6">
                  <AnimatedStat value={1} suffix="+" label="Year" />
                  <AnimatedStat value={350} suffix="+" label="Customers" />
                  <AnimatedStat value={4} suffix=".9" label="Rating" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Text side */}
          <ScrollReveal direction="left">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                Our Story
              </p>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                From Pakistan to Ireland,
                <br />
                With a Taste of Home
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our story began with a love for the food we grew up with in
                Pakistan. After moving to Ireland for higher education, our
                founder found himself missing the rich flavours, aromas, and
                traditions of home.
              </p>
              <p className="mt-3 text-muted-foreground">
                That love turned into a dream to bring authentic Pakistani and
                Indian cuisine to Ireland. Today, we&apos;re proud to serve
                traditional desi dishes made with quality ingredients and the
                warmth of true hospitality.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { icon: Heart, title: 'Authentic Recipes', desc: 'Traditional flavours straight from Pakistan & India' },
                  { icon: Utensils, title: 'Cooked to Order', desc: 'Nothing is pre-made. Your meal is fresh, always.' },
                  { icon: Users, title: 'Community First', desc: 'Proudly serving the local community in Dublin' },
                ].map((item, i) => (
                  <ScrollReveal key={item.title} delay={i * 100} direction="up">
                    <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <Button asChild className="btn-shimmer mt-8">
                <Link href="/about">
                  Read Our Full Story <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

