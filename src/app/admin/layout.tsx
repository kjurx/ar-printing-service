import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth/session";
import "./admin.css";

export const dynamic = "force-dynamic";

function AdminShell({ user, children }: { user: string; children: ReactNode }) {
  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">AR.</span>
          <span className="admin-brand-sub">Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <a href="/admin" className="admin-nav-link">Dashboard</a>
          <a href="/admin/products" className="admin-nav-link">Products</a>
          <a href="/admin/orders" className="admin-nav-link">Orders</a>
          <a href="/admin/settings" className="admin-nav-link">Settings</a>
        </nav>
        <div className="admin-side-foot">
          <a href="/" className="admin-nav-link">← View Site</a>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="admin-logout">Logout</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <span>Welcome, {user}</span>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const session = getSession();
  if (!session) {
    redirect("/login");
  }
  return <AdminShell user={session.name}>{children}</AdminShell>;
}