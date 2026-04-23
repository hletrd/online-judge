# Debugger Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** debugger
**Base commit:** 54cb92ed

## Inventory of Files Reviewed

- `src/lib/assignments/submissions.ts` — Submission validation (verified cycle 45 fix)
- `src/lib/realtime/realtime-coordination.ts` — SSE connection management (failure mode analysis)
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE events route (failure mode analysis)
- `src/lib/security/api-rate-limit.ts` — Rate limiting (failure mode analysis)
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts` — Anti-cheat events
- `src/lib/assignments/recruiting-invitations.ts` — Recruiting token flow

## Previously Fixed Items (Verified)

- All prior fixes intact and working

## New Findings

### DBG-1: SSE connection slot leak under clock skew in shared coordination mode [MEDIUM/MEDIUM]

**File:** `src/lib/realtime/realtime-coordination.ts:88-131`

**Description:** In `acquireSharedSseConnectionSlot`, the stale slot eviction query at line 93-97 compares `rateLimits.blockedUntil < nowMs` where `nowMs = Date.now()`. If the app server clock is ahead of the DB clock, some slots that are still valid (per DB time) will be evicted prematurely. If the app clock is behind, expired slots will not be evicted, causing the connection count to remain inflated. Over time, this can cause `serverBusy` (503) rejections for legitimate new SSE connections.

**Failure mode (app clock behind DB):**
1. Student A connects at DB time 10:00:00. Slot `blockedUntil` = 10:30:00 (30min timeout).
2. Student A disconnects at 10:05:00 but the slot is not released (network issue, browser crash).
3. At DB time 10:35:00, the slot should be expired. But the app server thinks it's 10:34:30, so `blockedUntil (10:30:00) < nowMs (10:34:30*1000)` is true, and the slot is NOT evicted.
4. The slot persists until the next eviction cycle when the app clock catches up. This inflates the active connection count.

**Fix:** Use `getDbNowUncached()` for the `nowMs` value inside the transaction.

**Confidence:** Medium

---

### DBG-2: `shouldRecordSharedHeartbeat` uses `Date.now()` for LRU-style heartbeat dedup — missed dedup under clock skew [LOW/LOW]

**File:** `src/lib/realtime/realtime-coordination.ts:148`

**Description:** The function compares `nowMs - existing.lastAttempt < minIntervalMs` where `nowMs = Date.now()` and `existing.lastAttempt` is a DB-stored timestamp. Under clock skew where the app is behind the DB, the dedup may allow a heartbeat to be recorded slightly more frequently than the 60-second interval.

**Failure mode:** App clock is 5 seconds behind DB. A heartbeat was recorded at DB time 10:00:00 (lastAttempt = 10:00:00 in DB time). At DB time 10:00:55, the app server thinks it's 10:00:50 and `nowMs - lastAttempt` = 50 seconds < 60 seconds, so the heartbeat is skipped. At DB time 10:01:00, the app server thinks it's 10:00:55 and `nowMs - lastAttempt` = 55 seconds < 60 seconds, still skipped. The heartbeat is eventually recorded at ~10:01:05 DB time instead of the expected 10:01:00. This is a minor timing inaccuracy, not a data integrity issue.

**Fix:** Low priority — the dedup is approximate by design. Using `getDbNowUncached()` would improve accuracy but adds a DB round-trip on the heartbeat hot path.

**Confidence:** Low
