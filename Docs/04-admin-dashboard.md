# DesiZaika — Admin Dashboard Spec

## 1. Purpose
Allow the restaurant **owner** and **manager** to update menu, view/manage orders, and edit basic site content — without needing a developer.

## 2. Roles
| Role | Permissions |
|---|---|
| Owner | Full access — menu, orders, restaurant info, manager accounts |
| Manager | Menu edits, order management — no access to account/user management |

- Roles stored on the `users` table (or a separate `admin_users` table) via a `role` field: `owner` / `manager` / `customer`.
- Admin login is the same auth system as customers, but access to `/admin/*` routes is gated by role check server-side (not just hidden in UI).

## 3. Access
- Route: `/admin` (separate login screen, not linked from public nav)
- Protected: any unauthenticated or non-admin-role request to `/admin/*` redirects to login or shows "access denied"

## 4. Core Features

### 4.1 Dashboard Home
- Quick stats: today's orders count, today's revenue (sum of totals), pending orders needing action
- Recent orders list (latest 10) with status badges

### 4.2 Menu Management
- List all menu items (table view) grouped by category
- Add new item: name, description, price, category, image upload, veg/non-veg, spice level
- Edit existing item (all fields above)
- Toggle **availability** (mark "sold out" without deleting)
- Delete item
- Manage categories: add/edit/reorder/delete categories
- Image upload → stored via Supabase Storage (or similar), returns `image_url`

### 4.3 Order Management
- List all orders (filterable by status: received / confirmed / preparing / ready / completed / cancelled)
- View order detail: customer info (name, address, email, phone), items ordered, total, notes, timestamp
- Update order status (dropdown/buttons) — e.g., mark "Confirmed" after calling the customer, "Completed" once picked up/delivered
- Search/filter by date range or customer name

### 4.4 Restaurant Info Management
- Edit: address, phone number, email, opening hours (per day), WhatsApp number used for alerts
- Edit homepage content: hero tagline, about text, featured dishes selection
- Manage photo gallery (upload/remove images for About page)

### 4.5 Account Management (Owner only)
- Add/remove manager accounts
- Reset manager passwords

## 5. UX Notes for Admin Panel
- Functional and clean over flashy — owner/manager likely not tech-savvy, so prioritize clarity over animation.
- Forms should have clear validation messages (e.g., "Price must be a number").
- Confirm before destructive actions (delete item, cancel order).
- Mobile-responsive is a plus but desktop-first is acceptable here, since staff will likely manage this from a laptop/tablet at the restaurant.

## 6. Suggested Admin API Endpoints (extends `03-backend.md`)
```
GET    /api/admin/dashboard-stats
GET    /api/admin/menu-items
POST   /api/admin/menu-items
PATCH  /api/admin/menu-items/:id
DELETE /api/admin/menu-items/:id
GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id
GET    /api/admin/orders
GET    /api/admin/orders/:id
PATCH  /api/admin/orders/:id/status
GET    /api/admin/restaurant-info
PATCH  /api/admin/restaurant-info
POST   /api/admin/managers          (owner only)
DELETE /api/admin/managers/:id      (owner only)
```

## 7. Future Enhancements (not v1)
- Sales analytics/reports (weekly/monthly revenue charts)
- Inventory tracking tied to menu items
- Push notifications for new orders (instead of just email/WhatsApp)
- Multi-branch support if restaurant expands
