import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { FloatingCartButton } from '@/components/cart/floating-cart-button';
import { AboutHero } from '@/components/about/about-hero';
import { StorySection } from '@/components/about/story';
import { ValuesSection } from '@/components/about/values';
import { GallerySection } from '@/components/about/gallery';

export const metadata = {
  title: 'About — CurryMama',
  description: 'The story behind CurryMama — authentic Indian & Pakistani cuisine in San Francisco.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <GallerySection />
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </>
  );
}
