import Link from "next/link";
import { getProducts, getSettings } from "@/lib/db/store";
import { whatsappLink, whatsappDigits, BUSINESS } from "@/lib/constants/site";
import type { Category } from "@/types";
import "./products.css";

export const dynamic = "force-dynamic";

const CATEGORIES: (Category | "All")[] = ["All", "Apparel", "Drinkware", "Accessories", "Home & Gifts"];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const active = ((searchParams.cat as Category) || "All") as Category | "All";
  const products = getProducts().filter(
    (p) => active === "All" || p.category === active
  );
  const waDigits = whatsappDigits(getSettings());

  return (
    <>
      <header className="pr-nav">
        <Link href="/" className="pr-logo">
          AR<span>.</span>
        </Link>
        <nav className="pr-links">
          <Link href="/">Home</Link>
          <span className="pr-current">Print Menu</span>
        </nav>
        <Link href={whatsappLink(waDigits, "Hi! I want to order a custom print.")} className="pr-cta" target="_blank" rel="noopener">
          WhatsApp
        </Link>
      </header>

      <main className="pr-main">
        <div className="pr-head">
          <span className="pr-eyebrow">✛ The Print Menu</span>
          <h1>PICK YOUR CANVAS</h1>
          <p>Send your design on WhatsApp — we'll print it on anything.</p>
        </div>

        <div className="pr-filters">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={c === "All" ? "/products" : `/products?cat=${c}`}
              className={`pr-filter ${active === c ? "on" : ""}`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="pr-grid">
          {products.length === 0 && <p className="pr-empty">No products in this category.</p>}
          {products.map((p) => (
            <div className="pr-card" key={p.id}>
              <span className="pr-icon">{p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : p.icon}</span>
              <h3 className="pr-name">{p.name}</h3>
              <p className="pr-desc">{p.description}</p>
              <div className="pr-specs">
                {p.priceFrom ? <span>from ₹{p.priceFrom}</span> : null}
                {p.sizeRange ? <span>{p.sizeRange}</span> : null}
              </div>
              <a
                className="pr-order"
                href={`/order?product=${encodeURIComponent(p.slug)}`}
              >
                Order now →
              </a>
            </div>
          ))}
        </div>
      </main>

      <footer className="pr-foot">
        <p>{BUSINESS.name} · {BUSINESS.location}</p>
        <Link href="/#contact">Contact</Link>
      </footer>
    </>
  );
}