"use client";

import { useState } from "react";
import type { Product } from "@/types";

interface Props {
  products: Product[];
  preselected?: string;
  whatsapp?: string;
}

export default function OrderForm({ products, preselected = "", whatsapp = "917999865547" }: Props) {
  const [productSlug, setProductSlug] = useState(preselected);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [size, setSize] = useState("");
  const [designNote, setDesignNote] = useState("");
  const [design, setDesign] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; product: string } | null>(null);

  const selected = products.find((p) => p.slug === productSlug);

  async function handleDesign(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setDesign(data.url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Design upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selected) {
      setError("Pehle product chuno.");
      return;
    }
    if (!customer.trim() || !/^[0-9]{10}$/.test(phone.trim())) {
      setError("Apna naam aur 10-digit mobile number likho.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customer.trim(),
          phone: phone.trim(),
          product: `${selected.name}${selected.priceFrom ? ` (from ₹${selected.priceFrom})` : ""}`,
          quantity: Number(quantity) || 1,
          size: size.trim(),
          designNote: designNote.trim(),
          design,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order submit nahi hua");
      setDone({ id: data.order.id, product: data.order.product });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order submit nahi hua");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    const waMsg = encodeURIComponent(
      `Hi! Main order kiya hai (ID: ${done.id}) — ${done.product}. Please confirm kare.`
    );
    return (
      <div className="of-done">
        <div className="of-done-mark">✓</div>
        <h2>Order received!</h2>
        <p className="of-done-id">Order ID: <strong>{done.id}</strong></p>
        <p className="of-done-item">{done.product}</p>
        <p>Hum jaldi hi WhatsApp/phone par confirm kar denge. Jaldi confirmation ke liye neeche WhatsApp bhi kar sakte ho:</p>
        <a className="of-wa" target="_blank" rel="noopener" href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${waMsg}`}>
          Send on WhatsApp →
        </a>
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="of-empty">Order form abhi aktif nahi hai — humse WhatsApp par contact karo.</p>;
  }

  return (
    <form className="of-form" onSubmit={submit}>
      {error && <div className="of-error">{error}</div>}

      <label className="of-label">Product
        <select className="of-input" value={productSlug} onChange={(e) => setProductSlug(e.target.value)} required>
          <option value="" disabled>— Product chuno —</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}{p.priceFrom ? ` (from ₹${p.priceFrom})` : ""}
            </option>
          ))}
        </select>
      </label>

      <div className="of-row">
        <label className="of-label">Tumhara naam
          <input className="of-input" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. Aapka naam" required />
        </label>
        <label className="of-label">Mobile (10 digits)
          <input className="of-input" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} placeholder="e.g. 9876543210" required />
        </label>
      </div>

      <div className="of-row">
        <label className="of-label">Quantity
          <input className="of-input" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <label className="of-label">Size (optional)
          <input className="of-input" value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. M, XL, 1L cup" />
        </label>
      </div>

      <label className="of-label">Tumhara design/note (optional)
        <textarea className="of-input" rows={2} value={designNote} onChange={(e) => setDesignNote(e.target.value)} placeholder="Design ka idea, color, photo ka detail likho…" />
      </label>

      <label className="of-label">Design file (optional — JPG/PNG, max 5MB)
        <input className="of-input" type="file" accept="image/*" onChange={handleDesign} disabled={uploading} />
      </label>
      {design && (
        <div className="of-design">
          <img src={design} alt="design preview" />
          <span>{uploading ? "Uploading…" : "Design attached ✓"}</span>
          <button type="button" className="of-design-remove" onClick={() => setDesign(null)}>Hatao</button>
        </div>
      )}

      <button type="submit" className="of-submit" disabled={submitting || uploading}>
        {submitting ? "Sending…" : "Submit Order"}
      </button>
      <p className="of-note">Order milte hi WhatsApp par confirm hoga. Payment aur delivery talks WhatsApp par.</p>
    </form>
  );
}