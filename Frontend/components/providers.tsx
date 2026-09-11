'use client';

import { CartProvider } from '@/components/cart/cart-context';
import { AuthProvider } from '@/components/auth/auth-context';
import { AuthModal } from '@/components/auth/auth-modal';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <AuthModal />
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: 'border-border bg-card text-card-foreground',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
