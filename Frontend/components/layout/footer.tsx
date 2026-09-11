import Link from 'next/link';
import { Flame, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { restaurantInfo } from '@/lib/dummy-data';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Flame className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                Desi<span className="text-primary">Zaika</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {restaurantInfo.tagline}. Bringing the flavors of the subcontinent
              to your table since 2015.
            </p>
            <div className="flex gap-3">
              <a
                href={restaurantInfo.social.facebook}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={restaurantInfo.social.instagram}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={restaurantInfo.social.twitter}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={restaurantInfo.social.youtube}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground transition-colors hover:text-primary">
                  Full Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-muted-foreground transition-colors hover:text-primary">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  {restaurantInfo.address}
                  <br />
                  {restaurantInfo.city}, {restaurantInfo.state}{' '}
                  {restaurantInfo.zip}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{restaurantInfo.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{restaurantInfo.email}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Hours
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {restaurantInfo.hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {h.day}
                  </span>
                  <span>
                    {h.closed
                      ? 'Closed'
                      : `${h.open} – ${h.close}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DesiZaika. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Delivery Info
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
