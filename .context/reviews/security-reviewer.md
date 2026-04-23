# Security Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** security-reviewer
**Base commit:** 54cb92ed

## Inventory of Files Reviewed

- `src/lib/assignments/submissions.ts` — Submission validation (verified cycle 45 fix)
- `src/lib/security/api-rate-limit.ts` — API rate limiting (Date.now analysis)
- `src/lib/realtime/realtime-coordination.ts` — Shared SSE coordination (Date.now analysis)
- `src/app/api/v1/submissions/route.ts` — Submission creation
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts` — Anti-cheat events
- `src/lib/assignments/recruiting-invitations.ts` — Recruiting token flow
- `src/proxy.ts` — Auth proxy
- `src/lib/security/password-hash.ts` — Password hashing
- `src/lib/security/encryption.ts` — Encryption utilities
- `src/lib/security/csrf.ts` — CSRF protection
- `src/lib/security/env.ts` — Environment validation

## Previously Fixed Items (Verified)

- Submission validation uses `getDbNowUncached()` for deadline enforcement: PASS
- Submission rate-limit uses `getDbNowUncached()`: PASS
- Contest join route has explicit `auth: true`: PASS
- Access-code capability auth: PASS
- LIKE pattern escaping: PASS

## New Findings

### SEC-1: `realtime-coordination.ts` uses `Date.now()` for DB-stored `blockedUntil` comparisons — clock-skew in shared SSE coordination [MEDIUM/MEDIUM]

**File:** `src/lib/realtime/realtime-coordination.ts:88,148`

**Description:** The `acquireSharedSseConnectionSlot` and `shouldRecordSharedHeartbeat` functions use `Date.now()` to compare against DB-stored `rateLimits.blockedUntil`, `windowStartedAt`, and `lastAttempt` columns. This is the same clock-skew class of issue that was fixed in `api-rate-limit.ts` (noted as AGG-2 in the cycle 45 aggregate).

When `REALTIME_COORDINATION_BACKEND=postgresql` is configured, these functions operate within a `pg_advisory_xact_lock` transaction. If the app server clock is behind the DB server clock, an SSE connection slot that should be expired (per DB time) will still be counted as active, potentially preventing new connections from being established. Conversely, if the app clock is ahead, expired slots may be evicted prematurely.

**Concrete failure scenario:** App server clock is 30 seconds ahead of DB. A student's SSE connection slot has `blockedUntil` at DB time 10:00:00. At 9:59:30 DB time (which the app server sees as 10:00:00), the slot is evicted, and the student's SSE stream drops unexpectedly. The student reconnects, consuming a new slot.

**Fix:** Cache `getDbNowUncached()` at the start of each transaction and use it for all comparisons. The functions are already async and within a transaction, so this is a drop-in change.

**Confidence:** Medium — only affects deployments with `REALTIME_COORDINATION_BACKEND=postgresql` configured.

---

### SEC-2: `rateLimitedResponse` uses `Date.now()` for `X-RateLimit-Reset` header — header inaccuracy under clock skew [LOW/LOW]

**File:** `src/lib/security/api-rate-limit.ts:124`

**Description:** The `rateLimitedResponse` function computes `X-RateLimit-Reset` using `Date.now() + windowMs`. Under clock skew, the reset timestamp in the header will be inaccurate relative to the DB's actual rate-limit window. This is a header-only concern — the actual rate-limit enforcement uses `Date.now()` consistently within `atomicConsumeRateLimit`, so the enforcement logic is internally consistent. The header inaccuracy only misleads API clients about when they can retry.

**Fix:** Low priority — compute the reset time from the DB-stored `blockedUntil` value if available, or accept the minor header inaccuracy.

**Confidence:** Low

---

### Carry-Over Items

- **SEC-2 (from cycle 43):** Anti-cheat heartbeat dedup uses `Date.now()` for LRU cache (LOW/LOW, deferred — approximate by design)
- **Prior SEC-3:** Anti-cheat copies text content (LOW/LOW, deferred)
- **Prior SEC-4:** Docker build error leaks paths (LOW/LOW, deferred)
