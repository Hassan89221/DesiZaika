'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/components/cart/cart-context';
import { useAuth } from '@/components/auth/auth-context';
import { restaurantInfo } from '@/lib/dummy-data';
import {
  ShoppingBag,
  Truck,
  Store,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  Banknote,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

type OrderType = 'pickup' | 'delivery';
type PaymentMethod = 'cod' | 'card';

export function CheckoutPageClient() {
  const { items, totalItems, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();

  const [step, setStep] = useState<'details' | 'confirmation'>('details');
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; total_price: number } | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dublin',
    zip: 'D12 HXW0',
    notes: '',
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const finalTotal = orderType === 'delivery' ? subtotal + deliveryFee : subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to place an order.');
      openAuthModal();
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        order_type: orderType,
        payment_method: paymentMethod,
        customer_name: form.name || user.name,
        customer_address: orderType === 'delivery' ? `${form.address}, ${form.city} ${form.zip}`.trim() : null,
        customer_email: form.email || user.email,
        customer_phone: form.phone || user.phone || 'N/A',
        notes: form.notes || null,
        items: items.map((ci) => ({
          menu_item_id: ci.item.id,
          quantity: ci.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to place order');
        setSubmitting(false);
        return;
      }

      setConfirmedOrder({
        id: data.order.id,
        total_price: data.order.total_price,
      });

      clearCart();
      setStep('confirmation');
      toast.success('Order placed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while placing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  // Empty cart state
  if (totalItems === 0 && step === 'details') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-muted p-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">
          Your cart is empty
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add some delicious dishes before checking out.
        </p>
        <Button asChild className="mt-6">
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  // Confirmation screen
  if (step === 'confirmation' && confirmedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">
          Order Received!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your order. We&apos;ve sent a confirmation email to{' '}
          <strong className="text-foreground">{form.email || user?.email}</strong>.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm text-muted-foreground">Order Reference</span>
            <span className="font-mono font-bold">#{confirmedOrder.id.substring(0, 8).toUpperCase()}</span>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order Type</span>
            <span className="flex items-center gap-1.5 font-medium capitalize">
              {orderType === 'delivery' ? (
                <>
                  <Truck className="h-4 w-4 text-primary" /> Delivery
                </>
              ) : (
                <>
                  <Store className="h-4 w-4 text-primary" /> Pickup
                </>
              )}
            </span>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Payment Method</span>
            <span className="font-medium flex items-center gap-1">
              <Banknote className="h-4 w-4 text-primary" /> Cash on {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
            </span>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Estimated Time
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="h-4 w-4 text-primary" />
              {orderType === 'delivery'
                ? restaurantInfo.estimatedDeliveryTime
                : '15–20 min'}
            </span>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Total Bill</span>
            <span className="font-bold text-primary">
              €{Number(confirmedOrder.total_price).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/menu">Order Again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Checkout form
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/menu"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Menu
      </Link>

      <h1 className="mb-8 font-display text-3xl font-bold sm:text-4xl">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Form side */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order type */}
            <ScrollReveal direction="up">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-display text-lg font-semibold">
                  Order Type
                </h2>
                <RadioGroup
                  value={orderType}
                  onValueChange={(v) => setOrderType(v as OrderType)}
                  className="grid grid-cols-2 gap-3"
                >
                  <label
                    htmlFor="delivery"
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                      orderType === 'delivery'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    )}
                  >
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Delivery</p>
                      <p className="text-xs text-muted-foreground">30–45 min</p>
                    </div>
                  </label>

                  <label
                    htmlFor="pickup"
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                      orderType === 'pickup'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    )}
                  >
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Store className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Pickup</p>
                      <p className="text-xs text-muted-foreground">15–20 min</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </ScrollReveal>

            {/* Contact details */}
            <ScrollReveal direction="up" delay={100}>
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Delivery details */}
            {orderType === 'delivery' && (
              <ScrollReveal direction="up" delay={150}>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <h2 className="font-display text-lg font-semibold">
                    Delivery Address
                  </h2>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="e.g. 30 Crumlin Rd, Apt 4"
                      required={orderType === 'delivery'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City / County</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Dublin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">Eircode / Postal Code</Label>
                      <Input
                        id="zip"
                        value={form.zip}
                        onChange={(e) => setForm({ ...form, zip: e.target.value })}
                        placeholder="D12 HXW0"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Payment Method Section */}
            <ScrollReveal direction="up" delay={180}>
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-display text-lg font-semibold">
                  Payment Method
                </h2>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="space-y-3"
                >
                  <label
                    htmlFor="cod"
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors',
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Banknote className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">
                          {orderType === 'delivery' ? 'Cash on Delivery (COD)' : 'Pay on Pickup'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Pay with cash or card when your order arrives
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  </label>

                  <label
                    htmlFor="card"
                    className="flex cursor-not-allowed items-center justify-between rounded-lg border border-border bg-muted/40 p-4 opacity-70"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="card" id="card" disabled />
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">Credit / Debit Card</p>
                        <p className="text-xs text-muted-foreground">Online payment via Stripe</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Coming Soon
                    </span>
                  </label>
                </RadioGroup>
              </div>
            </ScrollReveal>

            {/* Special notes */}
            <ScrollReveal direction="up" delay={200}>
              <div className="rounded-xl border border-border bg-card p-6">
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Allergies, delivery instructions, mild spice preference, etc."
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </ScrollReveal>

            <Button type="submit" size="lg" className="w-full text-base font-semibold" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Placing Order...
                </>
              ) : !user ? (
                'Log In & Place Order'
              ) : (
                `Place Order — €${finalTotal.toFixed(2)}`
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary side */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">
              Order Summary ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h2>

            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {items.map((ci) => (
                <div key={ci.item.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1 pr-2">
                    <span className="font-medium">{ci.item.name}</span>
                    <span className="text-muted-foreground"> × {ci.quantity}</span>
                  </div>
                  <span className="font-medium">€{(ci.item.price * ci.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>€{deliveryFee.toFixed(2)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-primary">€{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
