# 🔥 DesiZaika — Restaurant Website & Admin Operations Platform

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=for-the-badge&logo=supabase)
![Resend](https://img.shields.io/badge/Resend-Email%20Alerts-black?style=for-the-badge&logo=resend)

**DesiZaika** is a full-stack, production-ready online ordering and restaurant management web application built for **DesiZaika Dublin, Ireland** (Location: 30 Crumlin Rd, Crumlin, Dublin, D12 HXW0). 

It features an online ordering interface, interactive menu, authentication system, dish details pop-up, live admin operations dashboard, and automated email order notification system.

---

## 🌟 Key Features

### 🛒 1. Customer Experience & Online Ordering
* **Interactive Live Menu (`/menu`)**: Dynamic category filtering, dietary preference tags (Vegetarian, Vegan, Gluten-Free), and spice level indicators (Mild, Medium, Hot 🔥).
* **Dish Detail Modal**: Click any dish card to view dish photos, allergen disclosures, calories, prep time, adjust quantity (`-` `qty` `+`), and calculate total line price before adding to cart.
* **Smart Cart Drawer & Badges**: Adding items updates cart count badges seamlessly without interrupting browsing. Cart side drawer opens on-demand via top/floating cart buttons.
* **Authentication Required Checkout**: Seamless auth check on "Proceed to Checkout" — prompts users to log in if unauthenticated before filling out delivery details.
* **Flexible Order Types**: Supports **Delivery** (with street address, Dublin city/county & Eircode) and **Pickup** options.
* **Payment Methods**:
  * 💵 **Cash on Delivery (COD) / Pay on Pickup** (Active default)
  * 💳 **Credit / Debit Card via Stripe** (Coming Soon)
* **Euro Currency Integration**: Euro (`€`) pricing and standard €3.50 Dublin delivery fee.

### 🛡️ 2. Admin Operations Control Center (`/admin`)
* **Role-Based Access Control (RBAC)**: Server-side verified access restricted to `owner` and `manager` accounts.
* **Executive Metrics Dashboard (KPIs)**:
  * **Today's Revenue (€)**: Real-time calculation of daily sales.
  * **Orders Today**: Total order count breakdown.
  * **Kitchen Action Needed**: Live count of pending/active orders.
* **Live Orders Queue & Management**:
  * Real-time order listing with customer details, phone, email, and delivery/pickup badges.
  * Status updater: `received` → `confirmed` → `preparing` → `ready` → `completed` → `cancelled`.
  * Expandable itemized order list with quantities and prices.
* **Dish & Category Management**:
  * Add new dishes and edit existing items.
  * Upload high-resolution dish photos directly to **Supabase Storage** (`menu-images` bucket).
  * Toggle dish availability (`In Stock` / `Sold Out`) with instant feedback on the live customer menu.
  * Create, edit, and reorder menu categories.

### ✉️ 3. Automated Order Alert Notifications
* **Instant Resend Email Alerts**: Automatically dispatches a formatted HTML invoice email to `Unxox11@gmail.com` as soon as any customer places an order.
* Includes Order Reference ID (`#A8F921`), Customer details, Order Type, Itemized dish table, total bill in Euros, and direct link to Admin Dashboard.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 13.5 (App Router, Server Actions, Route Handlers)
* **Language**: TypeScript 5.2
* **Styling & UI**: TailwindCSS, Radix UI Primitives, Lucide Icons, Glassmorphism Aesthetics
* **Database & Storage**: Supabase PostgreSQL, Supabase Storage Buckets
* **Authentication**: Supabase Auth with custom httpOnly session cookie handler
* **Email System**: Resend REST API

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ installed
* npm package manager

### 1. Clone & Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Environment Variables (`.env`)
Create a `.env` file inside `Frontend/` with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:password@db.supabase.com:6543/postgres

# Email Alerts Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key
RESTAURANT_ALERT_EMAIL=Unxox11@gmail.com
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Custom Domain & Production Spam Resolution Guide

Currently, order alert emails are sent using Resend's free testing domain (`onboarding@resend.dev`), which Gmail places in the Spam folder during development.

When you purchase your official domain (e.g., `desizaika.ie`):

1. Log in to [Resend Dashboard](https://resend.com/domains) → Click **Add Domain**.
2. Enter your domain name (`desizaika.ie`).
3. Add the **3 DNS records** (DKIM, SPF, DMARC) provided by Resend to your domain registrar (GoDaddy, Cloudflare, Namecheap).
4. Update `from` address in `lib/email/send-order-email.ts`:
   ```ts
   from: 'DesiZaika Orders <orders@desizaika.ie>'
   ```
5. All future emails will land 100% directly in your Primary Inbox!

---

## 📞 Restaurant Contact Info

* **Restaurant Name**: DesiZaika
* **Address**: 30 Crumlin Rd, Crumlin, Dublin, Co. Dublin, D12 HXW0, Ireland
* **Phone**: (01) 538 1281
* **Email**: Unxox11@gmail.com

---

&copy; 2026 DesiZaika Restaurant. All rights reserved.
