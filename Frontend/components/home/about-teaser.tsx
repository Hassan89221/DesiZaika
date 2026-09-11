'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Heart, Users, Utensils } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
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

export function AboutTeaser() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Image side */}
          <ScrollReveal direction="right">
            <div className="relative">
              <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/38349089/pexels-photo-38349089.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="DesiZaika restaurant interior"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Floating stats card */}
              <div className="absolute -bottom-6 -right-4 hidden animate-float rounded-xl border border-border bg-background p-5 shadow-xl sm:block">
                <div className="flex gap-6">
                  <AnimatedStat value={10} suffix="+" label="Years" />
                  <AnimatedStat value={50} suffix="k+" label="Orders" />
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
                A Taste of Home,
                <br />
                Crafted with Passion
              </h2>
              <p className="mt-4 text-muted-foreground">
                DesiZaika was born from a simple idea: to bring the authentic
                flavors of India and Pakistan to San Francisco. What started as a
                family kitchen has grown into a beloved restaurant, but our
                commitment to quality has never changed.
              </p>
              <p className="mt-3 text-muted-foreground">
                Every spice is freshly ground, every curry is made to order, and
                every naan is baked in our tandoor. We don&apos;t take shortcuts
                because great food takes time.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { icon: Heart, title: 'Made with Love', desc: 'Family recipes, three generations in the making' },
                  { icon: Utensils, title: 'Cooked to Order', desc: 'Nothing is pre-made. Your meal is fresh, always.' },
                  { icon: Users, title: 'Community First', desc: 'We support local farmers and suppliers' },
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
