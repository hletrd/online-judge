# Tracer Review — RPF Cycle 7/100

**Date:** 2026-04-26
**Cycle:** 7/100
**Lens:** causal tracing of suspicious flows, competing hypotheses, control-flow analysis

---

## Cycle-6 carry-over verification

The cycle-6 critical fix (Step 5b backfill in deploy-docker.sh) is correctly implemented. Tracer re-verifies the causal chain:

1. **Trigger:** Deploy invokes `deploy-docker.sh`.
2. **Step 5 (DB ready):** Postgres container becomes healthy.
3. **Step 5b (cycle-6 fix):** psql container starts, runs DO-block.
   - DO-block guard: `IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'judge_workers' AND column_name = 'secret_token') THEN ...`
   - When column EXISTS: backfill any NULL secret_token_hash from secret_token via `encode(sha256(...), 'hex')`.
   - When column GONE (already migrated): no-op.
4. **Step 6 (drizzle-kit push):** synthesizes DDL from schema.pg.ts vs DB. With or without `--force`, the destructive `ALTER TABLE judge_workers DROP COLUMN secret_token` either applies (force) or is skipped (no-force).
5. **End state:** All workers with valid plaintext tokens now have hashes; none are orphaned.

The causal chain is sound. No traces of partial failure.

---

## TRC7-1: [LOW, NEW] Trace the `_lastRefreshFailureAt` mutation lifecycle across TTL boundaries — three mutation sites, dispose-coupling, and TTL eviction form a non-trivial state machine

**Severity:** LOW (verification of correctness, not a bug)
**Confidence:** HIGH

**Evidence (causal trace):**
1. **t=0:** Cache miss. `analyticsCache.set(key, entry)` populates cache. `_lastRefreshFailureAt` is empty.
2. **t=30s:** Stale-revalidate. `refreshAnalyticsCacheInBackground` invoked. `_refreshingKeys.add(key)`.
3. **t=30.1s:** `computeContestAnalytics` throws. Catch-block sets `_lastRefreshFailureAt.set(key, Date.now())`.
4. **t=30.2s:** Subsequent request. Cache-hit, age=30.2s > 30s. Cooldown check: `nowMs - lastFailure = 100ms < 5000ms`. Refresh skipped. ✓
5. **t=60s:** Cache TTL expires. `analyticsCache` evicts. Dispose fires: `_lastRefreshFailureAt.delete(key)`. Cooldown is GONE.
6. **t=60.1s:** Next request. Cache miss → fresh compute → cache.set. Cooldown gone. If compute throws again, catch-block sets cooldown again. ✓

**Edge case (TTL during refresh):** If TTL expires DURING a refresh:
- lru-cache default `updateAgeOnGet: false` — get does NOT extend the entry. Entry expires at t=60s mid-refresh.
- During the gap, a SECOND request comes in. Cache.get returns the current entry. Stale check triggers a SECOND refresh — but `_refreshingKeys.has(key)` = true, so it short-circuits. ✓
- At t=60s: dispose fires: `_lastRefreshFailureAt.delete(key)`. First refresh still in flight.
- At t=60.1s: First refresh completes successfully. `analyticsCache.set(key, freshEntry)` — FRESH set after dispose. Then `_lastRefreshFailureAt.delete(cacheKey)` no-op. ✓

**Conclusion:** No bug. The causal trace confirms state-machine correctness across TTL boundaries.

**Carried-deferred status:** Resolved at verification.

---

## TRC7-2: [LOW, NEW] Trace the `anti-cheat-monitor.tsx` retry timer lifecycle — the timer is cleared in the cleanup effect, but `scheduleRetryRef.current` is replaced via a separate effect; on `performFlush` identity change, in-flight timer holds stale closure

**Severity:** LOW (theoretical — assignmentId stable in practice)
**Confidence:** MEDIUM

**Evidence (causal trace):**
- Line 109's effect REPLACES `scheduleRetryRef.current` whenever `performFlush` identity changes (deps: `[performFlush]`).
- `performFlush` deps: `[assignmentId, sendEvent]` (line 80). `sendEvent` deps: `[assignmentId]` (line 60).
- An in-flight timer's closure captured the OLD `performFlush`. When the effect re-runs, the timer is NOT cleared.

**Trace conclusion:** Mid-life `assignmentId` change is theoretically problematic — OLD timer would post events to OLD endpoint. But `assignmentId` is set once per page mount and doesn't change without unmount.

**Fix (defensive):** Clear `retryTimerRef` in the cleanup of line 109's effect:
```ts
useEffect(() => {
  scheduleRetryRef.current = ...;
  return () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };
}, [performFlush]);
```

**Exit criteria:** Stale-closure risk on assignmentId change is eliminated.

**Carried-deferred status:** Defer (assignmentId is stable in practice).

---

## TRC7-3: [LOW, NEW] Trace the `proxy.ts` token-validation flow — cache key includes `authenticatedAt`; legacy tokens with NULL authenticatedAt share `${userId}:` cache key

**Severity:** LOW (cache-key collision for legacy tokens — bounded by AUTH_CACHE_TTL_MS=2s)
**Confidence:** HIGH

**Evidence:**
- `src/proxy.ts:267`: `const cacheKey = ${userId}:${authenticatedAtSeconds ?? ""};` — when `authenticatedAtSeconds` is null, key is `${userId}:`.
- All requests from the same user with NULL authenticatedAt share this key. Cache stores ONE user object, returned for 2s.

**Why it's worth tracking:** Within 2s, a revoked legacy user can still authenticate. Per the security tradeoff comment at lines 19-22, this is documented and accepted.

**Fix:** No action — documented tradeoff.

**Carried-deferred status:** Resolved at verification.

---

## Summary

**Cycle-7 NEW findings:** 0 HIGH, 0 MEDIUM, 3 LOW (TRC7-1 / TRC7-3 resolved at verification; TRC7-2 deferable).
**Cycle-6 carry-over status:** All cycle-6 fixes hold. Causal chains are sound across all surfaces traced.
**Tracer verdict:** No control-flow defects at HEAD.
