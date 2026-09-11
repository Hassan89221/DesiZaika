# DesiZaika — Frontend Design Spec (for Bolt.ai)

> This file is written to be handed directly to Bolt.ai to generate the frontend. It uses **dummy data** for the demo phase — real data will be swapped in after client approval.

## 1. Brand Identity
- **Name**: DesiZaika ("Zaika" = taste/flavor in Urdu/Hindi)
- **Cuisine**: Pakistani & Indian ("desi") food, based in Ireland
- **Mood**: Warm, vibrant, appetizing, a little premium — not a cheap takeaway look. Should feel authentic (desi) but polished for an Irish/Western audience.
- **Suggested color palette** (placeholder — confirm with client or refine after logo is available):
  - Primary: Deep saffron/turmeric orange `#E07A1F`
  - Secondary: Deep maroon/chili red `#8B1E2B`
  - Accent: Gold `#D4AF37`
  - Neutral background: Warm off-white `#FBF7F2`
  - Text: Charcoal `#2A2320`
- **Typography**:
  - Headings: A characterful serif or display font (e.g., "Playfair Display" or "Fraunces") to give a premium restaurant feel
  - Body: Clean sans-serif (e.g., "Inter" or "Poppins") for readability
- **Imagery style**: High-quality food photography, close-up shots, warm lighting. Use dummy/stock desi food images for the demo.

## 2. UX Priorities (top priority for this whole project)
- Fast perceived load — use skeleton loaders for menu/images, not blank screens.
- Smooth, purposeful micro-interactions — not decorative-only. Examples:
  - Menu item cards lift slightly + shadow deepens on hover
  - "Add to cart" button gives a satisfying micro-animation (e.g., item icon flies to cart icon, cart badge bumps)
  - Page transitions fade/slide smoothly between routes
  - Scroll-triggered fade/slide-in for sections on Home/About (subtle, not excessive)
  - Sticky/floating cart button on mobile so cart is always reachable
- Mobile-first: assume most users order from phones. Test all flows at 375px width first.
- Accessibility: proper contrast ratios, alt text on all images, keyboard-navigable menu/cart, focus states visible.
- Clear visual hierarchy: menu categories should be scannable in under 2 seconds.

## 3. Site Pages

### 3.1 Home
- Hero section: full-width food image/carousel, restaurant name, tagline, "Order Now" and "View Menu" CTAs
- Short intro/story blurb ("Authentic Pakistani & Indian flavors in [City], Ireland")
- Featured/popular dishes carousel (dummy data: 6 items)
- Highlights strip: Opening hours, location snippet, "Order via WhatsApp" quick link
- Testimonials section (dummy placeholder reviews for demo)
- Footer: contact info, social links, map embed placeholder

### 3.2 About
- Restaurant story, chef/owner background (placeholder text)
- Photo gallery (interior, dishes) — grid layout with lightbox on click
- Values/highlights (e.g., "Halal", "Fresh Daily", "Authentic Spices")

### 3.3 Menu
- Category tabs/filters (Starters, Mains, Bread, Rice/Biryani, Desserts, Drinks) — sticky on scroll
- Each item card: image, name, short description, price (€), veg/non-veg indicator, spice level icon, "Add to Cart" button
- **Allergen info** (legally required in Ireland/EU): small "Allergens" tag/expandable row on each card listing allergens (e.g., Milk, Mustard, Nuts). Items flagged `allergen_high_risk` (e.g., contains nuts) should get a visually distinct warning badge (e.g., red outline or icon), not just plain text — this needs to be easy to spot, not buried in a tooltip
- Search/filter bar (by category, veg/non-veg, spice level)
- Quantity stepper on each card once added to cart
- Use **dummy menu data** (~20–25 placeholder items across categories) for demo phase

### 3.4 Cart / Checkout
- Slide-out cart drawer (accessible from any page via floating icon) showing items, quantity, subtotal
- Checkout page/modal:
  - If not logged in → prompt signup/login (see Auth below) before proceeding
  - Order type: Pickup / Delivery toggle
  - Customer details form: Name, Address (required if delivery), Email, Phone
  - Order notes field (optional, e.g., "less spicy")
  - Order summary: items, prices, total
  - "Place Order" button → confirmation screen
- Confirmation screen: "Order received! We'll contact you shortly to confirm." + order summary recap

### 3.5 Auth (Signup / Login)
- Triggered only when user attempts to place an order (browsing menu/about/contact is fully public)
- Simple modal or dedicated page: Email + Password (+ optional Google login later)
- Signup fields: Name, Email, Phone, Password
- After login, return user to checkout flow automatically (don't lose their cart)

### 3.6 Contact
- Address, phone, email, opening hours table
- Embedded Google Map
- Contact form (name, email, message) — optional, sends via same email alert system

### 3.7 Admin Dashboard (separate route, e.g., `/admin`)
- Covered in detail in `04-admin-dashboard.md` — frontend should include a protected route/layout for this, styled simply/functionally (not customer-facing polish needed).

## 4. Components Checklist (for Bolt.ai to generate)
- Navbar (sticky, with cart icon + login/account icon, mobile hamburger menu)
- Footer
- Menu item card
- Category filter/tabs
- Cart drawer
- Quantity stepper
- Auth modal (login/signup toggle)
- Checkout form
- Order confirmation component
- Testimonial card
- Image gallery/lightbox
- Toast/notification component (e.g., "Item added to cart")
- Loading skeletons

## 5. Responsive Breakpoints
- Mobile: 375px – 639px (primary design target)
- Tablet: 640px – 1023px
- Desktop: 1024px+

## 6. Dummy Data Notes
- Use realistic placeholder desi dish names (e.g., Chicken Biryani, Seekh Kebab, Butter Chicken, Naan, Gulab Jamun) with stock/placeholder images and plausible EUR prices (€8–€18 range) for the demo build.
- Mark all dummy content clearly in code comments (e.g., `// DUMMY DATA — replace in Phase 1`) so it's easy to swap later.
