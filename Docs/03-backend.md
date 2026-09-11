# DesiZaika — Backend Implementation Brief (AI Coding Agent Handoff)

> **Instructions for the AI agent**: This is a Next.js (App Router) project. Frontend was generated separately via Bolt.ai and already exists. Your job is to implement the backend logic described below **inside the existing project**, following the conventions and files that already exist — do not recreate them differently. Read the "Already Built" section first before writing any code.

---

## 1. Project Context
- **Project**: DesiZaika — a Pakistani/Indian ("desi") restaurant website based in Ireland.
- **Stack**: Next.js (App Router) + Tailwind CSS (frontend, already built) + Next.js API routes (backend, partially built) + Supabase (Postgres + Auth + Storage).
- **Order flow**: Simple v1 — no online payment. Customer builds cart → must sign up/login to place order → order saved to DB. **Alert email/WhatsApp integration is deferred to a later phase — not part of this implementation pass** (see section 5.4).

## 2. Already Built — Do Not Recreate, Build On Top Of
| Item | Location | Notes |
|---|---|---|
| Supabase project | Cloud (see env vars) | 5 tables created: `users`, `menu_categories`, `menu_items`, `orders`, `order_items`. RLS enabled with policies already applied (see section 6 for exact policy logic already in place). |
| Storage buckets | Supabase Storage | `menu-images` and `gallery-images`, both public buckets, already created. |
| First owner account | `public.users` table | One row exists with `role = 'owner'`, linked to a Supabase Auth user. |
| Dummy data | `menu_categories`, `menu_items` tables | 3 categories, 8 real dishes (with real allergen data, dummy prices) already seeded. Do not re-seed or duplicate. |
| `lib/supabase/client.ts` | Frontend project root | Browser-side Supabase client, using `createBrowserClient` from `@supabase/ssr`. Already working. |
| `lib/supabase/server.ts` | Frontend project root | Server-side Supabase client, using `createServerClient` from `@supabase/ssr` with Next.js `cookies()`. Already working. |
| `app/api/menu/route.ts` | Frontend project | `GET` endpoint returning `{ categories, items }` from Supabase. Already working and tested locally. **Use this file's pattern (imports, client instantiation, error handling style) as the template for every other route you write.** |
| `.env.local` | Frontend project root | Already contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`. **Reuse these exact variable names** — do not introduce differently-named duplicates. |
| Packages installed | `package.json` | `@supabase/supabase-js`, `@supabase/ssr`, `resend` already installed. Add new packages only if strictly necessary, and explain why. |

## 3. Database Schema (already live — reference only, do not re-run DDL)

```sql
-- users (extends auth.users)
id uuid PK (references auth.users)
name text
email text unique
phone text
role text default 'customer' check (role in ('customer','manager','owner'))
created_at timestamptz

-- menu_categories
id uuid PK
name text
sort_order int

-- menu_items
id uuid PK
category_id uuid FK -> menu_categories
name text
description text
price numeric(10,2)
image_url text
is_veg boolean
spice_level int (0-3)
is_available boolean
allergens text[]
allergen_notes text
allergen_high_risk boolean
created_at timestamptz

-- orders
id uuid PK
user_id uuid FK -> users
order_type text check (in 'pickup','delivery')
customer_name text
customer_address text
customer_email text
customer_phone text
notes text
total_price numeric(10,2)
status text default 'received' check (in 'received','confirmed','preparing','ready','completed','cancelled')
created_at timestamptz

-- order_items
id uuid PK
order_id uuid FK -> orders
menu_item_id uuid FK -> menu_items
item_name text        -- snapshot, not a live join, in case menu changes later
quantity int
unit_price numeric(10,2)  -- snapshot
line_total numeric(10,2)
```

## 4. RLS Policies Already Active (build API logic assuming these are enforced)
- `menu_categories`, `menu_items`: public **read**, admin-only (`role in ('manager','owner')`) write.
- `users`: users can read/update their own row; admins can read all.
- `orders`, `order_items`: users can insert/read their **own** (`user_id = auth.uid()`); admins can read/update all.

**Implication for your code**: when inserting orders, you must use a Supabase client that carries the logged-in user's session (not the service role key) so `auth.uid()` resolves correctly and RLS allows the insert. Use the service role key only for admin operations that legitimately need to bypass RLS (e.g., admin dashboard reading all orders) — and even then, prefer checking `role` explicitly in your route logic rather than relying solely on bypass.

## 5. What's Left To Build

### 5.1 Auth Routes
- `POST /api/auth/signup` — body: `{ name, email, phone, password }`
  - Use Supabase Auth `signUp()`, then insert a matching row into `public.users` (name, email, phone, role defaults to `'customer'`)
- `POST /api/auth/login` — body: `{ email, password }` — use Supabase Auth `signInWithPassword()`, ensure session cookie is set via the server client
- `POST /api/auth/logout` — clears session

### 5.2 Order Routes (auth required)
- `POST /api/orders`
  - Body: `{ order_type, customer_name, customer_address, customer_email, customer_phone, notes, items: [{ menu_item_id, quantity }] }`
  - **Must run server-side, using the authenticated user's session** (so RLS allows the insert with correct `user_id`)
  - **Recalculate all prices server-side** from the `menu_items` table — never trust any price sent from the client
  - Insert into `orders`, then insert matching rows into `order_items` (snapshotting `item_name` and `unit_price` at time of order)
  - After successful insert, trigger the alert email (see 5.4 below)
  - Return the created order (including generated `id`) to the frontend
- `GET /api/orders/:id` — order status lookup, must belong to the requesting user (or be an admin)
- `GET /api/orders/my` — logged-in user's own order history

### 5.3 Admin Routes (role-gated: `manager` or `owner` only — check `role` server-side on every request, not just in UI)
```
GET    /api/admin/dashboard-stats     -- today's order count + revenue, pending order count
GET    /api/admin/menu-items
POST   /api/admin/menu-items
PATCH  /api/admin/menu-items/:id
DELETE /api/admin/menu-items/:id
GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id
GET    /api/admin/orders              -- all orders, filterable by status query param
GET    /api/admin/orders/:id
PATCH  /api/admin/orders/:id/status
GET    /api/admin/restaurant-info
PATCH  /api/admin/restaurant-info
POST   /api/admin/managers            -- owner role only, not manager
DELETE /api/admin/managers/:id        -- owner role only, not manager
```
For image uploads (menu items, gallery), use Supabase Storage's upload API targeting the existing `menu-images` / `gallery-images` buckets — return the public URL to store in `image_url`.

### 5.4 Order Alert Logic — **DEFERRED, DO NOT IMPLEMENT YET**
> Order alerts (email/WhatsApp) are intentionally out of scope for this implementation pass. Build `POST /api/orders` to fully save the order and order_items to the database and return success — but **do not** integrate Resend, do not send any email, and do not build the WhatsApp link yet. Leave a clear code comment at the point where alert-sending will eventually go, e.g.:
> ```typescript
> // TODO: Phase 2 — send order alert email via Resend once order is saved.
> // See 07-backend-implementation-brief.md section 5.4 for the full spec when ready.
> ```
> This lets the core auth → cart → order flow be built, tested, and confirmed working first. Alert integration (Resend + Gmail recipient `iceblue89221@gmail.com` for testing) will be implemented as a separate follow-up task once the base flow is verified.
>
> **Reference spec for later** (do not build now, just for context):
> - Alert recipient env var: `RESTAURANT_ALERT_EMAIL`
> - Message structure: customer details (name, address if delivery, email, phone) + itemized order + total
> - Sender: Resend
> - WhatsApp: customer-facing `wa.me` link on confirmation screen, not server-side auto-send

## 6. Security Requirements (non-negotiable)
- Validate/sanitize all inputs on every route.
- Recalculate order totals server-side — never trust client-submitted prices.
- Every `/api/admin/*` route must verify the requesting user's `role` server-side before performing any action — do not rely on the frontend hiding admin UI as the only protection.
- Rate-limit `POST /api/orders` to prevent spam (simple in-memory or Supabase-based rate limiting is sufficient for v1 — no need for a dedicated rate-limiting service).
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to any client-side code or API response.

## 7. Conventions To Follow
- Match the existing `app/api/menu/route.ts` file's style: use `NextResponse.json()` for responses, return `{ error: message }` with appropriate status codes on failure.
- Use TypeScript throughout, matching whatever the existing frontend files use for type conventions.
- Keep each route focused — one file per resource/action, following the folder structure implied by the endpoint paths above (e.g., `app/api/orders/route.ts`, `app/api/orders/[id]/route.ts`, `app/api/admin/menu-items/route.ts`).

## 8. Environment Variables — Add If Missing
The following are already in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`.

You will need to add (ask the user for real values, use clearly-marked placeholders if unavailable):
```
RESEND_API_KEY=
RESTAURANT_ALERT_EMAIL=
RESTAURANT_WHATSAPP_NUMBER=
```

## 9. When You're Done
Provide a summary of every new file created/modified, and flag anything that needs a real value from the user before it'll work in production (e.g., Resend API key, restaurant's real email/WhatsApp number).