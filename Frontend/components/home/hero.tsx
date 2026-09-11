'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, Clock, Truck, ChevronRight } from 'lucide-react';
import { restaurantInfo } from '@/lib/dummy-data';

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/28909536/pexels-photo-28909536.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Delicious biryani"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="animate-hero-badge mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span>Rated 4.9 by 2,000+ happy customers</span>
          </div>

          <h1 className="animate-hero-title font-display text-5xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
            Authentic Flavors
            <br />
            of <span className="text-accent">India &amp; Pakistan</span>
          </h1>

          <p className="animate-hero-text mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
            From sizzling tandoor to fragrant biryani, every dish at DesiZaika
            is crafted with time-honored recipes and the freshest spices. Order
            online for pickup or delivery.
          </p>

          <div className="animate-hero-buttons mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="btn-shimmer text-base">
              <Link href="/menu">
                Order Now <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-base text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-white"
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </div>

          {/* Info badges */}
          <div className="animate-hero-badges mt-10 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-white/90 transition-transform duration-300 hover:scale-105">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors duration-300 hover:bg-white/20">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Open Daily</p>
                <p className="text-xs text-white/70">11 AM – 10 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/90 transition-transform duration-300 hover:scale-105">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors duration-300 hover:bg-white/20">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Fast Delivery</p>
                <p className="text-xs text-white/70">
                  {restaurantInfo.estimatedDeliveryTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/90 transition-transform duration-300 hover:scale-105">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors duration-300 hover:bg-white/20">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Top Rated</p>
                <p className="text-xs text-white/70">Best Indian in SF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce sm:block">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1">
          <div className="h-2 w-1 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
