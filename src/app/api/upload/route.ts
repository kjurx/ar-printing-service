import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const type = file.type;
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WEBP, GIF or SVG allowed" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}.${EXT[type]}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);

  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
}