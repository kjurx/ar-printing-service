import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "ar_session";
const SECRET = process.env.SESSION_SECRET || "dev-insecure-secret-change-me";
const TTL_MS = 24 * 60 * 60 * 1000;

interface SessionPayload {
  email: string;
  name: string;
  exp: number;
}

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function createToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyToken(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if (sign(body) !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getSession(): SessionPayload | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function createSessionCookie(email: string, name: string) {
  const token = createToken({ email, name, exp: Date.now() + TTL_MS });
  return token;
}

export { COOKIE };
export const DEFAULT_ADMIN_PASSWORD = "admin123";