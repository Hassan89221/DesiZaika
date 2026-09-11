'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Phone } from 'lucide-react';
import { restaurantInfo } from '@/lib/dummy-data';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/35539324/pexels-photo-35539324.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Indian thali feast"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>

      <ScrollReveal direction="scale" className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Hungry Yet?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
          Your favorite Indian and Pakistani dishes are just a click away. Order
          online now and taste the difference.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="btn-shimmer bg-white text-primary transition-all duration-300 hover:scale-105 hover:bg-white/90"
          >
            <Link href="/menu">
              Order Online <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:text-white"
          >
            <a href={`tel:${restaurantInfo.phone}`}>
              <Phone className="h-5 w-5" /> {restaurantInfo.phone}
            </a>
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
