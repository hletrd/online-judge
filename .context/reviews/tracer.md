# Tracer Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** tracer
**Base commit:** 54cb92ed

## Causal Tracing of Suspicious Flows

### TR-1: `acquireSharedSseConnectionSlot` uses `Date.now()` for DB-timestamp comparisons — clock-skew in SSE slot management [MEDIUM/MEDIUM]

**File:** `src/lib/realtime/realtime-coordination.ts:88-131`

**Causal trace:**
1. Client opens SSE connection to `/api/v1/submissions/[id]/events`
2. `acquireSharedSseConnectionSlot` is called
3. Line 88: `const nowMs = Date.now();` — app-server wall clock
4. Line 89: `const expiresAt = nowMs + timeoutMs + 30_000;` — computed from app-server time
5. Line 95: `lt(rateLimits.blockedUntil, nowMs)` — DB-stored `blockedUntil` compared against app-server time
6. Line 108: `gte(rateLimits.blockedUntil, nowMs)` — same comparison for active slot count
7. Line 120-128: New slot inserted with `expiresAt` computed from app-server time

Steps 5-6 cross a trust boundary: app-server time (untrusted relative to DB) is compared against DB-stored timestamps. Step 7 writes a `blockedUntil` and `windowStartedAt` computed from app-server time into the DB, mixing clock sources.

**Competing hypotheses:**
- H1: Clock skew is negligible in production (container NTP syncs). **Rejected:** The codebase has fixed clock-skew bugs in at least 6 previous cycles, indicating it is a real production concern.
- H2: SSE slot expiry is approximate and a few seconds of skew is acceptable. **Partially accepted:** The 30-second buffer on line 89 (`timeoutMs + 30_000`) mitigates some skew, but stale slot eviction (step 5) could incorrectly evict valid slots or retain expired ones.

**Fix:** Use `getDbNowUncached()` for `nowMs` inside the transaction, consistent with the pattern in `validateAssignmentSubmission` and `atomicConsumeRateLimit`.

**Confidence:** Medium
