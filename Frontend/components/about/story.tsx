'use client';

import { ScrollReveal } from '@/components/animations/scroll-reveal';

const timeline = [
  {
    year: '2025',
    title: 'The Idea',
    text: 'A passion for food and a dream to bring authentic desi flavours to Ireland.',
  },
  {
    year: '2025–26',
    title: 'Our Beginning',
    text: 'The restaurant opens its doors, bringing Pakistani and Indian favourites to the community.',
  },
  {
    year: 'Today',
    title: 'Taste of Home',
    text: 'Continuing to share the flavours and traditions we grew up with, one plate at a time.',
  },
];

export function StorySection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="prose prose-lg max-w-none">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Our Story
            </p>
            <h2 className="mb-6 font-display text-3xl font-bold sm:text-4xl">
              From Pakistan to Ireland, With a Taste of Home
            </h2>

            <div className="space-y-4 text-muted-foreground">
              <p>
                Our story began with a love for the food we grew up with in
                Pakistan. After moving to Ireland for higher education, our
                founder found himself missing the rich flavours, aromas, and
                traditions of home.
              </p>
              <p>
                During the final year of his degree, that love for authentic
                Pakistani and Indian cuisine turned into an idea &mdash; to bring
                the taste of home to Ireland and share it with the local
                community.
              </p>
              <p>
                What started as a dream became our restaurant in 2025&ndash;2026.
                Today, we&apos;re proud to serve traditional desi dishes made with
                authentic flavours, quality ingredients, and the warmth of
                Pakistani and Indian hospitality.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="mt-16 space-y-8">
          <ScrollReveal direction="up">
            <h3 className="font-display text-2xl font-bold">Our Journey</h3>
          </ScrollReveal>
          <div className="relative space-y-8 border-l-2 border-primary/20 pl-8">
            {timeline.map((item, i) => (
              <ScrollReveal key={item.year} delay={i * 120} direction="up">
                <div className="group relative transition-all duration-300 hover:translate-x-1">
                  <div className="absolute -left-[37px] flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background transition-transform duration-300 group-hover:scale-125" />
                  <p className="font-display text-lg font-bold text-primary">
                    {item.year}
                  </p>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

