import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
export const PUBLIC_PATH = "/uploads";

export const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

export const ALLOWED_VIDEO_MIMES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

export type FileKind = "image" | "video" | "other";

export function detectKind(mime: string): FileKind {
  if (ALLOWED_IMAGE_MIMES.includes(mime)) return "image";
  if (ALLOWED_VIDEO_MIMES.includes(mime)) return "video";
  return "other";
}

export function isAllowed(mime: string) {
  return (
    ALLOWED_IMAGE_MIMES.includes(mime) || ALLOWED_VIDEO_MIMES.includes(mime)
  );
}

export function maxSizeFor(kind: FileKind) {
  if (kind === "image") return MAX_IMAGE_SIZE;
  if (kind === "video") return MAX_VIDEO_SIZE;
  return MAX_IMAGE_SIZE;
}

function safeExtension(originalName: string, mime: string): string {
  const fromName = path.extname(originalName).toLowerCase().replace(".", "");
  if (fromName && /^[a-z0-9]{1,5}$/.test(fromName)) return fromName;
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/ogg": "ogv",
    "video/quicktime": "mov",
  };
  return map[mime] ?? "bin";
}

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function saveBuffer(
  buffer: Buffer,
  originalName: string,
  mime: string,
) {
  await ensureUploadDir();
  const ext = safeExtension(originalName, mime);
  const slug = crypto.randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${slug}.${ext}`;
  const fullPath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(fullPath, buffer);
  return { filename, url: `${PUBLIC_PATH}/${filename}`, fullPath };
}

export async function deleteFile(filename: string) {
  const safe = path.basename(filename); // prevent path traversal
  const fullPath = path.join(UPLOAD_DIR, safe);
  try {
    await fs.unlink(fullPath);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") throw err;
  }
}
