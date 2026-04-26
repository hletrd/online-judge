# Debugger Lane - Cycle 1

**Date:** 2026-04-26
**Angle:** Latent bug surface, failure modes, regression risks

## Finding DBG-1: Test mock failure causes 15 unit test failures — IMMEDIATE FIX NEEDED

**File:** `tests/unit/proxy.test.ts:51-53`
**Severity:** HIGH
**Confidence:** HIGH
**Type:** Test infrastructure bug

**Root cause:** `proxy.ts` imports `getAuthSessionCookieNames` from `@/lib/security/env`. The test mock only provides `getValidatedAuthSecret`. When `clearAuthSessionCookies` runs (which happens on every auth failure path), it calls `getAuthSessionCookieNames()` which is undefined in the mock context.

**Affected tests:** 15 tests, all in `tests/unit/proxy.test.ts` > `proxy` describe block. Specifically tests that reach the 401/redirect path where `clearAuthSessionCookies` is called.

**Fix:** Add `getAuthSessionCookieNames` to the mock.

---

## Finding DBG-2: Potential for `_refreshingKeys` leak on unhandled exception

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:76-99`
**Severity:** LOW
**Confidence:** LOW
**Type:** Resource leak (theoretical)

**Analysis:** If the outer `.catch(() => {})` at line 96 itself throws (e.g., if the callback somehow throws due to a VM-level error), the `_refreshingKeys.delete(cacheKey)` in the `finally` block might not execute. However, the `finally` block runs before `.catch()` handlers, so this would require the `finally` block itself to throw.

**The `finally` block:**
```typescript
finally {
  _refreshingKeys.delete(cacheKey);
}
```
This is a synchronous Set.delete() call. It cannot throw (no DB call, no allocation that could fail).

**Verdict:** Not a real risk. The finally block is trivially safe.

---

## Finding DBG-3: `scheduleRetryRef.current` initial no-op on first render is safe

**File:** `src/components/exam/anti-cheat-monitor.tsx:118`
**Severity:** —
**Confidence:** HIGH
**Type:** Verification of correct pattern

**Analysis:** `scheduleRetryRef` is initialized as `() => {}`. If called before the useEffect (line 132) executes, it's a no-op. The question: can it be called before the useEffect?

- `flushPendingEvents` calls `scheduleRetryRef.current(remaining)` (line 125)
- `flushPendingEvents` is called from `flushPendingEventsRef` which is24 invoked in the useEffect at line 183
- `reportEvent` calls `scheduleRetryRef.current(pending)` (line 169)
- `reportEvent` is called from `reportEventRef` which is invoked in event handlers registered in the useEffect at line 209

Both call sites are inside effects/handlers that run AFTER the first render. By the time any event handler fires, the useEffect at 132 has already set `scheduleRetryRef.current`.

**Verdict:** SAFE. The initial no-op is never called with real data.

---

## Finding DBG-4: `performFlush` in retry timer callback uses stale closure warning

**File:** `src/components/exam/anti-cheat-monitor.tsx:132-145`
**Severity:** LOW
**Confidence:** MEDIUM
**Type:** React hooks closure staleness

**Analysis:** The `useEffect` at line 132 has `[performFlush]` as dependency. When `performFlush` changes (which changes when `sendEvent` changes), the effect runs and updates `scheduleRetryRef.current`. But inside the setTimeout callback (line 138-141):
```typescript
retryTimerRef.current = setTimeout(async () => {
  retryTimerRef.current = null;
  const retryRemaining = await performFlush();
  scheduleRetryRef.current(retryRemaining);
}, backoffDelay);
```

The `performFlush` used here is the one captured by the closure at the time the useEffect ran. If `performFlush` changes between when the timer is set and when it fires, the timer callback uses the OLD `performFlush`. This could be13 a problem if `assignmentId` or `sendEvent` changed.

**BUT:** The `useEffect` at 132 runs whenever `performFlush` changes. If `performFlush` changes AFTER the timer is already set, the timer still holds the old `performFlush`. However, when the timer fires, it calls `scheduleRetryRef.current(retryRemaining)`. If there are still retriable events, it sets a NEW timer. This new timer is4 set by the CURRENT `scheduleRetryRef.current`, which holds the LATEST `performFlush`. So the next timer generation will use the correct `performFlush`.

**Verdict:** One generation of stale `performFlush` is possible but the next generation corrects itself. This is a React hooks pattern limitation. In practice, `performFlush` rarely changes after mount (only if `assignmentId` changes, which doesn't happen for this component — it receives assignmentId as a prop and is keyed on it).

---

## Finding DBG-5: localStorage and retries are keyed by assignmentId — no cross-contest leakage

**File:** `src/components/exam/anti-cheat-monitor.tsx:43,48,56`
**Severity:** —
**Confidence:** HIGH
**Type:** Verification

**Analysis:** Storage key is `${STORAGE_KEY}_${assignmentId}`. Multiple tabs/contests don't share pending events. VERIFIED CORRECT.

---

## Summary

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| DBG-1 | Test mock failure | HIGH | HIGH |
| DBG-2 | _refreshingKeys leak — theoretical only | LOW | LOW |
| DBG-3 | scheduleRetryRef initial no-op — safe | — | HIGH |
| DBG-4 | Stale closure in retry timer | LOW | MEDIUM |
| DBG-5 | Cross-contest leakage — none | — | HIGH |

1 active bug (DBG-1 — test mock). Other findings are verification notes or low-risk observations.
