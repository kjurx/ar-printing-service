import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { isRateLimited, clientIp, UPLOAD_MAX, UPLOAD_WINDOW_MS } from "@/lib/auth/rateLimit";
import { UPLOAD_DIR } from "@/lib/db/storage";
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_FORM_LENGTH = 6 * 1024 * 1024;

function matchesMagic(type: string, buf: Buffer): boolean {
  if (type === "image/jpeg") {
    return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  }
  if (type === "image/png") {
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    return buf.length >= 8 && buf.subarray(0, 8).equals(sig);
  }
  if (type === "image/gif") {
    const head = buf.subarray(0, 6).toString("latin1");
    return head === "GIF87a" || head === "GIF89a";
  }
  if (type === "image/webp") {
    return (
      buf.length >= 12 &&
      buf.subarray(0, 4).toString("latin1") === "RIFF" &&
      buf.subarray(8, 12).toString("latin1") === "WEBP"
    );
  }
  if (type === "image/svg+xml") {
    const text = buf.toString("utf8").toLowerCase();
    return (
      text.includes("<svg") &&
      !text.includes("<script") &&
      !text.includes("javascript:") &&
      !text.includes("<foreignobject") &&
      !text.includes(" onload=") &&
      !text.includes(" onerror=")
    );
  }
  return false;
}

export async function POST(req: NextRequest) {
  if (isRateLimited(`upload:${clientIp(req)}`, UPLOAD_MAX, UPLOAD_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many uploads. Try again later." },
      { status: 429 }
    );
  }
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_FORM_LENGTH) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

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

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesMagic(type, buffer)) {
    return NextResponse.json(
      { error: "File content does not match its declared type" },
      { status: 400 }
    );
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}.${EXT[type]}`;

  if (token) {
    const blob = await put(`uploads/${name}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: type,
      token,
    });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const tmp = path.join(UPLOAD_DIR, `${name}.tmp`);
  fs.writeFileSync(tmp, buffer);
  fs.renameSync(tmp, path.join(UPLOAD_DIR, name));

  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
}