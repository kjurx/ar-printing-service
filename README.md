# AR. Printing Service & Gift Gallery

Custom printing & gift website with a full **admin panel** for AR. Printing Service & Gift Gallery — Bagicha, Jashpur.

T-Shirts, Hoodies, Jerseys, Mugs, Bottles, Mobile Covers & more — send your design, we print it on anything.

## Features

### Public website
- Dark, modern print-shop design (gold / cyan / magenta theme)
- Hero with animated product cards + scrolling ticker
- **Print Menu** — 12 products with category filters (Apparel / Drinkware / Accessories / Home & Gifts)
- Why Us, Categories, Bulk-Order offer section, Contact cards
- WhatsApp ordering everywhere (prefilled messages)
- Floating WhatsApp button
- Fully mobile responsive

### Admin panel (`/admin`)
- Protected login (session + HMAC-signed cookie)
- **Dashboard** — order statistics + recent orders
- **Products** — add / edit / delete (CRUD)
- **Orders** — status workflow (NEW → CONFIRMED → IN_PRODUCTION → COMPLETED / CANCELLED) + WhatsApp customer link
- **Settings** — phone, WhatsApp, Instagram, address, offer texts

### Backend
- API routes for auth, products, orders, settings
- JSON-file store (`data/db.json`) — no database setup needed
- Prisma schema included for future upgrade to SQLite/PostgreSQL

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** + TypeScript
- Data store: JSON file (`src/lib/db/store.ts`)
- Auth: HMAC-signed session cookies (no external deps)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Seed fresh data (products, demo orders, admin)
npm run db:seed

# 3. Create .env.local with a secret
echo "SESSION_SECRET=$(openssl rand -hex 32)" > .env.local

# 4. Run development server
npm run dev
# open http://localhost:3000
```

### Production

```bash
npm run build
npm start
```

## Admin Login

| Field    | Value                 |
|----------|-----------------------|
| URL      | `http://localhost:3000/login` |
| Email    | `admin@arprint.in`    |
| Password | `admin123`            |

> **Important:** Change the default password before going live. It is stored (hashed) in `data/db.json` → `admins` → `passwordHash`.

## Scripts

| Command          | Description                                  |
|------------------|----------------------------------------------|
| `npm run dev`    | Start development server                     |
| `npm run build`  | Production build + type check                |
| `npm start`      | Start production server                      |
| `npm run db:seed`| Reset `data/db.json` to fresh seed data      |

## Project Structure

```
ar-printing-service/
├── public/                    # Static assets
├── reference/                 # Original design (single-page HTML)
├── docs/PLANNING.md           # Full project plan
├── data/db.json               # Live data store (git-ignored)
├── prisma/schema.prisma       # Future DB schema
├── scripts/db-seed.js         # Seed script
└── src/
    ├── app/
    │   ├── page.tsx           # Home
    │   ├── products/          # Print menu page
    │   ├── login/             # Admin login
    │   ├── admin/             # Dashboard, Products, Orders, Settings
    │   └── api/               # Auth, Products, Orders, Settings
    ├── components/
    │   ├── public/            # Public UI components (upcoming)
    │   ├── admin/             # ProductManager, OrdersManager, SettingsManager
    │   └── ui/                # Reusable UI
    ├── lib/
    │   ├── db/store.ts        # JSON file store
    │   ├── auth/session.ts    # Session auth
    │   └── constants/site.ts  # Business info & WhatsApp links
    ├── types/                 # TypeScript types
    └── data/seed.json         # Initial seed data
```

## Roadmap

- [ ] Gallery module (photos + admin upload)
- [ ] Offers/banners management
- [ ] File/design upload for orders
- [ ] Order tracking for customers
- [ ] Switch JSON store → Prisma + SQLite/PostgreSQL
- [ ] Deployment to Vercel

## License

Private project — © 2026 AR. Printing Service & Gift Gallery