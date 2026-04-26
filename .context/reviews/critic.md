# Critic Lane - Cycle 1

**Date:** 2026-04-26
**Angle:** Multi-perspective critique of design decisions and tradeoffs

## Critique CRI-1: Date.now() staleness optimization is a pragmatic but fragile design choice

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:56-62`

**The tradeoff:** Eliminate one DB round-trip per cache-hit request by using `Date.now()` instead of `getDbNowMs()`. The reasoning: for a 30-second staleness window, 1-2s of clock skew is acceptable.

**The concern:** This creates an architectural inconsistency. The rest of the codebase uses `getDbNowMs()` for all server-side time comparisons (rate limits, claim times, deadlines). By introducing Date.now() in this one place, the codebase now has two different time authorities:
- DB time: rate limits, judge claims, deadlines, cache writes
- App-server time: cache staleness checks

If the DB and app server clocks diverge significantly (e.g., NTP failure on one node), this route's behavior becomes unpredictable while other routes continue functioning correctly. The risk is low (30s tolerance) but the inconsistency is a design smell.

**Alternative:** Accept the DB round-trip cost and use `getDbNowMs()` throughout, keeping the architecture consistent. The cost is one `SELECT NOW()` query per request — typically <1ms on a local PostgreSQL instance. Was this optimization actually needed, or premature?

**Verdict:** Pragmatic for the specific case (analytics cache staleness is not a correctness-critical check), but the inconsistency is worth noting.

---

## Critique CRI-2: scheduleRetryRef pattern is elegant but tests are now required to validate it

**File:** `src/components/exam/anti-cheat-monitor.tsx:118-145`

**The redesign:** The retry scheduling logic is extracted into a `useRef` callback that's updated in a `useEffect`. Both `flushPendingEvents` and `reportEvent` delegate to it. This DRY-s up the code nicely.

**The concern:** This is a complex React pattern. The ref + useEffect pattern is correct (the ref holds the latest closure), but:
1. It's16 hard to unit test independently — the retry scheduling is2 coupled to the ref lifecycle
2. If someone adds a third caller without understanding the ref pattern, they might call `scheduleRetryRef.current` outside of the useEffect update window (before the first render)
3. The initial value is `() => {}` — calling this before the useEffect runs is effectively a no-op

**Alternative:** Extract the retry scheduling logic into a standalone module-level function that takes `performFlush` as a parameter. This would be independently testable and doesn't rely on React ref lifecycle.

**Verdict:** The current pattern works correctly, but the testability and maintainability concerns are real. Consider extracting to a module-level function in a future cleanup.

---

## Critique CRI-3: getAuthSessionCookieNames() abstraction is minimal value for 1 callsite

**File:** `src/lib/security/env.ts:178-180`

**The change:** Replace two hardcoded strings with a function that returns an object containing those same two strings, derived from module constants.

**The benefit:** If the cookie naming convention changes, only one place needs updating.

**The concern:**
1. Single callsite — the abstraction doesn't reduce duplication (there was no duplication to begin with)
2. The function returns constants — no dynamic behavior, no framework integration
3. Adds an import and function call indirection for a simple string lookup
4. The related function `getAuthSessionCookieName()` is dynamic (checks HTTPS context), creating confusion — both sound similar but behave differently

**Alternative:** Keep the constants in env.ts as before, or export them directly. The current approach adds a layer that doesn't earn its keep.

**Verdict:** Low-risk change, but the abstraction-to-value ratio is unfavorable. If more callsites emerge, it'll justify itself.

---

## Critique CRI-4: Async IIFE with nested try/catch/finally is overly complex

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:76-99`

**The pattern:**
```
(async () => {
  try {
    // happy path
  } catch {
    try {
      // fallback
    } catch {
      // fallback of fallback
    }
  } finally {
    // cleanup
  }
})().catch(() => { // third-level catch
});
```

Three levels of error handling for a background refresh. Each level has a purpose:
1. Inner try: compute analytics
2. Inner catch: set cooldown (try DB time, fallback to Date.now())
3. Outer catch: swallow unhandled rejection from getDbNowMs()

**The concern:** This is hard to read and reason about. A simpler approach:
```typescript
async function refreshCache(assignmentId: string, cacheKey: string) {
  try {
    const fresh = await computeContestAnalytics(assignmentId, true);
    analyticsCache.set(cacheKey, { data: fresh, createdAt: await getDbNowMs() });
    _lastRefreshFailureAt.delete(cacheKey);
  } catch {
    try { _lastRefreshFailureAt.set(cacheKey, await getDbNowMs()); }
    catch { _lastRefreshFailureAt.set(cacheKey, Date.now()); }
    logger.error({ assignmentId }, "[analytics] Failed to refresh analytics cache");
  }
}
```

This eliminates the IIFE + outer catch pattern and makes the control flow clearer.

**Verdict:** Not a bug, but the complexity is a maintainability concern. Consider extracting to a named async function.

---

## Summary

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| CRI-1 | Time source inconsistency | MEDIUM | MEDIUM |
| CRI-2 | Complex ref pattern for retry | LOW | MEDIUM |
| CRI-3 | Low-value abstraction | LOW | HIGH |
| CRI-4 | Nested error handling complexity | LOW | MEDIUM |

Total: 4 critiques. No blocking issues. All can be addressed in follow-up refactoring.
