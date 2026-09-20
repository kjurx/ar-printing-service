export const BLOB_URL_RE =
  /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[\w./%-]+\.[a-z]{3,4}$/i;
export const UPLOAD_PATH_RE = /^\/uploads\/[a-z0-9-]+\.(jpg|jpeg|png|webp|gif|svg)$/i;

export function isBlobUrl(u: string) {
  return BLOB_URL_RE.test(u);
}

export function isMediaUrl(u: string) {
  return BLOB_URL_RE.test(u) || UPLOAD_PATH_RE.test(u) || u.startsWith("/img/");
}

// Admin-uploaded files (blob store or local /uploads) can be deleted; committed
// /img assets are repo-owned and should never be removed at runtime.
export function isDeleteableUpload(u: string) {
  return BLOB_URL_RE.test(u) || UPLOAD_PATH_RE.test(u);
}