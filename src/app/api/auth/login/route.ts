import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/db/store";
import { createSessionCookie, COOKIE } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.trim();
  const password = body?.password?.toString();
  if (!email || !password) {
    return NextResponse.json({ error: "email & password required" }, { status: 400 });
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