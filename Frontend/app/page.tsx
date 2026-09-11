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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HighlightsSection />
        <FeaturedDishes />
        <AboutTeaser />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </>
  );
}
