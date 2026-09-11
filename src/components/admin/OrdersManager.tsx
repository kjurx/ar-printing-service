"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order } from "@/types";
import { ORDER_STATUSES } from "@/types";

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id: string, status: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  const visible = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <h1 className="admin-page-title">Orders</h1>
      <p className="admin-page-sub">{orders.length} total orders</p>

      <div className="ord-filters">
        <button
          className={`ord-filter ${filter === "ALL" ? "on" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            className={`ord-filter ${filter === s ? "on" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="ord-empty">No orders in this view.</p>
      ) : (
        <div className="ord-list">
          {visible.map((o) => (
            <div className="ord-card" key={o.id}>
              <div className="ord-top">
                <span className="ord-customer">{o.customer}</span>
                <select
                  className="ord-status"
                  value={o.status}
                  onChange={(e) => changeStatus(o.id, e.target.value)}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <div className="ord-meta">
                {o.product} × {o.quantity}
                {o.size ? ` · Size ${o.size}` : ""}
                {o.designNote ? ` · "${o.designNote}"` : ""}
              </div>
              <div className="ord-bottom">
                <span className="ord-date">{new Date(o.createdAt).toLocaleString()}</span>
                <a
                  className="ord-wa"
                  target="_blank"
                  rel="noopener"
                  href={`https://wa.me/${o.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                    `Hi ${o.customer}! Ye aapka order receive hua hai — ${o.product} × ${o.quantity}. Status: ${o.status}.`
                  )}`}
                >
                  WhatsApp {o.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{ordStyles}</style>
    </>
  );
}

const ordStyles = `
  .ord-filters{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; }
  .ord-filter{ background:#161615; border:1px solid rgba(242,236,221,0.2); color:#b6b0a2; padding:9px 14px; border-radius:999px; cursor:pointer; font-size:0.82rem; }
  .ord-filter.on{ background:#e0a53c; color:#0c0c0d; border-color:#e0a53c; font-weight:700; }
  .ord-empty{ color:#6f6a5f; }
  .ord-list{ display:flex; flex-direction:column; gap:14px; max-width:820px; }
  .ord-card{ background:#161615; border:1px solid rgba(242,236,221,0.14); border-radius:12px; padding:18px 20px; }
  .ord-top{ display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:8px; }
  .ord-customer{ color:#f2ecdd; font-weight:700; font-size:1.05rem; }
  .ord-status{ background:#0c0c0d; color:#f2ecdd; border:1px solid rgba(242,236,221,0.25); border-radius:6px; padding:8px 10px; }
  .ord-meta{ color:#b6b0a2; font-size:0.92rem; margin-bottom:10px; }
  .ord-bottom{ display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
  .ord-date{ font-family:'IBM Plex Mono',monospace; font-size:0.72rem; color:#6f6a5f; }
  .ord-wa{ color:#25D366; font-size:0.85rem; font-weight:600; }
  .ord-wa:hover{ text-decoration:underline; }
`;