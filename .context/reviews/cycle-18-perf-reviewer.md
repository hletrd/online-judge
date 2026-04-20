# Cycle 18 Performance Reviewer Findings

**Date:** 2026-04-19
**Reviewer:** Performance, concurrency, CPU/memory/UI responsiveness
**Base commit:** 7c1b65cc

---

## Findings

### F1: `getRecruitingAccessContext` is called 2-3 times per dashboard page load — redundant DB queries

- **File**: `src/lib/recruiting/access.ts:14-66`
- **Severity**: MEDIUM
- **Confidence**: HIGH
- **Description**: Same as code-reviewer F1. `getRecruitingAccessContext` performs two DB queries (recruitingInvitations + assignmentProblems) on every call. It is called from the dashboard layout AND from individual page components, meaning 4-6 DB queries per page load that return identical data. With React Server Components, the layout and page run in the same server render, so a request-scoped cache would eliminate all duplicates.
- **Concrete failure scenario**: During a recruiting contest, 200 candidates refresh the contest page simultaneously. Each page load triggers 6 recruiting-context queries (2 per call x 3 calls). Total: 1,200 DB queries, of which 800 are redundant.
- **Suggested fix**: Use React `cache()` to deduplicate within a single render, or pass the context from layout to page via props.

### F2: `contest-analytics.ts` student progression computation is not parallelized with other analytics queries

- **File**: `src/lib/assignments/contest-analytics.ts:241-276`
- **Severity**: LOW
- **Confidence**: MEDIUM
- **Description**: The student progression query (line 242-251) is only executed when `includeTimeline` is true and runs AFTER the parallel batch at line 180. It could be included in the `Promise.all` batch since it doesn't depend on the other query results. The progression computation also iterates over all submissions to build per-user Maps in JS, which could be done more efficiently in SQL.
- **Concrete failure scenario**: A large contest with 1,000 submissions has analytics requested with `includeTimeline=true`. The progression query adds an extra sequential DB round-trip (50-100ms) that could have been parallelized.
- **Suggested fix**: Add the progression query to the `Promise.all` batch at line 180.

### F3: `streamDatabaseExport` uses 50ms polling loop for backpressure — wastes CPU cycles

- **File**: `src/lib/db/export.ts:32-43`
- **Severity**: LOW
- **Confidence**: HIGH
- **Description**: The `waitForReadableStreamDemand` function polls `controller.desiredSize` every 50ms when the stream is backpressured. For large exports on a slow connection, this can result in thousands of unnecessary `setTimeout` + `desiredSize` checks. A more efficient approach would be to use a promise-based notification when the stream becomes ready.
- **Concrete failure scenario**: Exporting a 500 MB database over a slow 1 Mbps connection. The stream is frequently backpressured. The polling loop fires every 50ms, checking `desiredSize` ~20 times per second for minutes, even though the stream only becomes writable once every few seconds.
- **Suggested fix**: Replace the polling loop with a promise that resolves when `desiredSize > 0`. This could use `controller.enqueue()` in a try/catch or a custom notification mechanism.

---

## Verified Safe

### VS1: SSE connection tracking is O(1) for per-user count lookups
- `userConnectionCounts` Map provides O(1) lookup. Previous cycle finding about O(n) iteration has been fixed.

### VS2: Contest ranking cache is properly implemented with stale-while-revalidate
- LRU cache with 30s TTL and 15s stale threshold, plus background refresh with failure cooldown. Good pattern.

### VS3: Docker container execution is properly concurrency-limited
- `executionLimiter` caps parallel containers to `cpus().length - 1`. No risk of container explosion.

### VS4: API rate limiting uses two-tier strategy (sidecar + DB)
- Sidecar pre-check avoids DB transaction on fast path. DB is source of truth for persistence.
