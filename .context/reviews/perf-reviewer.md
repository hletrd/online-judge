# Performance Reviewer — RPF Cycle 7/100

**Date:** 2026-04-26
**Cycle:** 7/100
**Lens:** performance, concurrency, memory, hot paths, GC, cache efficiency, deploy-time cost

---

## Cycle-6 carry-over verification

All cycle-6 plan tasks confirmed at HEAD; no performance regressions detected.

Specific re-verification:
- `_lastRefreshFailureAt` Map is bounded by `analyticsCache` capacity (LRU max=100) via dispose hook. ✓ No unbounded growth.
- `analyticsCache` LRU max=100, TTL=60s — sufficient for typical workloads.
- Rate-limiter cooldown is 5s — keeps thundering-herd attempts to ≤1 per 5s per cache key.

---

## PERF7-1: [LOW, NEW] `deploy-docker.sh` Step 5b backfill ALWAYS spins up a `postgres:18-alpine` container — adds ~5-10s to every deploy, forever

**Severity:** LOW (operational performance — same as critic CRIT7-1)
**Confidence:** HIGH

**Evidence:**
- `deploy-docker.sh:570-596` Step 5b: `docker run --rm postgres:18-alpine psql ...` — runs every deploy.
- Image is cached on the deploy host after first pull. Cost: ~5-10s per deploy.
- DO-block uses `IF EXISTS` guard — work inside is a no-op when `secret_token` column is absent.

**Fix:** Same as CRIT7-1 — sunset the block after a documented retention period (e.g., 6 months).

**Exit criteria:** Sunset criterion documented.

**Carried-deferred status:** Defer (operational; cycle-6 fix prioritized correctness).

---

## PERF7-2: [LOW, NEW] `deploy-docker.sh` Step 6 `npm install --no-save drizzle-kit drizzle-orm nanoid` runs on every deploy — adds ~30s per deploy

**Severity:** LOW (deploy-time perf — same as cycle-5 deferred AGG5-13)
**Confidence:** HIGH

**Evidence:**
- `deploy-docker.sh:644`: `sh -c 'npm install --no-save drizzle-kit drizzle-orm nanoid 2>&1 | tail -1 && npx drizzle-kit push${PUSH_FORCE_FLAG}'`
- The container is `--rm`, so the `node_modules` cache is discarded. Every deploy re-installs.

**Fix:** Persist `node_modules` to a docker volume between deploys, OR build a custom drizzle-kit-runner image once and reuse.

**Exit criteria:** drizzle-kit push completes in <5s instead of ~30s.

**Carried-deferred status:** Defer per cycle-5 reasoning.

---

## PERF7-3: [LOW, NEW] `_lastRefreshFailureAt` Map's bound is INDIRECT via dispose-coupling — same as cycle-6 deferred AGG6-9

**Severity:** LOW (defense-in-depth)
**Confidence:** HIGH

**Evidence:**
- `route.ts:32` Map is bounded today only because all inserts come from a path that just attempted `analyticsCache.set`.
- A future feature (e.g., predictive cooldown without cache touch) would leak.

**Fix:** Add a maxSize wrapper to `_lastRefreshFailureAt` (e.g., LRU with max=200).

**Exit criteria:** Map has its own bound.

**Carried-deferred status:** Defer per cycle-6 reasoning.

---

## PERF7-4: [LOW, NEW] `anti-cheat-monitor.tsx` `performFlush` does sequential `await sendEvent()` — for typical pending queues of 5-10 events, this adds 250ms-500ms latency on flush

**Severity:** LOW (perceived performance — intentional for rate-limit; same caveat as CR7-2)
**Confidence:** HIGH

**Evidence:**
- `anti-cheat-monitor.tsx:67-80`: serial `for (event of pending)` with `await sendEvent(event)`.
- Worst-case (200 events, 50ms RTT): 10 seconds of sequential flush.

**Fix:** Send in chunks of 5 with `Promise.allSettled` instead of fully serial.

**Exit criteria:** Flush latency improved without rate-limit collisions.

**Carried-deferred status:** Defer (current behavior correct; perf optimization for edge case).

---

## PERF7-5: [LOW, NEW] `proxy.ts` `authUserCache` capacity-cleanup pass runs at 90% capacity (line 71-78) — iterates ALL entries to delete expired ones; on a hot proxy this is O(n) per set

**Severity:** LOW (worst-case O(n) cleanup — bounded by AUTH_CACHE_MAX_SIZE=500)
**Confidence:** HIGH

**Evidence:**
- `src/proxy.ts:71-78`: cleanup loop iterates all entries when size >= 90% of max.
- AUTH_CACHE_TTL_MS defaults to 2000ms — entries expire fast, so the 90% threshold is rarely hit.

**Fix:** Use `lru-cache` (already a dependency for analytics) instead of bare `Map` + custom eviction. LRU has O(1) eviction.

**Exit criteria:** Eviction is O(1) per set under all conditions.

**Carried-deferred status:** Defer (current behavior correct; rare edge case).

---

## PERF7-6: [LOW, NEW] `route.ts:189-191` cache-miss path calls `await getDbNowMs()` for the createdAt timestamp — adds a DB round-trip on cache miss

**Severity:** LOW (cache-miss-only — single DB call, negligible)
**Confidence:** HIGH

**Evidence:**
- `route.ts:188-191`:
  ```ts
  // Cache miss — compute fresh and populate cache
  const analytics = await computeContestAnalytics(assignmentId, true);
  analyticsCache.set(cacheKey, { data: analytics, createdAt: await getDbNowMs() });
  return apiSuccess(analytics);
  ```
- Cache-hit staleness check uses `Date.now()` (cycle-43 fix) for the same comparison. Asymmetry is mild.

**Fix (cosmetic):** Change line 190 to `Date.now()` for consistency with line 162.

**Exit criteria:** Cache-miss path has no DB round-trip beyond `computeContestAnalytics`.

**Carried-deferred status:** Defer (perf gain negligible; consistency improvement).

---

## Summary

**Cycle-7 NEW findings:** 0 HIGH, 0 MEDIUM, 6 LOW (all carried-deferable, mostly defensive).
**Cycle-6 carry-over status:** No performance regressions; cycle-6 deploy fix adds ~5-10s per deploy (acceptable trade-off).
**Performance verdict:** No hot-path performance issues at HEAD.
