import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

type RouteContext = { params: { name: string } };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const name = params.name;
  if (!/^[a-z0-9-]+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(name)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const file = path.join(UPLOAD_DIR, name);
  if (!fs.existsSync(file)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const body = fs.readFileSync(file);
  return new NextResponse(body, {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}