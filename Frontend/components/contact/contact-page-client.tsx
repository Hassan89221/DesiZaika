'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { restaurantInfo } from '@/lib/dummy-data';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Have a question, want to book a table, or planning a catering event?
            We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 font-display text-xl font-semibold">
                Visit Us
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{restaurantInfo.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {restaurantInfo.city}, {restaurantInfo.state}{' '}
                      {restaurantInfo.zip}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{restaurantInfo.phone}</p>
                    <p className="text-sm text-muted-foreground">
                      Call for reservations &amp; takeout
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{restaurantInfo.email}</p>
                    <p className="text-sm text-muted-foreground">
                      For catering &amp; events
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 font-display text-xl font-semibold">
                Opening Hours
              </h2>
              <div className="rounded-xl border border-border bg-card p-5">
                <ul className="space-y-2.5">
                  {restaurantInfo.hours.map((h) => (
                    <li
                      key={h.day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Clock className="h-4 w-4 text-primary" />
                        {h.day}
                      </span>
                      <span className="text-muted-foreground">
                        {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Map placeholder */}
            <div>
              <h2 className="mb-4 font-display text-xl font-semibold">
                Find Us
              </h2>
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="text-center">
                    <MapPin className="mx-auto h-10 w-10 text-primary" />
                    <p className="mt-2 font-medium">{restaurantInfo.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {restaurantInfo.city}, {restaurantInfo.state}
                    </p>
                  </div>
                </div>
                {/* Decorative grid lines for map feel */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute left-1/4 top-0 h-full w-px bg-border" />
                  <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
                  <div className="absolute left-3/4 top-0 h-full w-px bg-border" />
                  <div className="absolute left-0 top-1/3 h-px w-full bg-border" />
                  <div className="absolute left-0 top-2/3 h-px w-full bg-border" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <h2 className="mb-6 font-display text-xl font-semibold">
                Send a Message
              </h2>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-14 w-14 text-success" />
                  <p className="mt-4 text-lg font-semibold">Message Sent!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Thank you for reaching out. We&apos;ll get back to you
                    within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="(01) 538 1281"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="How can we help you?"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Send className="h-4 w-4" /> Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
