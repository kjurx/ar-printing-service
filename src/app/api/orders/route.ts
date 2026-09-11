import { NextRequest, NextResponse } from "next/server";
import { getOrders, addOrder, updateOrderStatus } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: getOrders() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const customer = body?.customer?.trim();
  const phone = body?.phone?.toString().trim();
  const product = body?.product?.toString().trim();
  if (!customer || !phone || !product) {
    return NextResponse.json({ error: "customer, phone & product required" }, { status: 400 });
  }
  const order = {
    id: `ord-${Date.now().toString(36)}`,
    customer,
    phone,
    product,
    quantity: Math.max(1, Number(body.quantity) || 1),
    size: body?.size?.trim() || null,
    designNote: body?.designNote?.trim() || null,
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
  const body = await req.json().catch(() => null);
  const ok = updateOrderStatus(body?.id, body?.status);
  if (!ok) {
    return NextResponse.json({ error: "Invalid order or status" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}