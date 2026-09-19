import type { NextRequest } from "next/server";

type Entry = { times: number[]; windowMs: number };

const store = new Map<string, Entry>();
let sinceSweep = 0;

function sweep(now: number) {
  for (const [key, entry] of store) {
    const times = entry.times.filter((t) => now - t < entry.windowMs);
    if (times.length === 0) store.delete(key);
    else store.set(key, { times, windowMs: entry.windowMs });
  }
}

export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  if (sinceSweep++ > 500) {
    sweep(Date.now());
    sinceSweep = 0;
  }
  const now = Date.now();
  const entry = store.get(key);
  const times = entry ? entry.times.filter((t) => now - t < entry.windowMs) : [];
  if (times.length >= max) {
    store.set(key, { times, windowMs });
    return true;
  }
  times.push(now);
  store.set(key, { times, windowMs });
  return false;
}

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export const LOGIN_MAX = 10;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const UPLOAD_MAX = 20;
export const UPLOAD_WINDOW_MS = 60 * 60 * 1000;