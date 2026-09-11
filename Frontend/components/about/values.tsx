'use client';

import { Heart, Leaf, Flame, Users } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description:
      'We cook because we love to. Every dish is a labor of love, not a transaction.',
  },
  {
    icon: Leaf,
    title: 'Quality',
    description:
      'Fresh, locally sourced ingredients. Spices ground daily. No shortcuts, ever.',
  },
  {
    icon: Flame,
    title: 'Authenticity',
    description:
      'True to our roots. We don\'t dilute flavors or compromise on tradition.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We support local farmers, hire from the neighborhood, and give back.',
  },
];

export function ValuesSection() {
  return (
    <section className="border-y border-border bg-card py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            What We Stand For
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Our Values
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 120} direction="up">
              <div className="group rounded-xl border border-border bg-background p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <v.icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
