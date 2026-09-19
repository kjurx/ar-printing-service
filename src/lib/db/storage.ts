import os from "os";
import path from "path";

// Vercel serverless functions have a read-only filesystem except /tmp.
// Demo mode keeps the JSON store + uploads under /tmp so writes succeed —
// data resets on cold start / redeploy. Local dev and self-hosted keep the
// real project directory under <cwd>/data.
export const DEMO_MODE = process.env.VERCEL === "1";
export const ROOT_DIR = DEMO_MODE
  ? path.join(os.tmpdir(), "ar-printing-service")
  : process.cwd();
export const DATA_DIR = path.join(ROOT_DIR, "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");