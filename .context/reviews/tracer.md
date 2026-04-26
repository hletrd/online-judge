# Tracer Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Method:** causal tracing of suspicious flows; competing-hypothesis evaluation

## Trace Targets

- Analytics route cache + cooldown lifecycle
- Anti-cheat monitor retry scheduling chain
- Proxy session-cookie clearing flow

## Trace 1: Analytics Cache + Cooldown Lifecycle

**Hypothesis A (current):** `_lastRefreshFailureAt` cannot grow unbounded because the LRU `dispose` hook fires on every entry-loss.

**Trace:**
1. `analyticsCache.delete(key)` → `dispose(value, key, 'delete')` → `_lastRefreshFailureAt.delete(key)`. ✓
2. TTL expiry → internal cleanup → `dispose(value, key, 'expire')` → `_lastRefreshFailureAt.delete(key)`. ✓
3. Capacity eviction → `dispose(value, key, 'evict')` → `_lastRefreshFailureAt.delete(key)`. ✓
4. Overwrite via `analyticsCache.set(key, newVal)` → `dispose(oldVal, key, 'set')` fires BEFORE the new value is committed → `_lastRefreshFailureAt.delete(key)`. ✓

**Hypothesis B (cycle 3 was wrong):** The dispose-on-`set` fires AFTER the new value is committed, leading to out-of-order delete.

**Verification:** The lru-cache library docs and source confirm `dispose` for the previous value runs synchronously before the new value is committed. Test added in cycle 3 (`evicts cooldown metadata when the cache entry is removed (dispose hook)`) validates the contract for `delete`. The contract for `set` overwrites is implicit but documented in code comments.

**Verdict:** Hypothesis A holds. **No bug.**

---

## Trace 2: Anti-Cheat Retry Scheduling Chain

**Hypothesis A (current):** `scheduleRetryRef.current` is the single source of truth for retry scheduling; both `flushPendingEvents` and `reportEvent` delegate to it correctly.

**Trace flow on `reportEvent` failure path:**
1. `reportEvent("tab_switch")` → `sendEvent` returns false → enters `if (!ok)` branch (line 172).
2. `pending = loadPendingEvents()` → loads array.
3. `pending.push({ ...event, retries: 1 })` → adds new event with retries=1.
4. `savePendingEvents(assignmentId, pending)`.
5. `scheduleRetryRef.current(pending)` (line 179) → executes the closure stored in scheduleRetryRef.current.
6. Inside the closure: `hasRetriable = pending.some(e => e.retries < MAX_RETRIES)` → true (retries=1, MAX=3).
7. `if (hasRetriable && !retryTimerRef.current)` → enters branch.
8. `maxRetry = pending.reduce(...)` → max retries among pending = 1.
9. `backoffDelay = Math.min(1000 * 2^1, 30000) = 2000ms`.
10. `setTimeout` set for 2000ms.

**Hypothesis B:** scheduleRetryRef may hold a stale closure if `useEffect` doesn't re-run when expected.

**Trace:** scheduleRetryRef is updated in `useEffect(() => { scheduleRetryRef.current = (...) => {...}; }, [performFlush])`. `performFlush` itself is a `useCallback` with deps `[assignmentId, sendEvent]`. `sendEvent` deps are `[assignmentId]`. So scheduleRetryRef.current reflects the latest `performFlush` whenever `assignmentId` (or sendEvent) changes. In practice, `assignmentId` doesn't change in component lifetime today (the component is keyed on it).

**Stale-closure check:** scheduleRetryRef.current's closure captures `performFlush` from its useEffect run. Inside the timer callback (line 148-152), it calls `await performFlush()` and then recursively `scheduleRetryRef.current(retryRemaining)`. Both refer to the latest version (via `.current`).

**Verdict:** Hypothesis A holds. **No bug.**

**Edge case noted:** If the React tree unmounts while a timer is pending, the cleanup at line 298-301 clears the timer. But `scheduleRetryRef.current` itself is never reset. If the component re-mounts, it will see the closure from the previous mount. This is unlikely to cause issues because (a) `assignmentId` is the same and (b) `useEffect` re-runs and re-assigns scheduleRetryRef.current. But it's a theoretical artifact worth a comment.

---

## Trace 3: Proxy Session-Cookie Clearing

**Hypothesis A (current):** `clearAuthSessionCookies` clears both the secure and non-secure variants on every code path that triggers it.

**Trace call sites:**
1. `proxy.ts:295` — `isAuthPage && token && !activeUser` → user has token but no active record → clear cookies + render auth page.
2. `proxy.ts:312` — `(isProtectedRoute || isChangePasswordPage) && !activeUser && isApiRoute && !hasApiKeyAuth` → return 401 + cleared cookies.
3. `proxy.ts:318` — same precondition but not API route → redirect to /login + cleared cookies.

In each case, `clearAuthSessionCookies` calls `response.cookies.set(name, "", { maxAge: 0, path: "/" })` for non-secure, and `response.cookies.set(secureName, "", { maxAge: 0, path: "/", secure: true })` for secure.

**Hypothesis B:** The clear-via-empty-string-with-maxAge-0 idiom may not work in all Next.js versions or browser versions.

**Trace:** Per RFC 6265, setting a cookie with `Max-Age=0` and an empty value causes the browser to expire it immediately. Next.js's `response.cookies.set(name, value, options)` translates this to a `Set-Cookie` header with `Max-Age=0; Path=/`. This is the standard expiration pattern.

**Verdict:** Hypothesis A holds. **No bug.** Carried deferred SEC4-1 (`__Secure-` over HTTP) is a separate dev-environment edge.

---

## Trace 4: Analytics Background Refresh Race (cross-trace check)

Two simultaneous GET requests for the same `assignmentId`, both seeing stale cache. Hypothesis: the dedup guard `_refreshingKeys.has(cacheKey)` prevents duplicate background refreshes.

**Trace:**
1. Request A enters route handler. Cache hit, age > STALE. `_refreshingKeys.has(key) === false`, `nowMs - lastFailure >= COOLDOWN_MS` (no recent failure).
2. Request A: `_refreshingKeys.add(key)`. Then `refreshAnalyticsCacheInBackground(...)` (no await).
3. Request A returns the stale data.
4. Request B enters. Cache hit, age > STALE. `_refreshingKeys.has(key) === true`. Skips refresh.
5. Request B returns the stale data.
6. Eventually Request A's background refresh resolves: cache.set() updates the entry, `_refreshingKeys.delete(key)` in finally.

**Test coverage:** `tests/unit/api/contests-analytics-route.test.ts:142-176` ("triggers exactly one background refresh when cache is stale (in-progress dedup)"). Validated.

**Verdict:** **No bug.**

---

## Findings (Issues to Surface)

### TRC4-1: [LOW] scheduleRetryRef.current outlives component unmount

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/components/exam/anti-cheat-monitor.tsx:142-155`

The `useEffect` that assigns `scheduleRetryRef.current` does not have a cleanup that resets it on unmount. After unmount, scheduleRetryRef.current still holds a closure from the unmounted render. If the component re-mounts (e.g., navigation to/from the exam page), the previous closure runs first until the new useEffect runs and overwrites it.

In practice this is benign because: (a) `retryTimerRef` is cleared on unmount (line 298-301), so no pending timer survives; (b) the closure captures `performFlush` which itself captures `assignmentId` and `sendEvent` from the previous render — but these are stable per-mount.

**Failure scenario (theoretical):** If a future change makes the closure depend on something that *should* reset on remount (e.g., a session token), the stale closure would use the old value briefly until the useEffect runs.

**Fix:** Add a cleanup function:
```ts
useEffect(() => {
  scheduleRetryRef.current = (...) => { ... };
  return () => {
    scheduleRetryRef.current = () => {};
  };
}, [performFlush]);
```

This is defensive. Real-world impact is low.

**Exit criterion:** Cleanup resets scheduleRetryRef.current to a no-op on unmount.

---

### TRC4-2: [INFO] No new race conditions found

The analytics in-progress dedup, cooldown logic, and dispose-hook coupling are all correctly serialized through Node's single-threaded event loop. The anti-cheat retry chain is correctly serialized through the `retryTimerRef` guard. Proxy code runs in Edge runtime (serial per request). No data-race surface detected.

**No action.**

---

## Confidence Summary

- TRC4-1: MEDIUM (defensive; real-world impact low).
- TRC4-2: HIGH (informational).
