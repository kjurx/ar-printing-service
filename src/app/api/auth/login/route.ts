import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/db/store";
import { createSessionCookie, COOKIE } from "@/lib/auth/session";
import { isRateLimited, clientIp, LOGIN_MAX, LOGIN_WINDOW_MS } from "@/lib/auth/rateLimit";

export async function POST(req: NextRequest) {
  if (isRateLimited(`login:${clientIp(req)}`, LOGIN_MAX, LOGIN_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > 64 * 1024) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  const body = await req.json().catch(() => null);
  const email = body?.email?.trim();
  const password = body?.password?.toString();
  if (!email || !password) {
    return NextResponse.json({ error: "email & password required" }, { status: 400 });
  }
  if (email.length > 254 || password.length > 256) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }
  const admin = verifyAdmin(email, password);
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = createSessionCookie(admin.email, admin.name);
  const res = NextResponse.json({ admin });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60,
    path: "/",
  });
  return res;
}