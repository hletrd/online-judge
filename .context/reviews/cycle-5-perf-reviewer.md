# Performance Reviewer — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** perf-reviewer

## Findings

### PERF-1: `getDbNow()` adds an extra DB round-trip per server render [LOW/MEDIUM]

**Files:**
- `src/lib/db-time.ts:14-17`
- `src/app/(auth)/recruit/[token]/page.tsx:40,65`

**Description:** `getDbNow()` executes `SELECT NOW()` on every call. While wrapped in `React.cache()` to deduplicate within a single server render, this adds an extra DB round-trip to every request that uses it. For the recruit page, which already queries the DB multiple times, this could be optimized by including `NOW()` as a column in one of the existing queries.

**Concrete failure scenario:** Under high load, the additional round-trip adds ~1-5ms latency per recruit page request.

**Fix:** Low priority. Consider including `NOW()` in an existing query (e.g., `SELECT ..., NOW() AS db_now FROM ...`) to avoid the extra round-trip. The current implementation is acceptable given `React.cache()` deduplication.

**Confidence:** MEDIUM

---

### PERF-2: `getContestsForUser` SQL uses `NOW()` in ORDER BY but JS uses `new Date()` for status [LOW/LOW]

**Files:**
- `src/lib/assignments/contests.ts:113-116`
- `src/lib/assignments/public-contests.ts:30,64-75`

**Description:** The `getContestsForUser` SQL query uses `NOW()` in its ORDER BY clause for sorting, but the returned data is then passed to `getContestStatus()` which uses `new Date()` for status determination. This is a minor inconsistency — the SQL uses DB time for ordering while the JS uses app-server time for status.

**Fix:** Very low priority. Pass DB time to `getContestStatus()` for consistency.

**Confidence:** LOW

---

## Verified Safe

- SSE connection tracking bounded by `MAX_TRACKED_CONNECTIONS` (1000) and `MAX_GLOBAL_SSE_CONNECTIONS` (500).
- Per-user connection counts use a `Map` for O(1) lookup.
- Shared polling timer batches all active submission queries into a single DB query.
- `React.cache()` used correctly for `getDbNow` and `getCachedInvitation`.
- Compiler execution uses `pLimit` to cap concurrent Docker containers.
- Submission rate limiting uses advisory locks to prevent concurrent bypass.
