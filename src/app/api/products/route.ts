import { NextRequest, NextResponse } from "next/server";
import { getProducts, getAllProducts, saveProduct } from "@/lib/db/store";
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

export async function GET() {
  const session = getSession();
  const products = session ? getAllProducts() : getProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (Number(req.headers.get("content-length") || 0) > 256 * 1024) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  const product: Product = {
    id: `p-${Date.now().toString(36)}`,
    slug: body.slug?.trim() || slugify(body.name),
    name: body.name.trim(),
    category: isCategory(body.category) ? body.category : "Apparel",
    description: body.description?.trim() || "",
    icon: body.icon?.trim() || "🎁",
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