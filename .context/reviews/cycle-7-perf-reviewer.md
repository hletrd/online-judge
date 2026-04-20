# Performance Reviewer — Cycle 7 Deep Review

**Date:** 2026-04-20
**Scope:** Performance, concurrency, CPU/memory/UI responsiveness

---

## Findings

### MEDIUM 1 — SSE connection tracking eviction uses O(n) linear scan

**Confidence:** HIGH
**Files:**
- `src/app/api/v1/submissions/[id]/events/route.ts:44-55`

**Problem:** The `addConnection()` function evicts the oldest entry when `connectionInfoMap.size >= MAX_TRACKED_CONNECTIONS` by iterating through the entire map to find the minimum `createdAt`. This is O(n) for each eviction. With `MAX_TRACKED_CONNECTIONS = 1000`, and high SSE churn (short-lived connections), this linear scan runs frequently. The per-user count index (`userConnectionCounts`) is already O(1), but the eviction path remains O(n).

**Concrete failure scenario:** Under heavy SSE traffic, each eviction requires scanning up to 1000 entries. With rapid connection churn, this could cause GC pressure and event loop blocking.

**Suggested fix:** Use a min-heap or sorted data structure for eviction, or track insertion order with a doubly-linked list for O(1) eviction of the oldest entry.

---

### MEDIUM 2 — Anti-cheat heartbeat LRU cache has 10K entry cap with 120s TTL but no memory bound

**Confidence:** MEDIUM
**Files:**
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:17`

**Problem:** `lastHeartbeatTime` is an LRU cache with `max: 10_000, ttl: 120_000`. Each entry is a short string key (`assignmentId:userId`) and a number timestamp. At 10K entries, this is ~2MB at most. However, the TTL is only 120 seconds, meaning entries accumulate quickly during large exams. Under normal load this is fine, but if `maxSseConnectionsPerUser` is high and many concurrent exams run, the cache could churn rapidly.

**Suggested fix:** This is acceptable as-is. No fix needed for the current scale.

---

### LOW 1 — Shared SSE poll timer queries ALL active submission IDs in one batch

**Confidence:** LOW
**Files:**
- `src/app/api/v1/submissions/[id]/events/route.ts:152-183`

**Problem:** `sharedPollTick()` queries ALL active submission IDs in a single `SELECT ... WHERE id IN (...)` query. With many active submissions, this could create a large IN clause. The query itself is simple and indexed, but the result set and the subsequent per-subscriber dispatch loop could be slow.

**Suggested fix:** If the number of active submissions grows beyond a few hundred, consider batching the query or using a more efficient notification mechanism (e.g., PostgreSQL LISTEN/NOTIFY).

---

## Final sweep

No additional performance-critical findings. The `pLimit`-based concurrency control in `compiler/execute.ts` is appropriate. The `React.cache()` usage in `getDbNow()` correctly deduplicates DB time queries within a single server render.
