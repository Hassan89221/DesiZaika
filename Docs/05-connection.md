# DesiZaika — Frontend↔Backend Integration Brief (AI Coding Agent Handoff)

> **Instructions for the AI agent**: The Frontend project already has a complete UI (built via Bolt.ai, using hardcoded dummy data) AND a complete backend (API routes built in a previous pass — see Section 2). Your task now is to **connect them**: replace all hardcoded/dummy data in the frontend with real calls to the existing API routes, and wire up auth + order submission. Do not rebuild either side from scratch.

---

## 1. Project Context
- DesiZaika — Pakistani/Indian restaurant website, Ireland-based.
- Next.js App Router project. Frontend and backend live in the same project (`Frontend` folder = project root).
- v1 order flow: browse freely (no auth) → add to cart → must sign up/login to place order → order saved to DB. **No online payment. No alert emails yet (that's a separate deferred phase — do not touch or add email/WhatsApp logic in this task).**

## 2. What Already Exists — Do Not Rebuild
**Frontend (from Bolt.ai)**:
- Full page set: Home, About, Menu, Cart/Checkout UI, Auth modal (signup/login UI), Contact
- Currently using **hardcoded dummy data** for menu items — this is what needs to be replaced with real API calls
- Cart state management already exists client-side (check existing implementation — likely React Context or similar — reuse it, don't replace the state management approach)

**Backend (built in a previous pass)**:
- `lib/supabase/client.ts` — browser-side Supabase client
- `lib/supabase/server.ts` — server-side Supabase client (for use inside API routes)
- `app/api/menu/route.ts` — `GET`, returns `{ categories, items }`
- `app/api/auth/signup/route.ts` — `POST`, body `{ name, email, phone, password }`
- `app/api/auth/login/route.ts` — `POST`, body `{ email, password }`
- `app/api/auth/logout/route.ts` — `POST`
- `app/api/orders/route.ts` — `POST` (create order), body `{ order_type, customer_name, customer_address, customer_email, customer_phone, notes, items: [{ menu_item_id, quantity }] }`
- `app/api/orders/[id]/route.ts` — `GET`, order lookup
- `app/api/orders/my/route.ts` — `GET`, logged-in user's order history
- `app/api/admin/*` — full admin CRUD routes (menu items, categories, orders, restaurant info, managers)

**Before writing any integration code, actually inspect these existing files** to confirm their exact request/response shapes match what's described above — the agent that built them may have made small deviations, and the frontend must match what's real, not just what's documented.

## 3. Integration Tasks

### 3.1 Menu Page
- Replace hardcoded dummy menu data with a fetch to `GET /api/menu` on page load (or via server component data fetching, whichever matches the existing frontend's data-fetching pattern — check if other pages use server components or client-side fetching, and stay consistent)
- Map the returned `categories` and `items` into whatever shape the existing menu UI components expect — adjust the mapping layer, not the UI components themselves, unless a field is genuinely missing
- Confirm allergen tags and the high-risk badge (built into the UI already per the frontend spec) correctly read from the real `allergens` / `allergen_high_risk` fields returned by the API

### 3.2 Auth Wiring
- Connect the existing signup/login modal UI to `POST /api/auth/signup` and `POST /api/auth/login`
- On successful login, persist the session (the backend already sets this via Supabase's cookie-based session through `server.ts` — the frontend mainly needs to trigger a re-check of auth state, e.g., via the browser client's `getSession()` or `onAuthStateChange`)
- Add an auth-check gate: when the user clicks "Place Order" in the cart/checkout flow, check if they have a session. If not, show the auth modal first. **After successful login, return them to checkout with their cart intact** — do not clear the cart on the auth detour.

### 3.3 Checkout → Order Submission
- Wire the existing checkout form UI to `POST /api/orders`
- Build the request body from: cart items (mapped to `{ menu_item_id, quantity }`), the checkout form fields (customer name, address, email, phone, order type, notes)
- On success, show the existing order confirmation UI, populated with the real order ID and summary returned from the API
- On failure, show a clear error state (don't fail silently)

### 3.4 Admin Dashboard Wiring
- Connect admin UI (if Bolt.ai built dashboard screens — check if `/admin` routes exist in the frontend already; if not, flag this back to me rather than building new admin UI from scratch, since that wasn't part of this task)
- Wire menu management screens to the `/api/admin/menu-items` and `/api/admin/categories` routes
- Wire order management screen to `/api/admin/orders` and the status update endpoint
- Ensure the admin area is only reachable/functional for users with `role` of `manager` or `owner` — check both client-side (redirect if not admin) AND confirm the backend already enforces this server-side (it should, per the backend brief's security requirements — verify, don't just assume)

## 4. What NOT To Do
- Do not implement or touch any email/WhatsApp alert logic — deferred, separate phase
- Do not add online payment integration
- Do not change the visual design, layout, or styling of any existing component
- Do not modify the database schema or RLS policies
- Do not rebuild any API route — if a route's actual behavior doesn't match what's described in Section 2, flag the discrepancy in your summary rather than silently changing the route

## 5. Testing Instructions To Follow Before Reporting Done
1. Run `npm run dev` and manually test:
   - Menu page loads real data from Supabase (not hardcoded dummy data)
   - Attempting to place an order while logged out triggers the auth modal
   - Signup creates a new user (check `public.users` table gets a row with `role = 'customer'`)
   - Login works and session persists across page navigation
   - Completing checkout while logged in creates a row in `orders` and matching rows in `order_items` (verify in Supabase Table Editor)
   - Cart is not lost when the auth modal interrupts checkout
2. Report any step above that doesn't work rather than marking it done anyway

## 6. When You're Done
Provide:
1. List of every file modified/created, with what changed
2. Confirmation of which items in Section 5's testing checklist actually passed
3. Any discrepancies found between the documented API routes (Section 2) and their actual implementation
4. Anything left unconnected or requiring a decision from me (e.g., "no admin UI exists in the frontend yet — was this expected?")