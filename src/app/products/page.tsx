import Link from "next/link";
import { getProducts } from "@/lib/db/store";
import { whatsappLink, BUSINESS } from "@/lib/constants/site";
import type { Category } from "@/types";

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

  return (
    <>
      <style>{productsStyles}</style>

      <header className="pr-nav">
        <Link href="/" className="pr-logo">
          AR<span>.</span>
        </Link>
        <nav className="pr-links">
          <Link href="/">Home</Link>
          <span className="pr-current">Print Menu</span>
        </nav>
        <Link href={whatsappLink(BUSINESS.name ? "Hi! I want to order a custom print." : "")} className="pr-cta" target="_blank" rel="noopener">
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
              <span className="pr-icon">{p.icon}</span>
              <h3 className="pr-name">{p.name}</h3>
              <p className="pr-desc">{p.description}</p>
              <div className="pr-specs">
                {p.priceFrom ? <span>from ₹{p.priceFrom}</span> : null}
                {p.sizeRange ? <span>{p.sizeRange}</span> : null}
              </div>
              <a
                className="pr-order"
                target="_blank"
                rel="noopener"
                href={whatsappLink(`Hi! I want to order *${p.name}*. ${p.priceFrom ? `(Price ~₹${p.priceFrom}) ` : ""}Please share details.`)}
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

const productsStyles = `
  body{ margin:0; background:#0c0c0d; color:#b6b0a2; font-family:'Work Sans',sans-serif; }
  a{ text-decoration:none; color:inherit; }
  .pr-nav{ display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 24px; max-width:1180px; margin:0 auto; border-bottom:1px solid rgba(242,236,221,0.14); }
  .pr-logo{ font-family:'Big Shoulders Display',sans-serif; font-weight:800; font-size:1.7rem; color:#f2ecdd; }
  .pr-logo span{ color:#e0a53c; }
  .pr-links{ display:flex; gap:22px; align-items:center; font-size:0.92rem; }
  .pr-links a{ color:#d9d4c8; } .pr-links a:hover{ color:#e0a53c; }
  .pr-current{ color:#e0a53c; font-family:'IBM Plex Mono',monospace; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.06em; }
  .pr-cta{ background:#e0a53c; color:#0c0c0d; font-weight:700; font-size:0.85rem; padding:10px 20px; border-radius:6px; }
  .pr-main{ max-width:1180px; margin:0 auto; padding:64px 24px 40px; }
  .pr-head{ text-align:center; margin-bottom:36px; }
  .pr-eyebrow{ color:#e0a53c; font-family:'IBM Plex Mono',monospace; font-size:0.75rem; letter-spacing:0.08em; text-transform:uppercase; }
  .pr-head h1{ font-family:'Big Shoulders Display',sans-serif; font-weight:900; font-size:clamp(2rem,5vw,3.2rem); color:#f2ecdd; text-transform:uppercase; margin:12px 0 8px; letter-spacing:-0.01em; }
  .pr-head p{ max-width:520px; margin:0 auto; }
  .pr-filters{ display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-bottom:36px; }
  .pr-filter{ border:1px solid rgba(242,236,221,0.22); color:#b6b0a2; padding:10px 18px; border-radius:999px; font-size:0.85rem; transition:.2s; }
  .pr-filter:hover{ border-color:#e0a53c; color:#e0a53c; }
  .pr-filter.on{ background:#e0a53c; color:#0c0c0d; border-color:#e0a53c; font-weight:700; }
  .pr-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:20px; }
  .pr-card{ background:#161615; border:1.5px solid rgba(242,236,221,0.14); border-radius:12px; padding:24px 22px; display:flex; flex-direction:column; transition:transform .25s ease, border-color .25s ease; }
  .pr-card:hover{ transform:translateY(-5px); border-color:rgba(242,236,221,0.4); }
  .pr-icon{ font-size:2.2rem; margin-bottom:12px; }
  .pr-name{ font-size:1.05rem; font-weight:700; color:#f2ecdd; margin:0 0 4px; }
  .pr-desc{ font-size:0.9rem; margin:0 0 14px; flex:1; }
  .pr-specs{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
  .pr-specs span{ font-family:'IBM Plex Mono',monospace; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.04em; color:#e0a53c; border:1px solid rgba(224,165,60,0.4); padding:4px 8px; border-radius:4px; }
  .pr-order{ color:#25D366; font-weight:700; font-size:0.9rem; }
  .pr-order:hover{ text-decoration:underline; }
  .pr-empty{ grid-column:1/-1; text-align:center; color:#6f6a5f; }
  .pr-foot{ text-align:center; padding:28px 24px; border-top:1px solid rgba(242,236,221,0.14); color:#6f6a5f; font-size:0.85rem; display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
  .pr-foot a{ color:#e0a53c; }
`;