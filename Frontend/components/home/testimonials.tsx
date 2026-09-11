'use client';

import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/lib/dummy-data';
import type { Testimonial } from '@/lib/types';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg">
      <div className="mb-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
              i < t.rating
                ? 'fill-accent text-accent'
                : 'fill-muted text-muted'
            }`}
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
      <Quote className="mb-3 h-8 w-8 text-primary/20 transition-transform duration-300 group-hover:scale-110" />
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.avatar}
          alt={t.name}
          className="h-10 w-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            What People Say
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Loved by Our Community
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Don&apos;t just take our word for it. Here&apos;s what our customers
            have to say about their DesiZaika experience.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 100} direction="up">
              <TestimonialCard t={t} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
