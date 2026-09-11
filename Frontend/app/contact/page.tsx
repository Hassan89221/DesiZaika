import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { FloatingCartButton } from '@/components/cart/floating-cart-button';
import { ContactPageClient } from '@/components/contact/contact-page-client';

export const metadata = {
  title: 'Contact — DesiZaika',
  description: 'Get in touch with DesiZaika. Visit us, call us, or send us a message.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactPageClient />
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </>
  );
}
