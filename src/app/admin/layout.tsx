import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth/session";

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
      <style>{adminStyles}</style>
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

const adminStyles = `
  body{ margin:0; }
  .admin-wrap{ min-height:100vh; display:flex; background:#0c0c0d; color:#d9d4c8; font-family:'Work Sans',sans-serif; }
  .admin-sidebar{ width:230px; background:#161615; border-right:1px solid rgba(242,236,221,0.14); display:flex; flex-direction:column; padding:24px 16px; gap:24px; position:sticky; top:0; height:100vh; }
  .admin-brand{ display:flex; flex-direction:column; gap:2px; padding-bottom:18px; border-bottom:1px solid rgba(242,236,221,0.14); }
  .admin-brand-mark{ font-family:'Big Shoulders Display',sans-serif; font-weight:900; font-size:2rem; color:#f2ecdd; }
  .admin-brand-sub{ font-family:'IBM Plex Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#b6b0a2; }
  .admin-nav{ display:flex; flex-direction:column; gap:6px; }
  .admin-nav-link{ padding:11px 14px; border-radius:8px; font-size:0.92rem; color:#d9d4c8; transition:.2s; }
  .admin-nav-link:hover{ background:rgba(224,165,60,0.12); color:#e0a53c; }
  .admin-logout{ width:100%; margin-top:12px; padding:11px 14px; border-radius:8px; border:1px solid #dd4a80; background:transparent; color:#dd4a80; cursor:pointer; font-weight:700; font-size:0.92rem; }
  .admin-logout:hover{ background:#dd4a80; color:#0c0c0d; }
  .admin-side-foot{ margin-top:auto; display:flex; flex-direction:column; }
  .admin-main{ flex:1; display:flex; flex-direction:column; min-width:0; }
  .admin-topbar{ padding:16px 28px; border-bottom:1px solid rgba(242,236,221,0.14); font-size:0.9rem; color:#e0a53c; background:#161615; }
  .admin-content{ padding:28px; overflow-x:auto; }
  .admin-page-title{ font-family:'Big Shoulders Display',sans-serif; font-weight:800; font-size:2rem; text-transform:uppercase; color:#f2ecdd; margin:0 0 6px; }
  .admin-page-sub{ color:#b6b0a2; margin:0 0 24px; font-size:0.95rem; }
  @media (max-width:720px){
    .admin-wrap{ flex-direction:column; }
    .admin-sidebar{ width:100%; height:auto; position:static; flex-direction:row; flex-wrap:wrap; align-items:center; gap:12px; padding:14px; }
    .admin-brand{ border:none; padding:0; }
    .admin-nav{ flex-direction:row; flex-wrap:wrap; gap:4px; }
    .admin-side-foot{ margin-top:0; margin-left:auto; }
    .admin-nav-link{ padding:8px 10px; font-size:0.82rem; }
  }
`;