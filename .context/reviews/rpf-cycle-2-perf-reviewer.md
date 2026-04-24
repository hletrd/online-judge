# RPF Cycle 2 (loop cycle 2/100) — Performance Reviewer

**Date:** 2026-04-24
**HEAD:** fab30962
**Reviewer:** perf-reviewer

## Scope

Reviewed performance-relevant code across:
- src/lib/compiler/execute.ts — Docker container execution, concurrency limiter
- src/lib/security/rate-limit.ts — DB-backed rate limiting, FOR UPDATE row locks
- src/lib/security/api-rate-limit.ts — API rate limiting, sidecar pre-check
- src/app/api/v1/submissions/[id]/events/route.ts — SSE connection coordination
- src/lib/realtime/realtime-coordination.ts — PostgreSQL advisory locks
- src/lib/assignments/contest-scoring.ts — stale-while-revalidate cache
- src/lib/assignments/leaderboard.ts — leaderboard computation
- src/proxy.ts — auth user cache with TTL

## New Findings

**No new findings this cycle.**

## Performance Observations (Re-verified)

1. Compiler concurrency — pLimit caps parallel containers to CPU count - 1.
2. Rate limit sidecar — Two-tier: sidecar fast path + authoritative DB check. Sidecar fail-open.
3. SSE connection tracking — userConnectionCounts map for O(1) per-user count lookup. O(n) stale eviction is known deferred (AGG-6, LOW/LOW).
4. SSE stale threshold cache — 5-minute TTL avoids unnecessary DB queries.
5. Auth proxy cache — FIFO with 500-entry cap. 2s TTL. Negative results not cached.

## Deferred Item Status (Unchanged)

- AGG-2: atomicConsumeRateLimit uses Date.now() in hot path — MEDIUM/MEDIUM, deferred
- AGG-6: SSE O(n) eviction scan — LOW/LOW, deferred
- PERF-3: Anti-cheat heartbeat gap query transfers up to 5000 rows — MEDIUM/MEDIUM, deferred
- ARCH-3: Stale-while-revalidate cache pattern duplication — LOW/LOW, deferred
- AGG-8: Global timer HMR pattern duplication — LOW/MEDIUM, deferred

## Confidence

HIGH
