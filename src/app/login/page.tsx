"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Login failed");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">AR.</div>
        <h1 className="login-title">Admin Login</h1>
        <p className="login-sub">AR. Printing Service & Gift Gallery</p>
        {error && <div className="login-error">{error}</div>}
        <label className="login-label">
          Email
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@arprint.in"
          />
        </label>
        <label className="login-label">
          Password
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>
        <a className="login-back" href="/">← Back to site</a>
      </form>
      <style>{loginStyles}</style>
    </div>
  );
}

const loginStyles = `
  body{ margin:0; display:block !important; }
  .login-page{ min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0c0c0d; background-image:radial-gradient(rgba(242,236,221,0.07) 1px, transparent 1.3px); background-size:14px 14px; padding:24px; }
  .login-card{ width:100%; max-width:400px; background:#161615; border:1.5px solid rgba(242,236,221,0.14); border-radius:14px; padding:38px 32px; text-align:center; }
  .login-brand{ font-family:'Big Shoulders Display',sans-serif; font-weight:900; font-size:2.6rem; color:#f2ecdd; }
  .login-brand::after{ content:' Printing'; color:#e0a53c; }
  .login-title{ font-family:'Big Shoulders Display',sans-serif; font-weight:800; font-size:1.7rem; text-transform:uppercase; color:#f2ecdd; margin:6px 0 2px; }
  .login-sub{ color:#b6b0a2; font-size:0.82rem; margin:0 0 22px; }
  .login-error{ background:rgba(221,74,128,0.12); border:1px solid rgba(221,74,128,0.4); color:#dd4a80; border-radius:8px; padding:10px 12px; font-size:0.85rem; margin-bottom:16px; }
  .login-label{ display:flex; flex-direction:column; gap:6px; text-align:left; font-size:0.78rem; color:#b6b0a2; margin-bottom:14px; font-family:'IBM Plex Mono',monospace; text-transform:uppercase; letter-spacing:0.05em; }
  .login-input{ background:#0c0c0d; border:1px solid rgba(242,236,221,0.2); border-radius:8px; padding:13px 14px; color:#f2ecdd; font-size:0.95rem; outline:none; }
  .login-input:focus{ border-color:#e0a53c; }
  .login-btn{ width:100%; margin-top:8px; padding:14px; border-radius:8px; border:none; background:#e0a53c; color:#0c0c0d; font-weight:700; font-size:1rem; cursor:pointer; }
  .login-btn:hover{ background:#f2c06b; }
  .login-btn:disabled{ opacity:0.6; cursor:not-allowed; }
  .login-back{ display:inline-block; margin-top:18px; color:#b6b0a2; font-size:0.85rem; }
  .login-back:hover{ color:#e0a53c; }
`;