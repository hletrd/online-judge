# Debugger Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Scope:** latent bug surface, failure modes, regressions, defensive code review

## Findings

### DBG4-1: [LOW] `dispose` hook on `analyticsCache` triggers on `set` (overwrite), potentially clearing freshly-stored cooldown

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:34-47`

The `dispose` callback fires on five reasons: `evict`, `set` (overwrite), `delete`, `expire`, `fetch`. The current implementation correctly handles four of those. But on `set` (overwriting an existing entry), the sequence inside `refreshAnalyticsCacheInBackground` is:

1. `analyticsCache.set(cacheKey, { data: fresh, ... })` (line 70) — fires `dispose` on the old entry, which calls `_lastRefreshFailureAt.delete(key)`.
2. `_lastRefreshFailureAt.delete(cacheKey)` (line 71) — explicit delete of cooldown.

That's two deletes of the same key, both correct. But if a refresh **fails**, the catch block sets `_lastRefreshFailureAt.set(cacheKey, Date.now())` on line 75. The dispose hook does NOT fire on this path because no `analyticsCache.set` occurs in the catch — confirmed by reading the code.

The risk is more subtle: imagine a future contributor adds `analyticsCache.set(cacheKey, { ...stale, error: true })` to the catch block to mark stale cache for some reason. The dispose hook would fire, deleting the *just-set* cooldown entry. The cooldown becomes useless.

The doc comment at lines 38-46 already calls this out clearly:
> If it was a failure, the catch-block writes a fresh entry to this map *after* the dispose hook fires, preserving the cooldown signal.

So the contract is documented and currently safe. **But** the comment talks about the *current* failure path; if a future change sets the cache in the catch, the comment becomes stale silently.

**Failure scenario:** Future feature: "mark cache entries as known-stale after error." Engineer adds `analyticsCache.set(cacheKey, { data: cached.data, createdAt: 0 })` in the catch block. Cooldown silently fails to register because the dispose hook now eats it.

**Fix:** Add a defensive comment in the catch block: `// IMPORTANT: do not call analyticsCache.set() here — it would dispose the cooldown timestamp via the LRU dispose hook.` Or use a `disposeAfter` instead of `dispose` (the lru-cache library distinguishes them) — but disposeAfter has subtle ordering rules; current dispose is the right primitive.

**Exit criterion:** Comment in the catch block warning future contributors not to set the cache there.

---

### DBG4-2: [LOW] Test "respects cooldown" assumes `vi.runAllTimersAsync()` drains the detached promise

**Severity:** LOW | **Confidence:** HIGH | **File:** `tests/unit/api/contests-analytics-route.test.ts:194,216,226`

The test now has comments explaining the behavior, which is great. Still a fragile pattern: if Vitest 5 changes the semantics of `runAllTimersAsync` (which is a known evolving API across Vitest 3 → 4 → 5), the test will fail to wait for the detached `.catch` chain. The test would either time out, race, or pass spuriously depending on the new semantics.

**Failure scenario:** Vitest 5 release breaks `runAllTimersAsync` into separate "drain timers" and "drain microtasks" functions. The test starts hanging in CI.

**Fix:** Pin Vitest version (already done in package.json). Add a `// TODO(vitest5): re-validate microtask drain semantics on upgrade` comment near each call. Defensive.

**Exit criterion:** N/A this cycle (cosmetic).

---

### DBG4-3: [LOW] Heartbeat scheduling does not detect `document.hidden` until the timer fires

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/components/exam/anti-cheat-monitor.tsx:200-221`

The heartbeat `setTimeout` schedules itself recursively. The check `document.visibilityState === "visible"` occurs only when the timer fires. If the user closes/hides the tab right after the timer is scheduled, the timer still fires (modern browsers throttle but don't always cancel), and the heartbeat fires while hidden. The visibility check then suppresses the actual `reportEventRef.current("heartbeat")` call. So no spurious heartbeat is sent. Correct.

But: if the timer is *throttled* (Chrome throttles `setTimeout` in background tabs to 1 minute minimum), the next heartbeat fires far later than 30 seconds. The user sees a long gap in audit logs. This is by design (Chromium's throttling, not our bug), but operators may interpret the gap as a missed heartbeat / network issue.

**Fix:** Use `requestIdleCallback` for non-critical heartbeats, or accept the throttled cadence. Defer.

**Exit criterion:** Document the throttling behavior in the audit-log doc, or N/A.

---

### DBG4-4: [LOW] `proxy.ts` does not clear `LOCALE_COOKIE_NAME` on logout

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/proxy.ts:87-97`

`clearAuthSessionCookies` clears only the auth session cookies. The locale cookie persists across login/logout, which is by design (a returning user should keep their preferred locale). But if a user reports "I'm seeing a stuck locale," there's no UI path to clear it. The login page won't reset it; logout doesn't reset it.

This is a UX edge case, not a bug. But worth flagging.

**Fix:** No code change. Document in user-facing FAQ if it ever becomes an issue.

**Exit criterion:** N/A.

---

### DBG4-5: [INFO] Cycle 3 fixes verified

The new dispose-hook test (`evicts cooldown metadata when the cache entry is removed (dispose hook)`) at `tests/unit/api/contests-analytics-route.test.ts:230-248` is a tight, targeted regression guard. Asserts both the cooldown plant and the dispose-driven cleanup. Solid.

The retry-scheduling refactor in `anti-cheat-monitor.tsx` (cycle 1-3 commits) eliminates the duplicated load-send-save logic via `performFlush`. The single source of truth is now `scheduleRetryRef.current` set in a `useEffect`. Behavior is correct based on read-through.

**No action.**

---

## Confidence Summary

- DBG4-1: MEDIUM (depends on future change patterns).
- DBG4-2: HIGH (Vitest API churn historical pattern).
- DBG4-3: MEDIUM (browser-throttling reality, no current bug).
- DBG4-4: HIGH (intentional behavior, edge-case noted).
- DBG4-5: HIGH (informational).
