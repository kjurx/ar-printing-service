import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, saveProduct, deleteProduct } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import type { Product, Category } from "@/types";

const CATEGORIES: Category[] = ["Apparel", "Drinkware", "Accessories", "Home & Gifts"];

function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as string[]).includes(value);
}

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
  if (Number(req.headers.get("content-length") || 0) > 256 * 1024) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  const existing = getAllProducts().find((p) => p.id === params.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" && body.name.trim()
    ? body.name.trim()
    : existing.name;
  const updated: Product = {
    ...existing,
    slug: typeof body?.slug === "string" && body.slug.trim()
      ? body.slug.trim()
      : slugify(name),
    name,
    category: isCategory(body?.category) ? body.category : existing.category,
    description: typeof body?.description === "string"
      ? body.description.trim()
      : existing.description,
    icon:
      typeof body?.icon === "string" && body.icon.trim()
        ? body.icon.trim()
        : existing.icon || "🎁",
    image:
      typeof body?.image === "string" && body.image.startsWith("/uploads/")
        ? body.image
        : typeof body?.image === "string"
          ? existing.image || null
          : body?.image === null
            ? null
            : existing.image || null,
    priceFrom:
      typeof body?.priceFrom === "number" && body.priceFrom > 0
        ? Math.round(body.priceFrom)
        : typeof body?.priceFrom === "number" || body?.priceFrom === null
          ? null
          : existing.priceFrom,
    sizeRange:
      typeof body?.sizeRange === "string"
        ? body.sizeRange.trim() || null
        : body?.sizeRange === null
          ? null
          : existing.sizeRange,
    isActive: body?.isActive !== undefined ? body.isActive : existing.isActive,
    sortOrder: typeof body?.sortOrder === "number"
      ? body.sortOrder
      : existing.sortOrder,
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