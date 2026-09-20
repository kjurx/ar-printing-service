"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product, Category } from "@/types";
import { isDeleteableUpload } from "@/lib/media";

const CATEGORIES: Category[] = ["Apparel", "Drinkware", "Accessories", "Home & Gifts"];

const EMPTY_FORM = {
  name: "",
  category: "Apparel" as Category,
  description: "",
  icon: "🎁",
  image: "" as string | null,
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
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function deleteStoredImage(url: string | null | undefined) {
    if (!url || !isDeleteableUpload(url)) return;
    try {
      await fetch("/api/uploads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch {
      // best-effort; the reference is cleared no matter what
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      image: form.image || null,
      priceFrom: form.priceFrom ? Number(form.priceFrom) : null,
      sortOrder: Number(form.sortOrder) || 0,
      ...(editing ? {} : { isActive: true }),
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
    if (editing && editing.image !== payload.image) {
      deleteStoredImage(editing.image);
    }
    setCreating(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    load();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      setForm((f) => ({ ...f, image: data.url as string }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this product?")) return;
    const product = products.find((p) => p.id === id);
    if (product) await deleteStoredImage(product.image);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  async function toggleActive(p: Product) {
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
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
      image: p.image || "",
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
            <label className="pm-label">Image (chune to icon ki jagah dikhega)
              <input className="pm-input" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
            </label>
            {form.image && (
              <div className="pm-preview">
                <img src={form.image} alt="preview" />
                <span>{uploading ? "Uploading…" : "Uploaded"}</span>
                <button type="button" className="pm-img-remove" onClick={() => setForm({ ...form, image: null })}>Remove image</button>
              </div>
            )}
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
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.image ? <img className="pm-thumb" src={p.image} alt={p.name} /> : <span className="pm-icon">{p.icon}</span>}</td>
                <td className="pm-name">{p.name}</td>
                <td><span className="pm-cat">{p.category}</span></td>
                <td>{p.priceFrom ? `₹${p.priceFrom}` : "—"}</td>
                <td>{p.sizeRange || "—"}</td>
                <td>{p.sortOrder}</td>
                <td>
                  <button
                    className={`pm-state ${p.isActive ? "on" : ""}`}
                    onClick={() => toggleActive(p)}
                    title={p.isActive ? "Active — click to hide" : "Hidden — click to activate"}
                  >
                    {p.isActive ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="pm-actions">
                  <button className="pm-edit" onClick={() => startEdit(p)}>Edit</button>
                  <button className="pm-del" onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}