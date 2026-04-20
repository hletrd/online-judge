# Cycle 14 Debugger Report

**Base commit:** 74d403a6
**Reviewer:** debugger
**Scope:** Latent bug surface, failure modes, regressions

---

## CR14-DB1 — [MEDIUM] `changePassword` rate-limit TOCTOU — concurrent requests can exceed the max attempts

- **Confidence:** HIGH
- **Files:** `src/lib/actions/change-password.ts:40-53`
- **Evidence:** Same as CR14-CR1 and CR14-SR1. The check-then-record pattern has a race window between `isRateLimited` returning false and `recordRateLimitFailure` incrementing the count. Under concurrent requests, this allows exceeding the max attempts.
- **Failure mode:** Two concurrent wrong-password requests both pass the `isRateLimited` check and both increment the counter, but neither is blocked.

## CR14-DB2 — [LOW] `api-rate-limit.ts` `atomicConsumeRateLimit` missing `id` on insert when sidecar is disabled

- **Confidence:** LOW
- **Files:** `src/lib/security/api-rate-limit.ts:70-81`
- **Evidence:** The insert at line 71 includes `id: nanoid()`. This is correct. However, the `rateLimits` table schema may have a default function for `id`. If both the code's `nanoid()` and the schema default exist, there could be a conflict. Checking the schema: the `rateLimits` table uses `text("id").primaryKey().$defaultFn(() => nanoid())`, so the `$defaultFn` only runs when `id` is not provided in the insert values. Since the code explicitly provides `id: nanoid()`, there is no conflict. This is not a bug, but the double-nanoid pattern (once in code, once in schema default) is a maintenance risk — if one is removed without the other, inserts could fail.
- **Suggested fix:** Either rely on the schema default (remove `id` from insert values) or keep the explicit `id` and document why. The `rate-limit.ts` functions do NOT include `id` in their inserts (relying on schema default), while `api-rate-limit.ts` DOES include it. This inconsistency should be resolved.

## CR14-DB3 — [LOW] `recordRateLimitFailure` vs `consumeRateLimitAttemptMulti` — `windowStartedAt` inconsistency for new entries

- **Confidence:** MEDIUM
- **Files:** `src/lib/security/rate-limit.ts:225,261`
- **Evidence:** Same as CR14-CR2. `recordRateLimitFailureMulti` uses `windowStartedAt: now` for inserts while `recordRateLimitFailure` uses `windowStartedAt: entry.windowStartedAt`. Currently equivalent for new entries, but the inconsistency suggests one was written differently from the other.

## Final Sweep

- SSE connection tracking appears robust with proper cleanup.
- Error boundary handling was improved in cycle 14 (descriptive console.error).
- `use-source-draft` catch blocks now have comments (cycle 14 fix).
- No new null/undefined handling issues found in recently modified files.
