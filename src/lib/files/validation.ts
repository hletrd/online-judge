import { isImageMimeType } from "./image-processing";
import type { ConfiguredSettings } from "@/lib/system-settings-config";
import JSZip from "jszip";

const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "text/csv",
  "text/markdown",
]);

const ZIP_MIME_TYPES = new Set([
  "application/zip",
  "application/x-zip-compressed",
]);

export function isAllowedMimeType(mimeType: string): boolean {
  return isImageMimeType(mimeType) || ALLOWED_ATTACHMENT_TYPES.has(mimeType);
}

export function isZipMimeType(mimeType: string): boolean {
  return ZIP_MIME_TYPES.has(mimeType);
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

/**
 * Maximum decompressed size for a single ZIP entry.
 * Prevents a single entry from consuming excessive memory during validation,
 * even when the total archive size is below the overall limit.
 */
const MAX_SINGLE_ENTRY_DECOMPRESSED_BYTES = 50 * 1024 * 1024; // 50 MB

/**
 * Validate the total decompressed size of a ZIP buffer to prevent ZIP bombs.
 *
 * Reads `uncompressedSize` from each entry's metadata when available (O(1) per
 * entry) instead of decompressing every entry into memory. Falls back to full
 * decompression only when the metadata is missing (e.g., ZIPs using data
 * descriptors without sizes — rare in practice).
 *
 * Per-entry size cap prevents OOM from a ZIP bomb with many small entries
 * that each decompress to a large payload — the total check alone would
 * allow up to 10,000 entries * 50 MB each before triggering.
 */
export async function validateZipDecompressedSize(
  buffer: Buffer,
  maxDecompressedSizeBytes: number,
): Promise<string | null> {
  try {
    const zip = await JSZip.loadAsync(buffer, { createFolders: false });
    const entries = Object.values(zip.files).filter((e) => !e.dir);
    // Limit the number of entries to prevent ZIP bomb with millions of tiny files
    if (entries.length > 10000) return "zipDecompressedSizeExceeded";

    // Fast path: read uncompressedSize from ZIP metadata without decompressing.
    // This avoids allocating hundreds of MB of memory for the common case.
    // JSZip exposes entry._data.uncompressedSize after loadAsync for most ZIPs.
    let totalUncompressed = 0;
    let allMetadataAvailable = true;
    for (const entry of entries) {
      const metadataSize: number | undefined = (entry as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize;
      if (metadataSize === undefined) {
        allMetadataAvailable = false;
        break;
      }
      // Per-entry size cap: reject any single entry that decompresses beyond
      // this limit to prevent OOM before the total accumulator can catch it.
      if (metadataSize > MAX_SINGLE_ENTRY_DECOMPRESSED_BYTES) {
        return "zipDecompressedSizeExceeded";
      }
      totalUncompressed += metadataSize;
      if (totalUncompressed > maxDecompressedSizeBytes) {
        return "zipDecompressedSizeExceeded";
      }
    }

    if (allMetadataAvailable) {
      return null; // All entries within limits
    }

    // Slow path: some entries lack metadata (data descriptors without sizes).
    // Fall back to decompressing entry by entry to measure actual sizes.
    totalUncompressed = 0;
    for (const entry of entries) {
      const content = await entry.async("uint8array");
      // Per-entry size cap
      if (content.length > MAX_SINGLE_ENTRY_DECOMPRESSED_BYTES) {
        return "zipDecompressedSizeExceeded";
      }
      totalUncompressed += content.length;
      if (totalUncompressed > maxDecompressedSizeBytes) {
        return "zipDecompressedSizeExceeded";
      }
    }
    return null;
  } catch {
    // If we can't parse the ZIP, reject it
    return "zipDecompressedSizeExceeded";
  }
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
