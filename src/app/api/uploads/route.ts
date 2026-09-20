import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSession } from "@/lib/auth/session";
import { UPLOAD_DIR } from "@/lib/db/storage";
import { isBlobUrl, UPLOAD_PATH_RE } from "@/lib/media";

export async function DELETE(req: NextRequest) {
  if (!getSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : null;
  if (!url) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (isBlobUrl(url) && token) {
    try {
      await del(url, { token });
    } catch {
      return NextResponse.json({ error: "Could not delete file" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  if (UPLOAD_PATH_RE.test(url)) {
    const name = url.replace("/uploads/", "");
    try {
      fs.unlinkSync(path.join(UPLOAD_DIR, name));
    } catch {
      // already gone
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid url" }, { status: 400 });
}