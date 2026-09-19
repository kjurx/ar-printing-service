"use client";

import { useEffect, useState } from "react";

interface Settings {
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  address?: string;
  offerTitle?: string;
  offerBadge?: string;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings>({});
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving…");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setStatus(res.ok ? "Saved ✓" : "Error saving");
  }

  function field(key: string) {
    return (value: React.ChangeEvent<HTMLInputElement>) =>
      setSettings({ ...settings, [key]: value.target.value });
  }

  const fields: { key: keyof Settings; label: string; hint: string }[] = [
    { key: "phone", label: "Phone", hint: "e.g. +917999865547" },
    { key: "whatsapp", label: "WhatsApp number", hint: "e.g. 917999865547" },
    { key: "instagram", label: "Instagram handle", hint: "e.g. ar_printing_service" },
    { key: "address", label: "Address / Location", hint: "e.g. Bagicha, Jashpur" },
    { key: "offerTitle", label: "Offer title", hint: "e.g. Ordering For A Group?" },
    { key: "offerBadge", label: "Offer badge text", hint: "e.g. Special Offer" },
  ];

  return (
    <>
      <h1 className="admin-page-title">Settings</h1>
      <p className="admin-page-sub">Business info jo website par dikhta hai</p>

      <form className="set-form" onSubmit={save}>
        <div className="set-grid">
          {fields.map((f) => (
            <label key={f.key} className="pm-label">
              {f.label}
              <input
                className="pm-input"
                value={settings[f.key] || ""}
                onChange={field(f.key)}
                placeholder={f.hint}
              />
            </label>
          ))}
        </div>
        <div className="set-actions">
          <button className="pm-save" type="submit">Save Settings</button>
          {status && <span className="set-status">{status}</span>}
        </div>
      </form>
    </>
  );
}