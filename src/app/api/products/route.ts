import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, saveProduct } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import type { Product } from "@/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  return NextResponse.json({ products: getAllProducts() });
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  const product: Product = {
    id: `p-${Date.now().toString(36)}`,
    slug: body.slug?.trim() || slugify(body.name),
    name: body.name.trim(),
    category: body.category || "Apparel",
    description: body.description?.trim() || "",
    icon: body.icon || "🎁",
    image:
      typeof body.image === "string" && body.image.startsWith("/uploads/")
        ? body.image
        : null,
    priceFrom:
      typeof body.priceFrom === "number" && body.priceFrom > 0
        ? Math.round(body.priceFrom)
        : null,
    sizeRange: body.sizeRange?.trim() || null,
    isActive: body.isActive !== false,
    sortOrder: Number(body.sortOrder) || 0,
  };
  if (getAllProducts().some((p) => p.slug === product.slug)) {
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  }
  saveProduct(product);
  return NextResponse.json({ product }, { status: 201 });
}