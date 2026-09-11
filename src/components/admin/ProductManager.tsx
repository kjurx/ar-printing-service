"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product, Category } from "@/types";

const CATEGORIES: Category[] = ["Apparel", "Drinkware", "Accessories", "Home & Gifts"];

const EMPTY_FORM = {
  name: "",
  category: "Apparel" as Category,
  description: "",
  icon: "🎁",
  priceFrom: "",
  sizeRange: "",
  sortOrder: "0",
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      priceFrom: form.priceFrom ? Number(form.priceFrom) : null,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: true,
    };
    const res = editing
      ? await fetch(`/api/products/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    setCreating(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  function startEdit(p: Product) {
    setEditing(p);
    setCreating(true);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      icon: p.icon,
      priceFrom: p.priceFrom ? String(p.priceFrom) : "",
      sizeRange: p.sizeRange || "",
      sortOrder: String(p.sortOrder),
    });
  }

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <div className="pm-head">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">{products.length} items in the print menu</p>
        </div>
        <button
          className="pm-add-btn"
          onClick={() => {
            setEditing(null);
            setForm(EMPTY_FORM);
            setCreating(true);
          }}
        >
          + Add Product
        </button>
      </div>

      {creating && (
        <form className="pm-form" onSubmit={submit}>
          <h2 className="pm-form-title">
            {editing ? "Edit Product" : "New Product"}
          </h2>
          {error && <div className="pm-error">{error}</div>}
          <div className="pm-grid">
            <label className="pm-label">Name
              <input className="pm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="pm-label">Category
              <select className="pm-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="pm-label">Icon (emoji)
              <input className="pm-input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </label>
            <label className="pm-label">Price from (₹)
              <input className="pm-input" type="number" min="0" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} />
            </label>
            <label className="pm-label">Size range
              <input className="pm-input" value={form.sizeRange} onChange={(e) => setForm({ ...form, sizeRange: e.target.value })} />
            </label>
            <label className="pm-label">Sort order
              <input className="pm-input" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </label>
          </div>
          <label className="pm-label">Description
            <textarea className="pm-input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="pm-form-actions">
            <button type="submit" className="pm-save">Save</button>
            <button type="button" className="pm-cancel" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="pm-table-wrap">
        <table className="pm-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Size</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><span className="pm-icon">{p.icon}</span></td>
                <td className="pm-name">{p.name}</td>
                <td><span className="pm-cat">{p.category}</span></td>
                <td>{p.priceFrom ? `₹${p.priceFrom}` : "—"}</td>
                <td>{p.sizeRange || "—"}</td>
                <td>{p.sortOrder}</td>
                <td className="pm-actions">
                  <button className="pm-edit" onClick={() => startEdit(p)}>Edit</button>
                  <button className="pm-del" onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{pmStyles}</style>
    </>
  );
}

const pmStyles = `
  .pm-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:22px; flex-wrap:wrap; }
  .pm-add-btn{ background:#e0a53c; border:none; color:#0c0c0d; font-weight:700; padding:12px 20px; border-radius:8px; cursor:pointer; font-size:0.92rem; }
  .pm-form{ background:#161615; border:1px solid rgba(242,236,221,0.14); border-radius:12px; padding:24px; margin-bottom:24px; }
  .pm-form-title{ font-family:'Big Shoulders Display',sans-serif; font-size:1.3rem; color:#f2ecdd; text-transform:uppercase; margin:0 0 14px; }
  .pm-error{ color:#dd4a80; background:rgba(221,74,128,0.1); border:1px solid rgba(221,74,128,0.4); padding:10px 12px; border-radius:8px; font-size:0.85rem; margin-bottom:14px; }
  .pm-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px; margin-bottom:14px; }
  .pm-label{ display:flex; flex-direction:column; gap:6px; font-family:'IBM Plex Mono',monospace; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.05em; color:#b6b0a2; margin-bottom:12px; }
  .pm-input{ background:#0c0c0d; border:1px solid rgba(242,236,221,0.2); border-radius:8px; padding:11px 12px; color:#f2ecdd; font-size:0.92rem; outline:none; }
  .pm-input:focus{ border-color:#e0a53c; }
  .pm-form-actions{ display:flex; gap:10px; }
  .pm-save{ background:#e0a53c; color:#0c0c0d; font-weight:700; border:none; padding:11px 22px; border-radius:8px; cursor:pointer; }
  .pm-cancel{ background:transparent; color:#b6b0a2; border:1px solid rgba(242,236,221,0.25); padding:11px 22px; border-radius:8px; cursor:pointer; }
  .pm-table-wrap{ overflow-x:auto; border:1px solid rgba(242,236,221,0.14); border-radius:12px; background:#161615; }
  .pm-table{ width:100%; border-collapse:collapse; min-width:640px; }
  .pm-table th{ text-align:left; font-family:'IBM Plex Mono',monospace; font-size:0.66rem; letter-spacing:0.06em; text-transform:uppercase; color:#b6b0a2; padding:14px 16px; border-bottom:1px solid rgba(242,236,221,0.14); }
  .pm-table td{ padding:14px 16px; border-bottom:1px solid rgba(242,236,221,0.08); color:#d9d4c8; font-size:0.92rem; }
  .pm-icon{ font-size:1.3rem; }
  .pm-name{ color:#f2ecdd; font-weight:600; }
  .pm-cat{ font-family:'IBM Plex Mono',monospace; font-size:0.68rem; text-transform:uppercase; color:#e0a53c; }
  .pm-actions{ display:flex; gap:8px; }
  .pm-edit{ background:rgba(224,165,60,0.15); color:#e0a53c; border:none; padding:7px 12px; border-radius:6px; cursor:pointer; font-size:0.8rem; }
  .pm-del{ background:rgba(221,74,128,0.15); color:#dd4a80; border:none; padding:7px 12px; border-radius:6px; cursor:pointer; font-size:0.8rem; }
`;