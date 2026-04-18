import type { NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { getValidatedJudgeAuthToken } from "@/lib/security/env";
import { safeTokenCompare } from "@/lib/security/timing";
import { db } from "@/lib/db";
import { judgeWorkers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

function parseBearerToken(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7);
}

/**
 * Hash a token with SHA-256 and return the hex digest.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Validate that the request carries a valid judge Bearer token.
 * Checks the shared JUDGE_AUTH_TOKEN from the environment.
 */
export function isJudgeAuthorized(request: NextRequest) {
  const providedToken = parseBearerToken(request.headers.get("authorization"));

  if (!providedToken) {
    return false;
  }

  const expectedToken = getValidatedJudgeAuthToken();
  return safeTokenCompare(providedToken, expectedToken);
}

/**
 * Validate that the request carries a valid judge Bearer token for a
 * specific worker. When the worker has a `secretTokenHash` stored in the DB,
 * the provided token is hashed and compared against it. When only a plaintext
 * `secretToken` exists (legacy — should be migrated), a deprecation warning
 * is logged and auth is rejected. Otherwise it falls back to the shared
 * JUDGE_AUTH_TOKEN.
 *
 * Returns an object with `authorized` boolean and an optional error key
 * that can be returned directly to the client.
 */
export async function isJudgeAuthorizedForWorker(
  request: NextRequest,
  workerId: string,
): Promise<{ authorized: boolean; error?: string }> {
  const providedToken = parseBearerToken(request.headers.get("authorization"));

  if (!providedToken) {
    return { authorized: false, error: "unauthorized" };
  }

  const worker = await db.query.judgeWorkers.findFirst({
    where: eq(judgeWorkers.id, workerId),
    columns: { secretTokenHash: true },
  });

  // If the worker exists and has a hashed secret, validate against the hash
  if (worker?.secretTokenHash) {
    if (safeTokenCompare(hashToken(providedToken), worker.secretTokenHash)) {
      return { authorized: true };
    }
    // Token didn't match worker secret — don't fall through to shared token
    return { authorized: false, error: "invalidWorkerToken" };
  }

  // Worker found but has no secretTokenHash — reject and log migration warning
  if (worker) {
    logger.warn(
      { workerId },
      "[judge] Worker %s has no secretTokenHash — rejecting auth. Migrate plaintext secretToken to hash.",
    );
    return { authorized: false, error: "workerSecretNotMigrated" };
  }

  // Worker not found: fall back to shared token
  const expectedToken = getValidatedJudgeAuthToken();
  if (safeTokenCompare(providedToken, expectedToken)) {
    return { authorized: true };
  }

  return { authorized: false, error: "unauthorized" };
}
