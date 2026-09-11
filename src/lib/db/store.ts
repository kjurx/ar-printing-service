import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { DBShape, Product, Order } from "@/types";
import { ORDER_STATUSES } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const SEED_FILE = path.join(process.cwd(), "src", "data", "seed.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function read(): DBShape {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    const seed: DBShape = JSON.parse(fs.readFileSync(SEED_FILE, "utf8"));
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function write(db: DBShape) {
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function verifyAdmin(email: string, password: string) {
  const db = read();
  const admin = db.admins.find(
    (a) => a.email.toLowerCase() === email.toLowerCase()
  );
  if (!admin) return null;
  if (admin.passwordHash !== sha256(password)) return null;
  return { email: admin.email, name: admin.name };
}

export function getAdminList() {
  const db = read();
  return db.admins.map((a) => ({ email: a.email, name: a.name }));
}

export function getProducts(): Product[] {
  const db = read();
  return [...db.products]
    .filter((p) => p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAllProducts(): Product[] {
  const db = read();
  return [...db.products].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function saveProduct(product: Product) {
  const db = read();
  const idx = db.products.findIndex((p) => p.id === product.id);
  if (idx === -1) {
    db.products.push(product);
  } else {
    db.products[idx] = product;
  }
  write(db);
}

export function deleteProduct(id: string) {
  const db = read();
  db.products = db.products.filter((p) => p.id !== id);
  write(db);
}

export function getOrders(): Order[] {
  const db = read();
  return [...db.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addOrder(order: Order) {
  const db = read();
  db.orders.unshift(order);
  write(db);
}

export function updateOrderStatus(id: string, status: string) {
  if (!ORDER_STATUSES.includes(status as Order["status"])) return false;
  const db = read();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return false;
  order.status = status as Order["status"];
  write(db);
  return true;
}

export function getSettings(): Record<string, string> {
  const db = read();
  return db.settings;
}

export function saveSettings(next: Record<string, string>) {
  const db = read();
  db.settings = next;
  write(db);
}