'use client';

import { Flame, Leaf, Truck, Award } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const highlights = [
  {
    icon: Flame,
    title: 'Authentic Recipes',
    description:
      'Every dish is prepared using recipes passed down through generations, staying true to their roots.',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description:
      'We source locally grown produce and grind our own spices daily for maximum flavor and aroma.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description:
      'Hot, fresh food delivered to your door in 30–45 minutes. Free delivery on orders over $40.',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description:
      'Voted Best Indian Restaurant three years running by the San Francisco Food Critics Circle.',
  },
];

export function HighlightsSection() {
  return (
    <section className="border-b border-border bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <ScrollReveal key={h.title} delay={i * 120} direction="up">
              <div className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <h.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">
                  {h.title}
                </h3>
                <p className="text-sm text-muted-foreground">{h.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
