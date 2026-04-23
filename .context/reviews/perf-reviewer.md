# Performance Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** perf-reviewer
**Base commit:** 54cb92ed

## Inventory of Files Reviewed

- `src/lib/assignments/contest-scoring.ts` — Contest ranking + stale-while-revalidate cache
- `src/lib/assignments/contest-analytics.ts` — Analytics caching
- `src/app/api/v1/contests/[assignmentId]/analytics/route.ts` — Analytics route caching
- `src/lib/realtime/realtime-coordination.ts` — SSE connection management
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE events route
- `src/lib/assignments/code-similarity.ts` — Code similarity (O(n^2) analysis)
- `src/lib/security/api-rate-limit.ts` — Rate limiting

## Previously Fixed Items (Verified)

- SSE stale threshold caching (5-minute TTL): PASS
- Contest stats CTE optimization: PASS
- Compiler execution concurrency limiter: PASS

## New Findings

No new performance findings. The existing deferred items remain accurate:

### Carry-Over Items

- **PERF-1:** SSE shared poll timer reads `getConfiguredSettings()` on restart (LOW/LOW, deferred)
- **PERF-2:** SSE connection eviction scan uses linear search (LOW/LOW, deferred — bounded by 1000 cap)
- **PERF-3:** Anti-cheat heartbeat gap query transfers up to 5000 rows (MEDIUM/MEDIUM, deferred — could use SQL window function)

---

### Note on `validateAssignmentSubmission` clock-skew fix

The cycle 45 fix (replacing `Date.now()` with `getDbNowUncached()`) adds one extra DB round-trip per submission validation call. However, this function already performs multiple DB queries (assignment lookup, enrollment check, exam session lookup), so the additional latency is negligible (<1ms over a typical DB connection). The correctness benefit outweighs the minimal latency cost. Verified this is acceptable.
