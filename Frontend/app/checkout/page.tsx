import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { FloatingCartButton } from '@/components/cart/floating-cart-button';
import { CheckoutPageClient } from '@/components/checkout/checkout-page-client';

export const metadata = {
  title: 'Checkout — DesiZaika',
  description: 'Complete your order for pickup or delivery.',
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <CheckoutPageClient />
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </>
  );
}
