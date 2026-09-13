import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, saveProduct, deleteProduct } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import type { Product } from "@/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type RouteContext = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existing = getAllProducts().find((p) => p.id === params.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await req.json().catch(() => null);
  const name = body?.name?.trim() || existing.name;
  const updated: Product = {
    ...existing,
    slug: body?.slug?.trim() || slugify(name),
    name,
    category: body?.category || existing.category,
    description: body?.description?.trim() ?? existing.description,
    icon: body?.icon || existing.icon,
    image:
      typeof body?.image === "string" && body.image.startsWith("/uploads/")
        ? body.image
        : existing.image || null,
    priceFrom:
      typeof body?.priceFrom === "number" && body.priceFrom > 0
        ? Math.round(body.priceFrom)
        : existing.priceFrom,
    sizeRange: body?.sizeRange?.trim() || existing.sizeRange,
    isActive: body?.isActive !== undefined ? body.isActive : existing.isActive,
    sortOrder: Number(body?.sortOrder) || existing.sortOrder,
  };
  const clash = getAllProducts().find(
    (p) => p.slug === updated.slug && p.id !== updated.id
  );
  if (clash) {
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  }
  saveProduct(updated);
  return NextResponse.json({ product: updated });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existing = getAllProducts().find((p) => p.id === params.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  deleteProduct(params.id);
  return NextResponse.json({ ok: true });
}