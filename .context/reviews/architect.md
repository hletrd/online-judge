# Architecture Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** architect
**Base commit:** 54cb92ed

## Inventory of Files Reviewed

- `src/lib/realtime/realtime-coordination.ts` — Shared SSE coordination (clock source analysis)
- `src/lib/security/api-rate-limit.ts` — API rate limiting (clock source analysis)
- `src/lib/assignments/submissions.ts` — Submission validation (verified cycle 45 fix)
- `src/lib/assignments/leaderboard.ts` — Leaderboard freeze
- `src/proxy.ts` — Auth proxy cache (FIFO analysis)

## Previously Fixed Items (Verified)

- `validateAssignmentSubmission` uses `getDbNowUncached()`: PASS
- Date.now() replaced in assignment PATCH: PASS

## New Findings

### ARCH-1: `realtime-coordination.ts` uses `Date.now()` for DB-timestamp comparisons — architectural inconsistency in shared coordination mode [MEDIUM/MEDIUM]

**File:** `src/lib/realtime/realtime-coordination.ts:88,148`

**Description:** The codebase has systematically migrated from `Date.now()` to `getDbNowUncached()` for all comparisons against DB-stored timestamps inside transactions. This convention was applied to the assignment PATCH route, the submission rate-limit, the recruiting invitation routes, and most recently `validateAssignmentSubmission`. The shared SSE coordination functions are the only remaining code paths that use `Date.now()` to compare against DB-stored `rateLimits` columns inside a `pg_advisory_xact_lock` transaction.

The architectural risk: the `realtime-coordination.ts` module is only active when `REALTIME_COORDINATION_BACKEND=postgresql` is set, which is typically only in multi-instance production deployments where clock skew is most likely to occur (different containers may have slightly different NTP sync states).

**Fix:** Use `getDbNowUncached()` at the start of each `withPgAdvisoryLock` transaction in `acquireSharedSseConnectionSlot` and `shouldRecordSharedHeartbeat`.

**Confidence:** Medium

---

### Carry-Over Items

- **Prior ARCH-2:** Stale-while-revalidate cache pattern duplication (LOW/LOW, deferred)
