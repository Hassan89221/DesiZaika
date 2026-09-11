'use client';

import { ScrollReveal } from '@/components/animations/scroll-reveal';

const timeline = [
  {
    year: '2015',
    title: 'The First Plate',
    text: 'Aisha and Imran serve their first biryani from a home kitchen to 20 friends.',
  },
  {
    year: '2016',
    title: 'Opening Day',
    text: 'DesiZaika opens its doors on Spice Bazaar Lane with a 12-item menu.',
  },
  {
    year: '2019',
    title: 'Best Restaurant Award',
    text: 'Voted Best Indian Restaurant by the San Francisco Food Critics Circle — the first of three consecutive wins.',
  },
  {
    year: '2021',
    title: 'Going Online',
    text: 'We launch online ordering and delivery, bringing our food to homes across the city.',
  },
  {
    year: '2025',
    title: '50,000 Orders & Counting',
    text: 'A decade of serving the community, with the same recipes and the same love.',
  },
];

export function StorySection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="prose prose-lg max-w-none">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              How it all began
            </p>
            <h2 className="mb-6 font-display text-3xl font-bold sm:text-4xl">
              From Home Kitchen to Neighborhood Favorite
            </h2>

            <div className="space-y-4 text-muted-foreground">
              <p>
                In 2015, Aisha and Imran started cooking for friends from their
                tiny apartment kitchen. What began as weekend dinner parties
                quickly grew into something bigger. Friends told friends, who
                told their families, and soon there was a line down the block of
                people waiting for a plate of Aisha&apos;s biryani.
              </p>
              <p>
                They found a small space on Spice Bazaar Lane, installed a tandoor
                they brought back from Lahore, and opened the doors of DesiZaika.
                The name means &ldquo;the taste of home&rdquo; — and that&apos;s
                exactly what they set out to share.
              </p>
              <p>
                Ten years later, DesiZaika has become a fixture of the San
                Francisco food scene. We&apos;ve been voted Best Indian Restaurant
                three years running, but the thing we&apos;re proudest of is the
                community that has grown around our food — the regulars who come
                every week, the families who celebrate their milestones with us,
                and the newcomers who discover their new favorite dish.
              </p>
              <p>
                Our recipes haven&apos;t changed. Our spices are still ground
                fresh every morning. Our naan is still baked in that same tandoor
                from Lahore. Because great food isn&apos;t about trends —
                it&apos;s about tradition, patience, and love.
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
