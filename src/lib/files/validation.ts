import { isImageMimeType } from "./image-processing";
import type { ConfiguredSettings } from "@/lib/system-settings-config";

const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "text/csv",
  "text/markdown",
]);

export function isAllowedMimeType(mimeType: string): boolean {
  return isImageMimeType(mimeType) || ALLOWED_ATTACHMENT_TYPES.has(mimeType);
}

export function validateFileSize(
  sizeBytes: number,
  mimeType: string,
  settings: Pick<ConfiguredSettings, "uploadMaxImageSizeBytes" | "uploadMaxFileSizeBytes">,
): string | null {
  const limit = isImageMimeType(mimeType)
    ? settings.uploadMaxImageSizeBytes
    : settings.uploadMaxFileSizeBytes;
  if (sizeBytes > limit) return "fileTooLarge";
  return null;
}

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": ".webp",
  "image/png": ".webp",
  "image/gif": ".webp",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "application/zip": ".zip",
  "application/x-zip-compressed": ".zip",
  "text/plain": ".txt",
  "text/csv": ".csv",
  "text/markdown": ".md",
};

export function getExtensionForMime(mimeType: string): string {
  return MIME_TO_EXTENSION[mimeType] ?? ".bin";
}
