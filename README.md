# PreSou Dream Events — Balloon & Event Decoration Ecommerce Web App

A production-ready decoration ecommerce web app built with **Next.js 14 (App Router)**,
**TypeScript**, and **Tailwind CSS**. Shop balloon arches, room decorations, romantic setups,
and event packages; check city/date/time availability; customize; add to cart; and book —
end to end.

## Installation

Requires Node.js 18.18+ (Node 20 recommended) and npm.

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit http://localhost:3000

## Production build

```bash
npm run build
npm run start
```

The app was verified with `npm run build` — all 69 routes (static + dynamic product/category
pages) compile and prerender successfully.

## Project structure

```
app/                      Next.js App Router routes
  page.tsx                 Homepage
  shop/                    Shop all + /shop/[category]
  product/[slug]/          Product detail page
  search/                  Search results
  offers/                  Deals & offers
  cart/                    Full cart page
  checkout/                Checkout + /checkout/confirmation
  account/                 Account overview + /account/orders (booking tracking)
  wishlist/                Wishlist page
  plan-my-celebration/     Guided shopping wizard
  custom-decoration/       Custom decoration request form
  corporate/               Corporate & bulk booking
  locations/               Cities we serve
  inspiration/             Idea gallery
  about/, contact/, faq/   Supporting pages

components/
  header/                  Header, mega menu, search, location selector, cart drawer, mobile menu
  product/                 ProductCard, ProductRail, ProductDetailClient
  shop/                    FilterPanel, FilterDrawer, SortDropdown, ShopExperience
  home/                    PromoBanner, OccasionNav
  WhatsAppCTA.tsx          Same-day WhatsApp inquiry button/banner
  Footer.tsx

context/                  CartContext, WishlistContext, LocationContext (localStorage-backed)

lib/
  data/                    categories.ts, products.ts (mock catalog, 36 realistic products)
  types.ts                 Shared TypeScript types
  filtering.ts             Filter & sort logic used by ShopExperience
  orders.ts                Mock order/booking storage + status derivation for tracking
  checkoutSchema.ts        Zod schema for the checkout form
  utils.ts                 formatPrice, discountPercent, whatsappLink, cn
  useRecentlyViewed.ts     Recently-viewed product tracking hook
```

## Libraries used

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **framer-motion** — dropdowns, drawers, page transitions, micro-interactions
- **lucide-react** — icon set
- **react-hook-form** + **zod** + **@hookform/resolvers** — checkout, custom decoration,
  and corporate forms with validation
- **sonner** — toast notifications (add to cart, wishlist, coupon feedback)
- **clsx** + **tailwind-merge** — the `cn()` class-merging helper
- **embla-carousel-react** — installed and available for any additional carousel needs
  (the product rails currently use a native scroll-snap row for performance)

## Mock data

All product, category, and city data lives in `lib/data/products.ts` and
`lib/data/categories.ts`. It's structured mock data (no external API), including:

- 36 products across every requested occasion/category, each with images, pricing,
  ratings/reviews, per-city availability, customization options, add-ons, FAQs, and
  what's-included lists.
- Cart, wishlist, and booking history persist to the browser via `localStorage` (see
  `context/CartContext.tsx`, `context/WishlistContext.tsx`, and `lib/orders.ts`) — there is
  no real backend, so data is per-browser only. Swap these localStorage calls for real API
  calls to connect a production backend.

## Same-day WhatsApp inquiry

`components/WhatsAppCTA.tsx` builds a `wa.me` deep link with a pre-filled message containing
the decoration name, city, venue, requested date/time, and selected customization, so a
customer can ask about same-day setup in one tap. It appears:

- As a floating button on the homepage and every product page
- As a banner on the homepage
- As a button inside the product booking panel

To change the destination number, edit the default `phone` argument in `lib/utils.ts`
(`whatsappLink`).

## Notes on fonts

The design uses **Fraunces** (display), **Inter** (body), and **IBM Plex Mono** (prices/data)
loaded via a Google Fonts `@import` in `app/globals.css`, with full system-font fallback
stacks configured in `tailwind.config.ts` so the app still looks intentional if the network
is unavailable at runtime.

## What's not wired to a real backend

This is a complete frontend implementation with realistic mock data. Payment, SMS/email
confirmation, and account authentication are represented with production-quality UI but are
not connected to real payment gateways, messaging providers, or an auth service — swap in
your provider of choice behind the same UI.
# PreSouDreamEvents
