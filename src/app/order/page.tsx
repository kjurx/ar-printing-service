import Link from "next/link";
import { getProducts } from "@/lib/db/store";
import { BUSINESS, whatsappLink } from "@/lib/constants/site";
import OrderForm from "@/components/OrderForm";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  const products = getProducts();

  return (
    <>
      <style>{orderStyles}</style>

      <header className="of-nav">
        <a href="/" className="of-logo">
          AR<span>.</span>
        </a>
        <nav className="of-links">
          <a href="/">Home</a>
          <span className="of-current">Order</span>
        </nav>
        <a className="of-cta" target="_blank" rel="noopener" href={whatsappLink("Hi! I want to order a custom print.")}>
          WhatsApp
        </a>
      </header>

      <main className="of-main">
        <div className="of-head">
          <span className="of-eyebrow">✛ Custom Order</span>
          <h1>PLACE YOUR ORDER</h1>
          <p>Product chuno, details bharo — design yahin upload karo ya WhatsApp par bhejo.</p>
        </div>

        <OrderForm products={products} preselected={searchParams.product || ""} />
      </main>

      <footer className="of-foot">
        <p>{BUSINESS.name} · {BUSINESS.location}</p>
        <Link href="/products">Print Menu</Link>
      </footer>
    </>
  );
}

const orderStyles = `
  body{ margin:0; background:#0c0c0d; color:#b6b0a2; font-family:'Work Sans',sans-serif; }
  .of-nav{ position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:16px 24px; background:rgba(12,12,13,0.9); backdrop-filter:blur(10px); border-bottom:1px solid rgba(242,236,221,0.12); }
  .of-logo{ font-family:'Big Shoulders Display',sans-serif; font-size:1.7rem; font-weight:800; color:#f2ecdd; text-decoration:none; }
  .of-logo span{ color:#e0a53c; }
  .of-links{ display:flex; gap:20px; font-size:0.9rem; }
  .of-links a{ color:#d9d4c8; text-decoration:none; }
  .of-links a:hover{ color:#e0a53c; }
  .of-current{ color:#e0a53c; }
  .of-cta{ background:#2fb6c4; color:#0c0c0d; text-decoration:none; font-weight:700; font-size:0.85rem; padding:9px 18px; border-radius:8px; }
  .of-main{ max-width:720px; margin:56px auto 80px; padding:0 20px; }
  .of-head{ margin-bottom:34px; }
  .of-eyebrow{ font-family:'IBM Plex Mono',monospace; font-size:0.72rem; letter-spacing:0.14em; text-transform:uppercase; color:#e0a53c; }
  .of-head h1{ font-family:'Big Shoulders Display',sans-serif; font-size:clamp(2.4rem,6vw,3.6rem); color:#f2ecdd; margin:10px 0 10px; text-transform:uppercase; }
  .of-head p{ margin:0; max-width:520px; }
  .of-foot{ text-align:center; padding:26px 20px; border-top:1px solid rgba(242,236,221,0.1); font-size:0.85rem; }
  .of-foot a{ color:#e0a53c; text-decoration:none; }

  .of-form{ background:#161615; border:1px solid rgba(242,236,221,0.14); border-radius:14px; padding:26px; }
  .of-row{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .of-label{ display:flex; flex-direction:column; gap:7px; font-family:'IBM Plex Mono',monospace; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.05em; color:#b6b0a2; margin-bottom:16px; }
  .of-input{ background:#0c0c0d; border:1px solid rgba(242,236,221,0.2); border-radius:8px; padding:12px 14px; color:#f2ecdd; font-size:0.95rem; font-family:'Work Sans',sans-serif; outline:none; }
  .of-input:focus{ border-color:#e0a53c; }
  textarea.of-input{ resize:vertical; }
  .of-error{ color:#dd4a80; background:rgba(221,74,128,0.1); border:1px solid rgba(221,74,128,0.4); padding:11px 14px; border-radius:8px; font-size:0.88rem; margin-bottom:16px; }
  .of-design{ display:flex; align-items:center; gap:12px; background:#0c0c0d; border:1px solid rgba(242,236,221,0.14); border-radius:10px; padding:10px 12px; margin-bottom:18px; }
  .of-design img{ width:54px; height:54px; object-fit:cover; border-radius:8px; }
  .of-design span{ font-family:'IBM Plex Mono',monospace; font-size:0.75rem; color:#2fb6c4; }
  .of-design-remove{ background:rgba(221,74,128,0.15); color:#dd4a80; border:none; padding:7px 12px; border-radius:6px; cursor:pointer; font-size:0.8rem; margin-left:auto; }
  .of-submit{ width:100%; background:#e0a53c; color:#0c0c0d; font-weight:700; font-size:1rem; border:none; padding:15px; border-radius:10px; cursor:pointer; }
  .of-submit:disabled{ opacity:0.6; cursor:not-allowed; }
  .of-note{ font-size:0.82rem; color:#8b8678; margin:14px 0 0; text-align:center; }
  .of-empty{ color:#b6b0a2; }

  .of-done{ text-align:center; background:#161615; border:1px solid rgba(242,236,221,0.14); border-radius:14px; padding:40px 28px; }
  .of-done-mark{ width:56px; height:56px; margin:0 auto 16px; border-radius:50%; background:rgba(47,182,196,0.15); color:#2fb6c4; display:flex; align-items:center; justify-content:center; font-size:1.6rem; }
  .of-done h2{ font-family:'Big Shoulders Display',sans-serif; font-size:2rem; color:#f2ecdd; margin:0 0 8px; text-transform:uppercase; }
  .of-done-id{ font-family:'IBM Plex Mono',monospace; font-size:0.9rem; }
  .of-done-id strong{ color:#e0a53c; }
  .of-done-item{ color:#d9d4c8; }
  .of-done p{ max-width:420px; margin:12px auto; }
  .of-wa{ display:inline-block; background:#2fb6c4; color:#0c0c0d; text-decoration:none; font-weight:700; padding:12px 22px; border-radius:8px; margin-top:10px; }
  @media(max-width:560px){ .of-row{ grid-template-columns:1fr; } }
`;