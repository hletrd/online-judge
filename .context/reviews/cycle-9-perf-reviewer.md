# Cycle 9 Performance Reviewer Report

**Reviewer:** perf-reviewer
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** Performance, concurrency, CPU/memory/UI responsiveness

## Inventory of Files Reviewed

- `src/lib/auth/config.ts` — JWT callback with per-request DB query
- `src/lib/db/export.ts` — Streaming export with backpressure handling
- `src/lib/compiler/execute.ts` — Docker execution with concurrency limiter
- `src/lib/realtime/realtime-coordination.ts` — SSE connection coordination
- `src/app/api/v1/submissions/route.ts` — Submissions with cursor/offset pagination
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE polling
- `src/lib/assignments/code-similarity.ts` — O(n^2) similarity comparison
- `src/lib/security/rate-limit.ts` — Rate limiting
- `src/lib/capabilities/cache.ts` — Capability resolution cache

## Findings

### CR9-PR1 — [MEDIUM] JWT callback executes DB query on every authenticated request (deferred D3)

- **Confidence:** HIGH
- **File:** `src/lib/auth/config.ts:364-387`
- **Evidence:** The `jwt()` callback queries `db.query.users.findFirst` on every request to refresh the token with the latest user data. With session strategy "jwt", this fires on every authenticated API call and page load. At moderate traffic (100 req/s), this is 100 DB queries/s just for auth refresh.
- **Failure scenario:** Under moderate load, the users table query becomes a bottleneck. Each request acquires a connection from the pool, runs the query, and returns. With 10 DB connections and 100 req/s, the pool is saturated by auth queries alone.
- **Suggested fix:** Cache user data for a short TTL (e.g., 30s) keyed by userId. Only re-query when the cache expires or when `tokenInvalidatedAt` changes. This preserves the security property (role/active status updates propagate within 30s) while reducing DB load by ~97%.

### CR9-PR2 — [MEDIUM] SSE shared poll timer interval not adjustable at runtime

- **Confidence:** MEDIUM
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:129-139`
- **Evidence:** `startSharedPollTimer()` reads `getConfiguredSettings().ssePollIntervalMs` once when starting the timer. If the system setting is changed at runtime, the poll interval does not update until the timer is stopped and restarted (i.e., all SSE connections close and new ones open).
- **Failure scenario:** An admin increases the poll interval from 2s to 10s to reduce DB load during peak hours. Existing SSE connections continue polling at 2s. The DB load is not reduced until all existing connections close.
- **Suggested fix:** On each poll tick, check if the configured interval has changed significantly. If so, clear and restart the timer with the new interval.

### CR9-PR3 — [LOW] Code similarity O(n^2) comparison with synchronous yield only — no worker thread

- **Confidence:** MEDIUM
- **File:** `src/lib/assignments/code-similarity.ts:260-295`
- **Evidence:** The Jaccard similarity comparison is O(n^2) on the number of user/problem entries. The `setTimeout(r, 0)` yield prevents event loop blocking but keeps the computation on the main thread. For large assignments (200+ students, 5+ problems), this could take seconds and block other request processing.
- **Failure scenario:** A large assignment with 500 students and 10 problems generates 5000 entries. The O(n^2/2) comparison is ~12.5M iterations. At ~1us per iteration, this takes ~12.5 seconds of CPU time, during which the Node.js event loop is periodically yielded but still occupied.
- **Suggested fix:** The code already tries the Rust sidecar first (`runSimilarityCheck`). For the TS fallback, consider using a worker thread or limiting the maximum number of entries processed.

### CR9-PR4 — [LOW] Submission POST uses advisory lock on user ID — potential contention under concurrent submissions

- **Confidence:** LOW
- **File:** `src/app/api/v1/submissions/route.ts:251`
- **Evidence:** `pg_advisory_xact_lock` is used to serialize concurrent submissions from the same user. While this is correct for preventing rate-limit bypasses, it means that a user who opens multiple tabs and submits simultaneously will have their second submission blocked until the first completes the transaction.
- **Failure scenario:** A student submits from two browser tabs simultaneously. The second submission waits for the advisory lock, potentially timing out if the first submission's transaction takes long (e.g., due to heavy DB load).
- **Suggested fix:** This is intentional for correctness. Document the expected behavior. Consider adding a client-side submission lock to prevent double-submission UX issues.

## Previously Found Issues (Still Open)

- D3: JWT callback DB query on every request — MEDIUM (same as CR9-PR1)
- AGG-3: Dual-query pagination in 4 routes — LOW (partially fixed for submissions)

## Previously Found Issues (Verified Fixed)

- AGG-4: `waitForReadableStreamDemand` 10ms polling — FIXED (50ms now)
- AGG-3: Encryption key parsing on every call — FIXED
