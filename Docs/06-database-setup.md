# DesiZaika — Database Setup (Supabase)

## 1. Create the Supabase Project
1. Go to https://supabase.com → Sign up / log in (free tier).
2. Click **New Project**.
3. Name: `desizaika` (or `desizaika-dev` if you want a separate dev/prod project later).
4. Set a strong database password — **save it somewhere safe**, you'll need it for direct DB connections.
5. Choose a region close to Ireland (e.g., **EU West** — London or Frankfurt) for lower latency.
6. Wait for project provisioning (~2 minutes).

## 2. Get Your Keys
Once created, go to **Project Settings → API**:
- `Project URL` → this is your `SUPABASE_URL`
- `anon public` key → this is your `SUPABASE_ANON_KEY` (safe for frontend use)
- `service_role` key → this is your `SUPABASE_SERVICE_ROLE_KEY` (**backend only — never expose in frontend code**)

Go to **Project Settings → Database** for the direct Postgres connection string (`DATABASE_URL`), if needed for any ORM/migration tooling.

## 3. Run This SQL (Supabase Dashboard → SQL Editor → New Query)

```sql
-- =========================================
-- USERS (extends Supabase Auth's built-in auth.users)
-- =========================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'manager', 'owner')),
  created_at timestamptz default now()
);

-- =========================================
-- MENU CATEGORIES
-- =========================================
create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0
);

-- =========================================
-- MENU ITEMS
-- =========================================
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_veg boolean default false,
  spice_level int default 0 check (spice_level between 0 and 3),
  is_available boolean default true,
  allergens text[] default '{}',
  allergen_notes text,
  allergen_high_risk boolean default false,
  created_at timestamptz default now()
);

-- =========================================
-- ORDERS
-- =========================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  order_type text not null check (order_type in ('pickup', 'delivery')),
  customer_name text not null,
  customer_address text,
  customer_email text not null,
  customer_phone text not null,
  notes text,
  total_price numeric(10,2) not null,
  status text not null default 'received'
    check (status in ('received','confirmed','preparing','ready','completed','cancelled')),
  created_at timestamptz default now()
);

-- =========================================
-- ORDER ITEMS
-- =========================================
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  item_name text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  line_total numeric(10,2) not null
);
```

## 4. Enable Row-Level Security (RLS)

```sql
alter table public.users enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
```

## 5. RLS Policies

```sql
-- ---------- USERS ----------
-- A user can view/update their own row
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Admins (manager/owner) can view all users
create policy "Admins can view all users"
  on public.users for select
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('manager','owner'))
  );

-- ---------- MENU CATEGORIES (public read, admin write) ----------
create policy "Anyone can view categories"
  on public.menu_categories for select
  using (true);

create policy "Admins can manage categories"
  on public.menu_categories for all
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('manager','owner'))
  );

-- ---------- MENU ITEMS (public read, admin write) ----------
create policy "Anyone can view menu items"
  on public.menu_items for select
  using (true);

create policy "Admins can manage menu items"
  on public.menu_items for all
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('manager','owner'))
  );

-- ---------- ORDERS ----------
-- Customers can create their own orders
create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Customers can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Admins can view and update all orders
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('manager','owner'))
  );

create policy "Admins can update all orders"
  on public.orders for update
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('manager','owner'))
  );

-- ---------- ORDER ITEMS ----------
-- Customers can view items belonging to their own orders
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Customers can insert order items for their own orders
create policy "Users can insert own order items"
  on public.order_items for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Admins can view all order items
create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('manager','owner'))
  );
```

## 6. Create the First Owner Account
RLS policies reference `role`, but new signups default to `role = 'customer'`. You need to manually promote your first owner account:

1. Sign up normally through your app (or Supabase Auth dashboard → Authentication → Add User).
2. In SQL Editor, run:
   ```sql
   update public.users set role = 'owner' where email = 'your-owner-email@example.com';
   ```
3. From then on, the owner can create/manage manager accounts through the admin dashboard (or you run the same SQL pattern for additional accounts during setup).

## 7. Storage Bucket (for menu/gallery images)
1. Go to **Storage** in the Supabase dashboard.
2. Create a new bucket named `menu-images` (public bucket, so images load on the public site).
3. Optional: create a second bucket `gallery-images` for the About page gallery.
4. Set upload policies to restrict uploads to authenticated admin users only (via Storage policies, similar pattern to above).

## 8. Environment Variables to Set
Add these to `.env.local` for local development, and to Vercel's Project Settings → Environment Variables for production:

```
NEXT_PUBLIC_SUPABASE_URL=<your Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon public key>
SUPABASE_SERVICE_ROLE_KEY=<your service_role key — server-side only, never NEXT_PUBLIC_>
DATABASE_URL=<direct Postgres connection string, if needed>
RESEND_API_KEY=<from Resend, once set up>
RESTAURANT_ALERT_EMAIL=<restaurant's inbox for order alerts>
RESTAURANT_WHATSAPP_NUMBER=<in international format, e.g. +353...>
```

## 9. Keep the Free Project Alive
Per our earlier discussion — free Supabase projects pause after 7 days of inactivity. Set up a free Uptime Robot monitor (https://uptimerobot.com) pinging your Supabase project URL every few minutes once it's live, so it never goes to sleep on you.

## 10. Seed Dummy Data (Demo Phase)
Once tables exist, insert the contents of `dummy-menu.json` into `menu_categories` and `menu_items` via the SQL Editor or a small seed script — this gives Bolt.ai's frontend real data to render against instead of hardcoded placeholders once you move past pure UI mockup stage.
