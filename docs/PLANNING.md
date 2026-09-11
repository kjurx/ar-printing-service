# AR. Printing Service & Gift Gallery — Website + Admin Panel Plan

> Business: Custom Printing & Gift Gallery | Bagicha, Jashpur
> Contact: +91 7999865547 (Call/WhatsApp) | Instagram: @ar_printing_service
> Reference design: `reference/AR_Printing_Service.html` (single-page, dark theme)

---

## 1. Goal

Single-page website ko ek **pura dynamic website** mein upgrade karna jisme:
- Public marketing site (products, gallery, offers, contact)
- Customer se design/order **forms ke through orders** collect kare
- **Admin panel** se products, gallery, offers, aur orders manage ho
- WhatsApp integration banaye rakhe (existing business model)

---

## 2. Tech Stack (User choice: React/Next.js Fullstack)

| Layer        | Technology                              |
|--------------|------------------------------------------|
| Framework    | Next.js 14+ (App Router)                 |
| Frontend     | React + Tailwind CSS                     |
| Backend      | Next.js API Routes (Route Handlers)      |
| Database     | SQLite (Prisma ORM) — future: PostgreSQL |
| Auth         | NextAuth.js (admin login)                |
| File upload  | Multer / local upload → `/public/uploads`|
| Deployment   | Vercel + Neon/Postgres (or VPS + SQLite) |

---

## 3. Folder Structure (already created)

```
ar-printing-service/
├── public/
│   ├── assets/
│   │   └── images/
│   │       ├── products/     # Product photos
│   │       ├── gallery/      # Work/portfolio photos
│   │       └── hero/         # Hero images
│   └── uploads/              # Admin-uploaded files & customer designs
├── reference/
│   └── AR_Printing_Service.html   # Original design (reference only)
├── docs/
│   └── PLANNING.md           # Ye document
├── prisma/
│   └── schema.prisma         # Database schema
├── scripts/
│   └── db-seed.ts            # Seed: default products/categories
└── src/
    ├── app/
    │   ├── (public)/         # Public routes (share common layout)
    │   │   ├── page.tsx                # Home (/)
    │   │   ├── products/               # Product listing + detail
    │   │   ├── gallery/                # Work gallery
    │   │   ├── about/                  # About business
    │   │   └── contact/                # Contact + order form
    │   ├── (marketing)/      # Landing/section routes (optional split)
    │   ├── admin/            # Admin panel (protected)
    │   │   ├── layout.tsx    # Admin layout + sidebar (auth guard)
    │   │   ├── page.tsx      # Dashboard (statistics)
    │   │   ├── products/     # Product CRUD
    │   │   ├── orders/       # Order management (status updates)
    │   │   ├── gallery/      # Gallery management
    │   │   ├── offers/       # Offers/banners management
    │   │   └── settings/     # Business settings (phone, address, etc.)
    │   ├── api/              # Backend (Route Handlers)
    │   │   ├── auth/         # Admin login/register
    │   │   ├── products/     # GET/POST/PUT/DELETE
    │   │   ├── orders/       # Order CRUD + status
    │   │   ├── gallery/      # Gallery CRUD
    │   │   ├── offers/       # Offer CRUD
    │   │   ├── contact/      # Contact form → email/WhatsApp
    │   │   └── upload/       # File upload endpoint
    │   ├── layout.tsx        # Root layout
    │   └── globals.css
    ├── components/
    │   ├── public/           # Header, Hero, ServiceCard, ContactCard, Footer…
    │   ├── admin/            # Sidebar, DataTable, ProductForm, OrderCard…
    │   └── ui/               # Reusable: Button, Modal, Badge, Toast…
    ├── lib/
    │   ├── db/               # Prisma client instance
    │   ├── auth/             # NextAuth config
    │   └── constants/        # Business info, categories, WhatsApp links
    ├── types/                # TypeScript types
    └── data/                 # Static/seed data
```

---

## 4. Database Schema (Prisma)

```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String            // hashed (bcrypt)
  createdAt DateTime @default(now())
}

model Product {
  id          String    @id @default(cuid())
  name        String          // e.g. "T-Shirt Printing"
  category    String          // Apparel | Drinkware | Accessories | Home & Gifts
  description String
  icon        String          // emoji or image path
  imageUrl    String?         // product photo
  priceFrom   Int?            // "starting from ₹X"
  sizeRange   String?         // "S - XXL"
  bulkPrice   Boolean  @default(false)  // bulk pricing available?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
}

model Order {
  id          String   @id @default(cuid())
  customer    String   // name
  phone       String
  product     String   // product name (free-text + linked product)
  productId   String?  @relation(...)   // optional link
  quantity    Int      @default(1)
  size        String?
  designNote  String?
  designFile  String?  // uploaded design path
  status      String   @default("NEW")  // NEW → CONFIRMED → IN_PRODUCTION → COMPLETED / CANCELLED
  createdAt   DateTime @default(now())
}

model GalleryImage {
  id        String   @id @default(cuid())
  title     String?
  imageUrl  String
  category  String?  // Work | Offer | Client
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
}

model Offer {
  id        String   @id @default(cuid())
  title     String   // e.g. "Ordering For A Group?"
  subtitle  String?
  badge     String   // "Special Offer"
  imageUrl  String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

model Setting {
  key   String @id
  value String   // phone, whatsapp, instagram, address, email…
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  phone     String
  message   String
  status    String   @default("UNREAD")   // UNREAD → READ → ARCHIVED
  createdAt DateTime @default(now())
}
```

---

## 5. Public Pages / Sections

| Section            | Content                                                                 |
|--------------------|-------------------------------------------------------------------------|
| **Header/Nav**     | Logo "AR." + links (Print Menu, Categories, Why Us, Gallery, Contact) + WhatsApp CTA + mobile menu |
| **Hero**           | "EVERY PRINT. YOUR STYLE." + Hindi tagline "Har Print, Aapke Style Mein!" + Order/WhatsApp buttons + floating product cards |
| **Ticker**         | Scrolling: Custom Design × Fast Delivery × Made To Order × Bulk Pricing… |
| **Print Menu**     | Category tabs (All / Apparel / Drinkware / Accessories / Home & Gifts) + product cards (from DB) |
| **Why Us**         | High Quality Print · Fast Delivery · Custom Design · Best Price |
| **Categories**     | 4 color panels: Apparel, Drinkware, Accessories, Home & Gifts |
| **Offer/Banner**   | "Ordering For A Group? → Get Bulk Pricing" (from offers table, admin editable) |
| **Gallery**        | Client work photos (lightbox view) |
| **Contact**        | Call / WhatsApp / Instagram / Location cards + **Enquiry form** |
| **Order form**     | Name, phone, product, quantity, size, design note + **file upload** → creates Order |
| **Footer**         | Business name, © year, social links |
| **Floating WA**    | WhatsApp bubble (pulsing) |

---

## 6. Admin Panel (Routes under `/admin`, login protected)

### 6.1 Dashboard (`/admin`)
- Cards: Total orders, New orders, Pending orders, Completed orders
- Recent orders list (latest 8) + quick links

### 6.2 Products (`/admin/products`)
- Table: name, category, priceFrom, active toggle, sort order
- Add/Edit form (dynamic category from DB)
- Delete with confirm; image upload

### 6.3 Orders (`/admin/orders`)
- Filter by status: NEW / CONFIRMED / IN_PRODUCTION / COMPLETED / CANCELLED
- Order detail: customer info, product, size, qty, design note, **design file preview/download**
- Actions: update status, WhatsApp customer link (prefilled text)
- Delete (with confirm)

### 6.4 Gallery (`/admin/gallery`)
- Grid view with thumbnails
- Upload multiple images, set title/category/order, delete, set as cover

### 6.5 Offers (`/admin/offers`)
- List offers, active/inactive toggle
- Add/Edit: title, subtitle, badge, image, active

### 6.6 Settings (`/admin/settings`)
- Business info: phone, WhatsApp number, Instagram handle, address, email, site title
- Social links, custom "bulk pricing" WhatsApp message
- Admin credentials/change password

### 6.7 General admin behavior
- Sidebar nav layout, topbar, last-login
- Auth via NextAuth (email + password), single/multiple admins
- All mutations require auth (API routes check session)
- Toast notifications + confirm dialogs

---

## 7. API Routes

| Method/Path           | Purpose                                   | Auth |
|-----------------------|-------------------------------------------|------|
| GET/POST `/api/products`         | List / create products          | POST: admin |
| GET/PUT/DELETE `/api/products/[id]` | Read / update / delete       | PUT/DELETE: admin |
| GET/POST `/api/orders`           | List / create order (public)   | POST: public form |
| PUT/DELETE `/api/orders/[id]`    | Update status / delete         | admin |
| GET/POST `/api/gallery`          | List / add images              | POST: admin |
| DELETE `/api/gallery/[id]`       | Remove image                  | admin |
| GET/POST `/api/offers`           | List / create offers           | POST: admin |
| PUT/DELETE `/api/offers/[id]`    | Update / delete offer          | admin |
| POST `/api/auth/*`                | Admin login / logout / session | public(login) |
| POST `/api/contact`              | Contact form → store + WhatsApp/email notify | public |
| POST `/api/upload`               | File/images upload             | admin (except design upload) |

---

## 8. Key Features / Deliverables

1. **Admin-login protected panel** — products, orders, gallery, offers, settings CRUD
2. **Public print menu** — dynamic from DB, category filters
3. **Order form with design upload** — stores order record; admin gets order + WhatsApp link
4. **Contact form** — stores message + notifies admin
5. **Offer/banner management** — admin edits group-offer section live
6. **Full SEO** — meta tags, Open Graph, sitemap, robots
7. **Mobile responsive** — mobile-first (existing design is clean/dark: #0c0c0d, gold #e0a53c, cyan #2fb6c4, magenta #dd4a80)
8. **WhatsApp everywhere** — prefilled messages per context

---

## 9. Future Enhancements (Phase 2)

- Price calculator (multi-qty bulk pricing)
- Online payment / COD options
- Order tracking for customer (order ID + phone)
- Multi-image product gallery
- Hindi/English language toggle
- Google Maps location embed
- SEO blog (design tips, gift ideas)

---

## 10. Build Order (when coding starts)

1. Scaffold Next.js + Tailwind + Prisma + SQLite
2. DB schema + seed (products, settings)
3. Public site: components, pages (design from reference HTML)
4. API routes + order/contact forms
5. Auth + Admin panel CRUD
6. Uploads + gallery
7. Settings page (editable business info)
8. SEO, polish, deploy