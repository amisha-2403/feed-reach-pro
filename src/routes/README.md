# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment) |
| `files/$.tsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx` | layout route (renders children via `<Outlet />`) |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.

## GramSetu Audit and Implementation Plan

### Completed
- Supabase authentication flow and UI shells exist for login, signup, password reset, and authenticated role entry.
- Role enum and role dashboard mapping exist in `src/lib/roles.ts`.
- Auth route gating and protected role dashboard route files exist in `src/routes/_authenticated/*` and `src/routes/_authenticated/route.tsx`.
- Cart store, cart page flow, and cart UI pieces are present around static products and mock purchase flow data.
- Marketplace product cards, quick view, filters, seller cards, and product detail flow are implemented as demo static UI using `src/lib/marketplace-data.ts`.
- Database migrations define `profiles`, `user_roles`, and the `handle_new_user` trigger for profile/role creation.

### Partially Implemented
- Frontend login and registration forms are connected to Supabase auth, but the actual database-backed storefront and orders are not implemented.
- `useSession()` reads profile and role data from Supabase and populates from `user_roles` and `profiles` tables.
- `DashboardShell` and dashboard routes exist per role, but the dashboard bodies are static messaging placeholders with no live DB data.
- Cart and marketplace UI are static product-data driven in the frontend, not connected to a `products` or `orders` table.

### Missing
- Product/order tables for marketplace products and cart checkout persistence in database migrations.
- Seller inventory and order persistence flows.
- Supabase RLS-backed product listing and seller profile query API in frontend code.
- End-to-end checkout, payment, order tracking, and delivery-scheduling data flow.
- Admin-only management screens or server-side business logic.

### Recommended Next Step
- Keep the present UI and authentication foundation intact.
- Add a real Supabase database model for products, carts/orders, seller profiles, and role-aware admin workflows.
- Replace static `src/lib/marketplace-data.ts` product data with a Supabase query layer when DB tables are ready.
- Require role checks and server-side validation before exposing admin or role-scoped operations.
- Fix package dependency alignment so `@tanstack/router-utils` and related TanStack plugin files are installed from the official NPM distribution instead of a partial install state.
