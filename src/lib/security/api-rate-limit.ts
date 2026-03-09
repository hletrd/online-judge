import { NextRequest, NextResponse } from "next/server";
import { getRateLimitKey, isRateLimited, recordRateLimitFailure } from "./rate-limit";

export const API_RATE_LIMIT_MAX = parseInt(process.env.API_RATE_LIMIT_MAX || "30", 10);
export const API_RATE_LIMIT_WINDOW_MS = parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || "60000", 10);

/**
 * Check API rate limit for a mutation endpoint.
 * Returns a 429 response if rate limited, or null if allowed.
 */
export function checkApiRateLimit(
  request: NextRequest,
  endpoint: string
): NextResponse | null {
  const key = getRateLimitKey(`api:${endpoint}`, request.headers);

  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "rateLimited" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  return null;
}

/**
 * Record a rate limit hit (call on every mutation request).
 */
export function recordApiRateHit(request: NextRequest, endpoint: string) {
  const key = getRateLimitKey(`api:${endpoint}`, request.headers);
  recordRateLimitFailure(key);
}
