import { extractClientIp } from "@/lib/security/ip";
import { logger } from "@/lib/logger";

export const MAX_TEXT_LENGTH = 512;
export const MAX_PATH_LENGTH = 512;

export function normalizeText(value: string | null | undefined, maxLength = MAX_TEXT_LENGTH): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

export function getClientIp(headersList: Headers): string | null {
  const clientIp = extractClientIp(headersList);
  if (!clientIp) {
    return null;
  }

  return normalizeText(clientIp, 128);
}

export function getRequestPath(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    return normalizeText(new URL(url).pathname, MAX_PATH_LENGTH);
  } catch (err) {
    logger.debug({ err, url }, "[request-context] failed to parse request URL path");
    return null;
  }
}
