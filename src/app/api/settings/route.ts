import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ settings: getSettings() });
}

export async function PUT(req: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid settings" }, { status: 400 });
  }
  const merged = { ...getSettings(), ...body };
  saveSettings(merged);
  return NextResponse.json({ settings: merged });
}