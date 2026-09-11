# DesiZaika — Project Brain

## 1. Project Overview
- **Client**: Owner of an Indian/Pakistani ("desi") restaurant established in Ireland.
- **Project name**: DesiZaika
- **Goal**: A fully functional restaurant website where visitors can view restaurant details, browse the menu, and place food orders online.
- **Primary business type**: Restaurant (desi cuisine — Pakistani & Indian dishes).
- **Location**: Ireland (exact address/city TBD from client).
- **Currency**: EUR (€).

## 2. Project Phases
1. **Phase 0 — Design/Demo (current phase)**: Build the full site with dummy/placeholder data (menu items, images, restaurant info) for client design & layout approval.
2. **Phase 1 — Real Data Integration**: Replace dummy data with real menu, prices, photos, and restaurant details once client approves design.
3. **Phase 2 — Auth & Ordering**: Implement user signup/login (required only for placing orders) and the order flow.
4. **Phase 3 — Admin Dashboard**: Build the panel for owner/manager to manage menu, orders, and site content.
5. **Phase 4 — Deployment**: Buy domain (Namecheap), deploy frontend + backend, connect DNS, test live.
6. **Phase 5 — Handoff**: Client training on admin dashboard, documentation handover.

## 3. Core Requirements (from client)
1. Website showing hotel/restaurant details, menu, and allowing order placement.
2. Deployed on a self-purchased domain (via Namecheap).

## 4. Derived Requirements (from our planning)
- Public browsing (menu, about, contact) requires **no auth**.
- **Auth (signup/login) required only when placing an order.**
- Order placement is a **simple flow**: cart → checkout form → order sent as an alert (email/WhatsApp) to the restaurant — **no online payment gateway in v1**.
- Alert message sent per order must contain:
  - **Customer details**: Name, Address, Email, Phone number
  - **Order details**: Items ordered, individual prices, total bill
- Admin dashboard for owner/manager to update menu, prices, availability, and view orders — without needing a developer.
- Mobile-first design — most customers will browse/order from phones.
- Top priority: **User Experience**. Animations/interactions should be used purposefully to make the site feel premium and smooth, not just decorative.

## 5. Out of Scope (v1)
- Online payments (Stripe/PayPal etc.) — planned as a v2 upgrade.
- Delivery logistics / rider tracking.
- Loyalty programs, reviews/ratings system.
- Multi-language support (unless client requests — Ireland is English-speaking, but consider Urdu/Hindi as a future nice-to-have).

## 6. Tech Stack Summary
| Layer | Choice |
|---|---|
| Frontend | Next.js (React) + Tailwind CSS — built via Bolt.ai using `02-frontend.md` |
| Backend | Node.js/Express (or Next.js API routes) — see `03-backend.md` |
| Database | PostgreSQL (via Supabase) — good fit for relational menu/order/user data |
| Auth | Supabase Auth or custom JWT-based auth (email/password, optional Google login) |
| Email alerts | Resend or Nodemailer |
| WhatsApp alerts | `wa.me` deep link or WhatsApp Business API (optional) |
| Hosting (frontend) | Vercel |
| Hosting (backend/DB) | Supabase (if using it) or Railway/Render |
| Domain | Namecheap (e.g., `desizaika.ie` or `desizaika.com`) |

## 7. Key Roles
- **Customer**: Browses menu freely; must sign up/login to place an order.
- **Admin/Manager**: Logs into `/admin`; manages menu items, categories, prices, availability, restaurant info, and views incoming orders.

## 8. File Map
| File | Purpose |
|---|---|
| `01-brain.md` | This file — full project context, single source of truth |
| `02-frontend.md` | UI/UX spec for Bolt.ai to generate the frontend |
| `03-backend.md` | Backend functionality, APIs, auth, order/alert logic |
| `04-admin-dashboard.md` | Admin panel features and permissions |
| `05-connection.md` | How frontend (Bolt.ai output) connects to backend |

## 9. Open Questions for Client
- Exact restaurant address, phone number, opening hours.
- Logo / brand colors (or should we propose a palette?).
- Real menu list with prices, categories, and photos.
- Pickup only, or delivery too? (affects checkout form fields)
- Preferred alert channel: email, WhatsApp, or both?
- Any existing social media / Google Business listing to link?
