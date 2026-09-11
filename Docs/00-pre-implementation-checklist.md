# DesiZaika — Pre-Implementation Checklist

## 1. Planning Files — Status
| File | Purpose | Status |
|---|---|---|
| `01-brain.md` | Full project context, single source of truth | ✅ Ready |
| `02-frontend.md` | UI/UX spec for Bolt.ai | ✅ Ready (allergen display added) |
| `03-backend.md` | Backend logic, API endpoints, order alert flow | ✅ Ready (allergen fields added) |
| `04-admin-dashboard.md` | Admin panel features & roles | ✅ Ready |
| `05-connection.md` | Frontend↔backend integration + deployment steps | ✅ Ready |
| `06-database-setup.md` | Supabase SQL, RLS policies, setup walkthrough | ✅ Ready |
| `dummy-menu.json` | Real dish names/allergens, dummy prices, for demo | ✅ Ready |

All planning docs are internally consistent (Supabase confirmed as DB/Auth/Storage across all files).

## 2. Accounts to Create Before Starting
- [ ] **Supabase** account (free tier) — https://supabase.com
- [ ] **Vercel** account (free tier) — https://vercel.com — connect to your GitHub
- [ ] **GitHub** account/repo — to hold the project code (needed for Vercel deployment)
- [ ] **Bolt.ai** account — for frontend generation
- [ ] **Resend** account (free tier) — for order alert emails — https://resend.com
- [ ] Namecheap account — **not needed yet**, only at final deployment step once design/build is approved

## 3. Information Still Needed From Client
Carried over from `01-brain.md` — confirm these before Phase 1 (real data) begins:
- [ ] Exact restaurant address, phone number, opening hours
- [ ] Logo / brand colors (or approve the proposed placeholder palette in `02-frontend.md`)
- [ ] Full real menu with confirmed prices and dish photos (image shared so far covers 8 dishes — confirm if that's the complete list or partial)
- [ ] Pickup only, or delivery too?
- [ ] Preferred alert channel: email, WhatsApp, or both?
- [ ] Restaurant's email inbox to receive order alerts
- [ ] Restaurant's WhatsApp number (if using WhatsApp alerts)
- [ ] Existing social media / Google Business listing to link, if any

*(None of these block starting the demo build — dummy data covers it. They block Phase 1 real-data swap and final launch.)*

## 4. Readiness Confirmation
Before implementation starts, confirm:
- [ ] You've read through all 6 `.md` files and they reflect what you actually want built
- [ ] You're comfortable with the tech stack: Next.js + Tailwind (frontend), Next.js API routes or Express (backend), Supabase (DB/Auth/Storage), Vercel (hosting)
- [ ] You understand the v1 order flow has **no online payment** — orders go through as email/WhatsApp alerts only
- [ ] You understand admin dashboard lives at `/admin` inside the same app — no separate deployment

---

# Implementation Steps (once you confirm you're ready)

## Step 1 — Supabase Project Setup
Follow `06-database-setup.md` fully: create project, run the SQL to create tables, enable RLS policies, create storage buckets, note down all keys.

## Step 2 — Seed Dummy Data
Insert `dummy-menu.json` contents into `menu_categories` and `menu_items` tables via Supabase SQL Editor, so there's real-shaped data to build against from day one.

## Step 3 — Generate Frontend via Bolt.ai
Hand `02-frontend.md` to Bolt.ai (optionally with the Brand Identity excerpt from `01-brain.md`). Generate the initial UI with **dummy data hardcoded** (not yet connected to Supabase) — this is the version you'll show the client for design/layout approval.

## Step 4 — Client Design Approval Checkpoint
Share the Bolt.ai-generated demo with the client. Collect feedback on layout, colors, animations, overall feel. Iterate until approved — **do this before wiring up the backend**, since design changes are cheap now and expensive later.

## Step 5 — Set Up the Project Repo Properly
Move Bolt.ai's output into a proper GitHub repo (if not already), set up local dev environment, add `.env.local` with Supabase keys from Step 1.

## Step 6 — Build Backend Logic
Following `03-backend.md`: implement API routes (menu fetch, auth, order submission with server-side price recalculation, order alert email/WhatsApp trigger).

## Step 7 — Connect Frontend to Backend
Following `05-connection.md`: replace hardcoded dummy data in the frontend with real Supabase queries, wire up auth (signup/login gate on "Place Order"), wire up cart → checkout → order submission → confirmation.

## Step 8 — Build Admin Dashboard
Following `04-admin-dashboard.md`: build `/admin` routes, role-gated access, menu CRUD, order management, restaurant info editing. Promote your first owner account per the SQL step in `06-database-setup.md`.

## Step 9 — End-to-End Testing (staging)
Test the full checklist from `05-connection.md` section 4 on a Vercel preview URL: browsing, signup/login gate, order placement, alert delivery, admin dashboard reflecting changes live.

## Step 10 — Real Data Swap (Phase 1)
Once client-provided real menu, prices, photos, and restaurant info are in hand, replace all dummy content in Supabase via the admin dashboard (a good real-world test of the dashboard itself).

## Step 11 — Buy Domain & Go Live
Buy domain on Namecheap, connect DNS to Vercel per `05-connection.md` section 3, verify SSL, run the final smoke test on the live production URL.

## Step 12 — Client Handoff
Walk the client through the admin dashboard, hand over login credentials for their owner account, and share these planning docs as reference documentation.

---

**Everything above is prepared and ready.** Say the word and we start with Step 1.
