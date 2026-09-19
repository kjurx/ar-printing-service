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
        {settings.address || "Bagicha, Jashpur"} · {settings.phone || "+917999865547"}
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
    </>
  );
}