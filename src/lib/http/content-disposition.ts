/**
 * RFC 5987 Content-Disposition helpers for safe Unicode filename encoding.
 *
 * Korean and other non-ASCII characters in export filenames are preserved
 * via the `filename*=UTF-8''...` parameter, with an ASCII-safe `filename`
 * fallback for older browsers that don't support RFC 5987.
 */

/**
 * Sanitize a filename to ASCII-safe characters for the `filename` parameter
 * fallback. Replaces non-alphanumeric characters (except dash and underscore)
 * with a dash, trims whitespace, collapses consecutive dashes, and caps length.
 */
export function sanitizeExportFilename(name: string): string {
  return name
    .replace(/[^\w\- ]/g, "-")    // Replace non-word chars (except dash/space) with dash
    .trim()
    .replace(/[\s]+/g, "-")         // Replace whitespace with dash
    .replace(/-+/g, "-")            // Collapse consecutive dashes
    .slice(0, 100)
    || "export";                     // Fallback if name becomes empty
}

/**
 * Build a `Content-Disposition: attachment` header value with RFC 5987
 * `filename*` encoding for non-ASCII characters.
 *
 * Produces both:
 *   `filename="ascii-safe-fallback.ext"`  — for older browsers
 *   `filename*=UTF-8''percent-encoded.ext` — for RFC 5987-capable browsers
 *
 * @param originalName - The original filename (may contain Unicode)
 * @param extension - File extension including dot (e.g. ".csv", ".json", ".zip")
 */
export function contentDispositionAttachment(
  originalName: string,
  extension: string,
): string {
  const safeName = sanitizeExportFilename(originalName);
  const asciiFilename = `${safeName}${extension}`;

  // RFC 5987: filename*= charset'lang'percent-encoded-value
  // Language is left empty. encodeURIComponent produces percent-encoded UTF-8 octets.
  const encodedName = encodeURIComponent(`${originalName}${extension}`);
  const rfc5987Filename = `UTF-8''${encodedName}`;

  return `attachment; filename="${asciiFilename}"; filename*=${rfc5987Filename}`;
}
