import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { FloatingCartButton } from '@/components/cart/floating-cart-button';
import { MenuPageClient } from '@/components/menu/menu-page-client';

export const metadata = {
  title: 'Menu — CurryMama',
  description: 'Browse our full menu of authentic Indian and Pakistani dishes.',
};

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <MenuPageClient />
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </>
  );
}
