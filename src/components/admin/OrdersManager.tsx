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
              {o.design && (
                <div className="ord-design">
                  <a href={o.design} target="_blank" rel="noopener">
                    <img src={o.design} alt="design" />
                  </a>
                  <span>Design attached</span>
                </div>
              )}
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
    </>
  );
}