import { getOrders, getAllProducts, getSettings } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const orders = getOrders();
  const products = getAllProducts();
  const settings = getSettings();

  const counts = {
    total: orders.length,
    new: orders.filter((o) => o.status === "NEW").length,
    inProduction: orders.filter((o) => o.status === "IN_PRODUCTION").length,
    completed: orders.filter((o) => o.status === "COMPLETED").length,
  };

  const stats = [
    { label: "Total Orders", value: counts.total, tone: "gold" },
    { label: "New Orders", value: counts.new, tone: "magenta" },
    { label: "In Production", value: counts.inProduction, tone: "cyan" },
    { label: "Completed", value: counts.completed, tone: "ink" },
  ];

  return (
    <>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">
        {settings.address} · {settings.phone}
      </p>

      <div className="dash-stats">
        {stats.map((s) => (
          <div className={`dash-stat stat-${s.tone}`} key={s.label}>
            <span className="dash-stat-value">{s.value}</span>
            <span className="dash-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dash-panels">
        <section className="dash-panel">
          <h2 className="dash-panel-title">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="dash-empty">No orders yet.</p>
          ) : (
            <ul className="dash-order-list">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="dash-order-item">
                  <div>
                    <span className="dash-order-name">{o.customer}</span>
                    <span className="dash-order-product">{o.product} × {o.quantity}</span>
                  </div>
                  <span className={`order-badge badge-${o.status.toLowerCase()}`}>
                    {o.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <a className="dash-panel-link" href="/admin/orders">View all orders →</a>
        </section>

        <section className="dash-panel">
          <h2 className="dash-panel-title">Products</h2>
          <p className="dash-product-count">
            <strong>{products.filter((p) => p.isActive).length}</strong> active of{" "}
            {products.length} total
          </p>
          <ul className="dash-product-list">
            {products.slice(0, 6).map((p) => (
              <li key={p.id} className="dash-product-item">
                <span>{p.icon}</span>
                <span>{p.name}</span>
                <span className="dash-product-cat">{p.category}</span>
              </li>
            ))}
          </ul>
          <a className="dash-panel-link" href="/admin/products">Manage products →</a>
        </section>
      </div>

      <style>{dashStyles}</style>
    </>
  );
}

const dashStyles = `
  .dash-stats{ display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:16px; margin-bottom:28px; }
  .dash-stat{ border-radius:12px; padding:22px 18px; display:flex; flex-direction:column; gap:2px; }
  .stat-gold{ background:#e0a53c; color:#0c0c0d; } .stat-magenta{ background:#dd4a80; color:#0c0c0d; } .stat-cyan{ background:#2fb6c4; color:#0c0c0d; } .stat-ink{ background:#161615; color:#f2ecdd; border:1.5px solid #f2ecdd; }
  .dash-stat-value{ font-family:'Big Shoulders Display',sans-serif; font-weight:900; font-size:2.4rem; line-height:1; }
  .dash-stat-label{ font-family:'IBM Plex Mono',monospace; font-size:0.68rem; letter-spacing:0.06em; text-transform:uppercase; opacity:0.75; }
  .dash-panels{ display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:18px; }
  .dash-panel{ background:#161615; border:1.5px solid rgba(242,236,221,0.14); border-radius:12px; padding:22px; }
  .dash-panel-title{ font-family:'Big Shoulders Display',sans-serif; font-size:1.3rem; font-weight:800; color:#f2ecdd; text-transform:uppercase; margin:0 0 16px; }
  .dash-empty{ color:#6f6a5f; font-size:0.9rem; }
  .dash-order-list, .dash-product-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px; }
  .dash-order-item{ display:flex; justify-content:space-between; align-items:center; gap:12px; padding:10px 12px; border:1px solid rgba(242,236,221,0.1); border-radius:8px; }
  .dash-order-name{ display:block; color:#f2ecdd; font-weight:600; font-size:0.92rem; }
  .dash-order-product{ display:block; color:#b6b0a2; font-size:0.78rem; }
  .dash-product-item{ display:flex; gap:10px; align-items:center; font-size:0.9rem; padding:8px 12px; border:1px solid rgba(242,236,221,0.1); border-radius:8px; color:#f2ecdd; }
  .dash-product-cat{ margin-left:auto; color:#b6b0a2; font-size:0.72rem; font-family:'IBM Plex Mono',monospace; text-transform:uppercase; }
  .dash-panel-link{ display:inline-block; margin-top:16px; color:#e0a53c; font-size:0.88rem; font-weight:600; }
  .dash-panel-link:hover{ text-decoration:underline; }
  .dash-product-count{ color:#b6b0a2; font-size:0.95rem; margin-bottom:16px; }
  .order-badge{ font-family:'IBM Plex Mono',monospace; font-size:0.62rem; letter-spacing:0.05em; padding:4px 8px; border-radius:4px; text-transform:uppercase; }
  .badge-new{ background:rgba(221,74,128,0.15); color:#dd4a80; } .badge-confirmed{ background:rgba(224,165,60,0.15); color:#e0a53c; } .badge-in_production{ background:rgba(47,182,196,0.15); color:#2fb6c4; } .badge-completed{ background:rgba(90,210,120,0.15); color:#5ad278; } .badge-cancelled{ color:#6f6a5f; }
`;