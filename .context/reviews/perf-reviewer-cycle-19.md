# Perf Reviewer — Cycle 19

**Date:** 2026-04-24
**Base commit:** f1817fdf

---

## Findings

### P-1: [LOW] `batchedDelete` in `data-retention-maintenance.ts` Uses Sequential Batches Without Index Hint — Potential Table Scan on Each Iteration

**File:** `src/lib/data-retention-maintenance.ts:22-23`
**Confidence:** LOW

The `batchedDelete` function uses `ctid IN (SELECT ctid FROM ... WHERE ${whereClause} LIMIT 5000)`. This is a common PostgreSQL pattern for batched deletes, and `ctid` is the physical row locator so the delete itself is fast. However, the inner `SELECT ctid` may perform a sequential scan on each iteration if the `WHERE` clause column doesn't have a suitable index leading column.

For `submissions`, the `submissions_retention_idx` index on `(submittedAt, status)` supports this well. For `antiCheatEvents`, the `ace_assignment_created_idx` on `(assignmentId, createdAt)` may not be optimal for a pure `createdAt < cutoff` filter since `assignmentId` is the leading column.

In practice, the `antiCheatEvents` table is typically small enough that this doesn't matter, and the 100ms delay between batches mitigates lock contention.

**Fix:** Low priority. Add an index on `antiCheatEvents.createdAt` alone if the table grows large, or accept the current behavior since pruning runs on a 24-hour timer.

---

### P-2: [LOW] Proxy Auth Cache Cleanup Iterates All Entries on Every `setCachedAuthUser` Call

**File:** `src/proxy.ts:68-75`
**Confidence:** LOW

The fix from cycle 18b (AGG-6) added expired entry cleanup in `setCachedAuthUser`. However, the cleanup iterates ALL entries in the cache on every `set` call when `size > 0`. Under high traffic with 500+ active users, this means iterating 500+ entries on every authenticated request just to find a few expired ones.

The `getCachedAuthUser` function already deletes expired entries on read (line 60). The `setCachedAuthUser` cleanup is redundant for entries that will be read soon, and wasteful for entries that won't be read again.

**Concrete failure scenario:** 500 concurrent users. Each request calls `setCachedAuthUser` after a DB lookup. The cleanup iterates 500+ entries each time, adding ~0.1ms per request. Under 100 req/s, this adds ~10ms/s of CPU time.

**Fix:** Only run cleanup when `size >= AUTH_CACHE_MAX_SIZE * 0.9` (i.e., when eviction is imminent) rather than on every set. Or use a separate periodic cleanup like the in-memory rate limiter's `maybeEvict()` pattern.

---

## Verified Safe

### VS1: Database connection pooling is properly configured
The `pool` object in `src/lib/db/index.ts` uses `pg.Pool` with appropriate defaults.

### VS2: LRU caches are properly bounded
`contest-scoring.ts` ranking cache: max 50 entries. `anti-cheat/route.ts` heartbeat cache: max 10,000 entries. Both use `lru-cache` with TTL.

### VS3: Streaming export respects backpressure
`waitForReadableStreamDemand()` checks `controller.desiredSize` before enqueuing data, preventing memory bloat on large exports.
