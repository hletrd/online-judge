import { NextRequest, NextResponse } from "next/server";
import { getRateLimitKey, isRateLimited, recordRateLimitFailure } from "./rate-limit";
import { db } from "@/lib/db";
import { rateLimits } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const API_RATE_LIMIT_MAX = parseInt(process.env.API_RATE_LIMIT_MAX || "30", 10);
export const API_RATE_LIMIT_WINDOW_MS = parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || "60000", 10);

const consumedRequestKeys = new WeakMap<NextRequest, Set<string>>();

function rememberRequestKey(request: NextRequest, key: string) {
  const requestKeys = consumedRequestKeys.get(request) ?? new Set<string>();
  requestKeys.add(key);
  consumedRequestKeys.set(request, requestKeys);
}

function hasConsumedRequestKey(request: NextRequest, key: string) {
  return consumedRequestKeys.get(request)?.has(key) ?? false;
}

function rateLimitedResponse() {
  return NextResponse.json(
    { error: "rateLimited" },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}

/**
 * Consume one rate limit token for a mutation endpoint.
 * Returns a 429 response if rate limited, or null if allowed.
 */
export function consumeApiRateLimit(
  request: NextRequest,
  endpoint: string
): NextResponse | null {
  const key = getRateLimitKey(`api:${endpoint}`, request.headers);

  if (isRateLimited(key)) {
    return rateLimitedResponse();
  }

  recordRateLimitFailure(key);
  rememberRequestKey(request, key);

  return null;
}

/**
 * Check and record a rate limit for a server action.
 * Keyed on userId + actionName so each user has their own counter.
 * Returns { error: "rateLimited" } if the limit is exceeded, or null if allowed.
 */
export function checkServerActionRateLimit(
  userId: string,
  actionName: string,
  maxRequests: number = 20,
  windowSeconds: number = 60,
): { error: string } | null {
  const key = `sa:${userId}:${actionName}`;
  const windowMs = windowSeconds * 1000;
  const now = Date.now();

  const existing = db.select().from(rateLimits).where(eq(rateLimits.key, key)).get();

  let attempts: number;
  let windowStartedAt: number;
  let exists: boolean;

  if (!existing) {
    attempts = 0;
    windowStartedAt = now;
    exists = false;
  } else if (existing.windowStartedAt + windowMs <= now) {
    // Window has expired — reset
    attempts = 0;
    windowStartedAt = now;
    exists = true;
  } else {
    attempts = existing.attempts;
    windowStartedAt = existing.windowStartedAt;
    exists = true;
  }

  if (attempts >= maxRequests) {
    return { error: "rateLimited" };
  }

  const newAttempts = attempts + 1;

  if (exists) {
    db.update(rateLimits)
      .set({ attempts: newAttempts, windowStartedAt, lastAttempt: now })
      .where(eq(rateLimits.key, key))
      .run();
  } else {
    db.insert(rateLimits)
      .values({
        id: nanoid(),
        key,
        attempts: newAttempts,
        windowStartedAt,
        blockedUntil: null,
        consecutiveBlocks: 0,
        lastAttempt: now,
      })
      .run();
  }

  return null;
}
