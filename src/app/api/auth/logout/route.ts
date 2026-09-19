import { NextRequest, NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url), 303);
  res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}