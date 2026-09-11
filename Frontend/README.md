# 🔥 DesiZaika — Next.js 13 Restaurant Application

This is the Next.js App Router application for **DesiZaika** (30 Crumlin Rd, Dublin, D12 HXW0).

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Server will run at [http://localhost:3000](http://localhost:3000).

## 🔑 Environment Variables (`.env`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hhushtgojjjjrcjvpqfj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=...
RESEND_API_KEY=your_resend_api_key_here
RESTAURANT_ALERT_EMAIL=Unxox11@gmail.com
```

## 📂 Key Architecture

* `app/page.tsx`: Home page featuring live featured dishes.
* `app/menu/page.tsx` & `components/menu/menu-page-client.tsx`: Live menu page with dietary filters and dish detail pop-up.
* `app/checkout/page.tsx`: Checkout page with Auth gate, Delivery/Pickup options, and Cash on Delivery (COD).
* `app/admin/page.tsx`: Live admin dashboard with KPI stats, order status management, dish CRUD, photo uploads, and category management.
* `app/api/orders/route.ts`: Orders creation API endpoint triggering live Resend email alerts.
* `lib/email/send-order-email.ts`: Automated email alert module using Resend REST API.

---

For full documentation and production setup guidelines, see the root [`README.md`](../README.md).
