# AGENTS.md

AR. Printing Service & Gift Gallery — Next.js 14 (App Router) + React 18 + TypeScript. Public shop site + admin panel for a custom print business (Bagicha, Jashpur). Plan: `docs/PLANNING.md`; reference design: `reference/AR_Printing_Service.html`.

## Commands

```bash
npm run dev        # dev server, http://localhost:3000
npm run build      # production build + type check (the reliable verification path)
npm run db:seed    # copy src/data/seed.json -> data/db.json (resets ALL data)
```

- `npm run lint` runs `next lint`, but **eslint is not a dependency** — first run hangs on an interactive install prompt. Use `npm run build` to verify instead.
- No test framework is set up.
- `npx` re-checks the npm registry and hangs in this sandbox (TLS). If you must run tsc directly, use `node node_modules/typescript/bin/tsc --noEmit` — not `npx tsc`.
- This sandbox: Node is arm64, and npm/curl hit TLS cert failures — prefix commands with `NODE_TLS_REJECT_UNAUTHORIZED=0` (e.g. for `npm ci`, `next dev`) or they hang.

## Setup for a fresh checkout

1. `npm ci` (lockfile exists)
2. `npm run db:seed`
3. `echo "SESSION_SECRET=$(openssl rand -hex 32)" > .env.local`
4. `npm run dev`

## Data layer (do not reach for Prisma)

- Live database is a JSON file: `data/db.json` (gitignored). All access goes through `src/lib/db/store.ts`. On first read it auto-copies `src/data/seed.json`, so no manual db.json creation needed.
- `prisma/schema.prisma` is a **future upgrade reference only** — not wired up, no prisma client generated. Never run prisma migrate/generate here.
- Server pages and API routes read the JSON synchronously at request time → server pages that use the store (e.g. `src/app/page.tsx`, `src/app/admin/layout.tsx`) must declare `export const dynamic = "force-dynamic"`. There is no fetch cache / revalidate config anywhere.

## Auth

- Sessions are HMAC-signed cookies from `src/lib/auth/session.ts`, guarded server-side by `getSession()`. No NextAuth.
- `SESSION_SECRET` comes from `.env.local`; in production the app **fails closed** (throws) if it's missing — there is no insecure fallback in prod. The dev fallback in `session.ts` is dev-only; don't rely on it.
- Seed admin: `admin@arprint.in` / `admin123` (see `src/data/seed.json`; hash is **scrypt** `scrypt$hash$salt` via `store.ts` `hashPassword()`/`verifyPassword()`, and legacy sha256 hashes auto-migrate on next successful login). Change before going live.
- Guard pattern: server components `if (!getSession()) redirect("/login")`; write API routes (POST/PUT/PATCH/DELETE) return 401 when `getSession()` is null. Public reads (e.g. GET `/api/products`, POST `/api/orders`) are unauthenticated on purpose.

## Uploads

- POST `/api/upload` writes to `data/uploads/` (gitignored); files are served by the dynamic route `src/app/uploads/[name]/route.ts`.
- Allowed: jpg/png/webp/gif/svg, max 5MB. When persisting an image/design path, it must start with `/uploads/` or APIs reject it (products, orders).
- Always seed→restart check: `data/db.json` regenerates from seed if deleted, so destructive edits inside it are cheap to recover.

## Conventions

- **No Tailwind, no external UI deps.** Plain CSS only: `src/app/globals.css` + per-route CSS files (`src/app/*.css`, `src/app/login/login.css`, etc.) imported by the route component/page (see `src/app/page.tsx` for the design system + theme vars `--gold`, `--cyan`, `--magenta`, etc.). Do NOT re-introduce inline `<style>` template strings — they break hydration (RAWTEXT vs HTML-entity escaping).
- Path alias: `@/*` → `./src/*` (tsconfig). `${process.cwd()}` always resolves to repo root.
- Business info is cascaded: `src/app/page.tsx` hardcodes defaults, then overrides from `db.json` settings (phone/whatsapp/instagram/address/offerTitle/offerBadge). Update both places when changing business data.

## Security baseline (do not regress)

- **`SESSION_SECRET` is fail-closed in production** (`session.ts` throws if unset); the dev fallback in `session.ts` is dev-only. Generate with `openssl rand -hex 32`.
- **Passwords are scrypt** (`scrypt$hash$salt`) in `store.ts`; legacy sha256 hashes auto-migrate on login. Never store plaintext or sha256-only.
- **Rate limits** (in-memory, in `src/lib/auth/rateLimit.ts`, single-process OK): login 10/15min, upload 20/hour per IP → returns 429.
- **Uploads** (`POST /api/upload`) are public-by-design but magic-byte verified and size capped (5MB); SVG is scanned for `<script>`/`javascript:` and served with `Content-Disposition: attachment` + `nosniff`.
- **Security headers** live in `next.config.mjs` (`headers()`): CSP, HSTS (prod), X-Frame-Options, Referrer-Policy, Permissions-Policy, nosniff. CSP `script-src` includes `'unsafe-inline'` because Next injects inline RSC bootstrap; dev adds `'unsafe-eval'` (webpack HMR) but **prod must stay eval-free** — do not strip client control without re-testing.
- If you add a new external dep, re-run `npm audit` (patched `next` >=14.2.35; `postcss` overridden to 8.5.10).

## Not built yet (placeholders only)

- Admin: gallery & offers (`.gitkeep` dirs); API: `/api/gallery`, `/api/offers`, `/api/contact`. Roadmap at the bottom of `README.md`.