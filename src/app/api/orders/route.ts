import { NextRequest, NextResponse } from "next/server";
import { getOrders, addOrder, updateOrderStatus } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { isMediaUrl } from "@/lib/media";

const MAX_BODY = 64 * 1024;
const PHONE_RE = /^[+\d][\d\s().-]{6,19}$/;

function tooLarge(req: NextRequest) {
  return Number(req.headers.get("content-length") || 0) > MAX_BODY;
}

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: getOrders() });
}

export async function POST(req: NextRequest) {
  if (tooLarge(req)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  const body = await req.json().catch(() => null);
  const customer = typeof body?.customer === "string" ? body.customer.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const product = typeof body?.product === "string" ? body.product.trim() : "";
  if (!customer || !phone || !product) {
    return NextResponse.json({ error: "customer, phone & product required" }, { status: 400 });
  }
  if (customer.length > 100) {
    return NextResponse.json({ error: "customer name too long" }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "invalid phone number" }, { status: 400 });
  }
  if (product.length > 100) {
    return NextResponse.json({ error: "product name too long" }, { status: 400 });
  }
  const quantity = Math.min(999, Math.max(1, Math.floor(Number(body?.quantity)) || 1));
  const size =
    typeof body?.size === "string" ? body.size.trim().slice(0, 50) || null : null;
  const designNote =
    typeof body?.designNote === "string" ? body.designNote.trim().slice(0, 1000) || null : null;
  const design =
    typeof body?.design === "string" &&
    isMediaUrl(body.design) &&
    body.design.length <= 200
      ? body.design
      : null;
  const order = {
    id: `ord-${Date.now().toString(36)}`,
    customer,
    phone,
    product,
    quantity,
    size,
    designNote,
    design,
    status: "NEW" as const,
    createdAt: new Date().toISOString(),
  };
  addOrder(order);
  return NextResponse.json({ order }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (tooLarge(req)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  const body = await req.json().catch(() => null);
  const ok = updateOrderStatus(body?.id, body?.status);
  if (!ok) {
    return NextResponse.json({ error: "Invalid order or status" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}