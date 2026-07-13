# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm lint         # ESLint
npx tsc --noEmit  # Type-check without building
```

Package manager is **pnpm**. No test suite exists.

## Architecture Overview

**Next.js 16 App Router** with React 19, TypeScript, Tailwind CSS v4, deployed on Vercel. Backend is entirely Supabase (PostgreSQL + Storage + Auth).

### Supabase client pattern — critical

Two clients exist and must be used correctly:

- `createClient()` from `@/lib/supabase/server` — async, cookie-based, respects Row Level Security. Use for auth checks and public reads.
- `createServiceClient()` from `@/lib/supabase/service` — synchronous, uses service role key, **bypasses all RLS**. Required for `orders`, `order_items`, and any table without public anon policies. Use in API routes that need to write data without an authenticated user.

### Authentication

Admin area (`/admin/*`) is protected by Supabase Auth (email/password). Auth callback handled at `/src/app/auth/callback/route.ts`. The admin layout checks session and redirects to `/admin/login` if unauthenticated.

### Email

`@/lib/email/send.ts` — `sendEmail(to, subject, html)`. Resend is instantiated **inside** the function (not at module level) to prevent build failures when `RESEND_API_KEY` is absent. FROM address is currently `onboarding@resend.dev` (temporary until DNS migration — see pending tasks). Templates are in `@/lib/email/templates.ts`.

### Cart

Client-only, persisted in localStorage (`banik_cart`). `CartProvider` wraps the app in `layout.tsx` and exposes `useCart()`. `itemKey()` deduplicates by `product_id + size + color`. Cart is never stored in Supabase.

### Anti-spam (order form)

`/api/create-order` has: IP-based rate limiting (5 req/hour, in-memory Map — resets on cold start), honeypot field (`_hp`), timing check (`_t` timestamp, min 3s), server-side field length and email regex validation. The UMT booking form (`UmtForm.tsx`) has its own honeypot via named input `website`.

### Article content

Articles store body as Tiptap JSON (`content` column). `@/lib/tiptap-renderer.ts` converts it to HTML for rendering. Images are stored in Supabase Storage; `next.config.ts` whitelists `*.supabase.co` for `next/image`.

## Key env variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
ADMIN_EMAIL                    # recipient for new order notifications
```

## Pending infrastructure tasks

- **DNS migration**: domain `baniksvermov.cz` is on Wedos, hosting is Vercel. After pointing DNS to Vercel, update `FROM` in `send.ts` to `obchod@baniksvermov.cz` and add domain to Resend.
- **Status emails**: customer status-change emails currently fail (Resend 403) because `onboarding@resend.dev` can only send to the Resend account owner. Will work automatically after domain verification.

## Page / feature map

| Route | Description |
|---|---|
| `/` | Homepage — hero, quick-links, latest articles, team grid |
| `/novinky`, `/novinky/[slug]` | Articles list + detail with Tiptap content |
| `/tymy/[slug]` | Team detail (players, coaches, matches from Supabase) |
| `/eshop` | Product listing (client `EshopClient.tsx` with filter) |
| `/eshop/[slug]` | Product detail with variant picker |
| `/eshop/objednavka` | Checkout — cart items + potisk (jersey printing) options |
| `/umt` | UMT pitch rental — monthly availability calendar + booking form |
| `/admin/*` | Protected admin: articles CRUD, order management, booking list |
| `/ochrana-osobnich-udaju` | GDPR/cookie policy (Czech law) |

## Order flow

1. User fills `/eshop/objednavka` → POST `/api/create-order`
2. API verifies product prices server-side via anon client, then inserts order + items via service client
3. Two emails sent: customer confirmation + admin notification
4. Admin changes status at `/admin/objednavky` → POST `/api/admin/update-order-status` → sends status email to customer

## Potisk (jersey printing) pricing

Computed client-side in `objednavka/page.tsx`, validated implicitly server-side via `potisk_total` field:
- Club print: 60 Kč/ks
- Text on back: 60 Kč
- Name: 70 Kč
- Number 1–9: 20 Kč, 10–99: 40 Kč
