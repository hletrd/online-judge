# Cycle 6 Performance Reviewer

**Date:** 2026-04-20
**Base commit:** 528cdf29

## Findings

### PERF-1: Contest detail page fetches assignment data without `getDbNow()` — extra query needed for DB time [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:188`
**Description:** The contest detail page uses `new Date()` instead of `getDbNow()`. If this is fixed to use `getDbNow()`, it adds one extra DB query (`SELECT NOW()`). However, `getDbNow()` uses `React.cache()` so the query is deduplicated within the same server render.
**Failure scenario:** Negligible performance impact — React.cache() deduplicates the query.
**Fix:** No performance concern. Use `getDbNow()` for correctness.
**Confidence:** LOW

### PERF-2: Student dashboard queries could be parallelized further [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/_components/student-dashboard.tsx:27-95`
**Description:** The progress stats query (line 27), language stats query (line 48), and the recentSubmissions + studentAssignments parallel query (line 59) are executed sequentially. The progress stats and language stats are independent and could run in parallel with each other and with the line 59 queries.
**Failure scenario:** Minor latency increase on student dashboard loads.
**Fix:** Wrap all independent queries in `Promise.all()`.
**Confidence:** LOW

## Verified Safe

- SSE connection tracking is bounded by MAX_TRACKED_CONNECTIONS (1000). O(n) eviction is acceptable.
- React.cache() deduplication in `getDbNow()` avoids redundant SELECT NOW() queries within a single render.
- Import/export streaming avoids loading entire database into memory.
