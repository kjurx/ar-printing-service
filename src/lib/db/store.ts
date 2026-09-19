import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { DBShape, Product, Order } from "@/types";
import { ORDER_STATUSES } from "@/types";
import { DATA_DIR } from "./storage";

const SCRYPT_PREFIX = "scrypt$";
const LEGACY_SHA256 = /^[a-f0-9]{64}$/;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${SCRYPT_PREFIX}${hash.toString("hex")}$${salt.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (stored.startsWith(SCRYPT_PREFIX)) {
    const [, hashHex, saltHex] = stored.split("$");
    if (!hashHex || !saltHex) return false;
    try {
      const expected = Buffer.from(hashHex, "hex");
      const candidate = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), 64);
      return (
        expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate)
      );
    } catch {
      return false;
    }
  }
  if (LEGACY_SHA256.test(stored)) {
    return crypto.createHash("sha256").update(password).digest("hex") === stored;
  }
  return false;
}

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
  const tmp = path.join(DATA_DIR, `db.json.tmp-${process.pid}`);
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

export function verifyAdmin(email: string, password: string) {
  const db = read();
  const admin = db.admins.find(
    (a) => a.email.toLowerCase() === email.toLowerCase()
  );
  if (!admin) return null;
  if (!verifyPassword(password, admin.passwordHash)) return null;
  if (!admin.passwordHash.startsWith(SCRYPT_PREFIX)) {
    const idx = db.admins.indexOf(admin);
    db.admins[idx] = { ...admin, passwordHash: hashPassword(password) };
    write(db);
  }
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