import Link from "next/link";
import { getProducts, getSettings } from "@/lib/db/store";
import { BUSINESS, whatsappLink, whatsappDigits } from "@/lib/constants/site";
import OrderForm from "@/components/OrderForm";
import "./order.css";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  const products = getProducts();
  const waDigits = whatsappDigits(getSettings());

  return (
    <>
      <header className="of-nav">
        <a href="/" className="of-logo">
          AR<span>.</span>
        </a>
        <nav className="of-links">
          <a href="/">Home</a>
          <span className="of-current">Order</span>
        </nav>
        <a className="of-cta" target="_blank" rel="noopener" href={whatsappLink(waDigits, "Hi! I want to order a custom print.")}>
          WhatsApp
        </a>
      </header>

      <main className="of-main">
        <div className="of-head">
          <span className="of-eyebrow">✛ Custom Order</span>
          <h1>PLACE YOUR ORDER</h1>
          <p>Product chuno, details bharo — design yahin upload karo ya WhatsApp par bhejo.</p>
        </div>

        <OrderForm products={products} preselected={searchParams.product || ""} whatsapp={waDigits} />
      </main>

      <footer className="of-foot">
        <p>{BUSINESS.name} · {BUSINESS.location}</p>
        <Link href="/products">Print Menu</Link>
      </footer>
    </>
  );
}