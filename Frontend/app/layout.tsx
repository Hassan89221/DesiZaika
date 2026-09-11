import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'DesiZaika — Authentic Indian & Pakistani Cuisine',
  description:
    'Experience the rich flavors of India and Pakistan. Order online for pickup or delivery, browse our menu, and discover the story behind DesiZaika.',
  openGraph: {
    title: 'DesiZaika — Authentic Indian & Pakistani Cuisine',
    description:
      'Experience the rich flavors of India and Pakistan. Order online for pickup or delivery.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
