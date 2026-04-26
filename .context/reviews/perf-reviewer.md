# Performance Reviewer Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Scope:** CPU/memory/network/UI responsiveness, hot-path allocation, concurrency

## Findings

### PERF4-1: [INFO] `_lastRefreshFailureAt` lifecycle bound to `analyticsCache` via dispose hook

**Severity:** INFO | **Confidence:** HIGH | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:34-47`

The cycle-3 fix (commit `56dd6957`) closes the slow-leak finding from cycle 3 PERF3-2 / AGG3-1. After verification:
- Eviction path (capacity, TTL): dispose fires → `_lastRefreshFailureAt.delete(key)` → no leak.
- Explicit delete path: same.
- Overwrite path: dispose fires for the OLD value, new value is set; cooldown semantics preserved by ordering of catch-block writes.

**No action.**

---

### PERF4-2: [LOW] `getAuthSessionCookieNames()` allocates a new object literal on every call

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/lib/security/env.ts:178-180`

```ts
export function getAuthSessionCookieNames(): { name: string; secureName: string } {
  return { name: AUTH_SESSION_COOKIE_NAME, secureName: SECURE_AUTH_SESSION_COOKIE_NAME };
}
```

Every call allocates: 1 fresh object + 2 string-property slots. Strings themselves are interned constants (no extra alloc). The function is called from `proxy.ts:92` on every unauthorized response and on every logout/cookie-clear path.

**Real-world cost:** Sub-microsecond per call. The proxy handles thousands of req/sec under load; this pattern adds maybe 10-100 microseconds total over a day. Negligible.

**Fix (optional):** Hoist a frozen constant:
```ts
const AUTH_SESSION_COOKIE_NAMES = Object.freeze({
  name: AUTH_SESSION_COOKIE_NAME,
  secureName: SECURE_AUTH_SESSION_COOKIE_NAME,
});
export function getAuthSessionCookieNames() {
  return AUTH_SESSION_COOKIE_NAMES;
}
```

**Exit criterion:** N/A this cycle (cosmetic; carried from cycle 3 AGG3-10).

---

### PERF4-3: [LOW] Anti-cheat `loadPendingEvents` JSON parses on every visibility/online event

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/components/exam/anti-cheat-monitor.tsx:41-51`

`loadPendingEvents` performs `JSON.parse` on the localStorage string every time it's called. Callers include `flushPendingEvents` (visibility change to visible, online event), `reportEvent` (whenever a network failure occurs), and the retry-timer callback. In an active exam, this could happen ~once per minute under normal conditions.

**Real-world cost:** Negligible for small queues (<10 events). Could matter if the queue ever grows large (see CR4-2 — currently no upper bound).

**Fix:** No code change today. If CR4-2 is fixed (add cap), this becomes a non-issue.

**Exit criterion:** N/A this cycle.

---

### PERF4-4: [LOW] `Date.now()` used for staleness check; `getDbNowMs()` used for cache writes — split is intentional

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:127-134,159`

Per cycle 2 design (commit `e897b0a5`), staleness checks use `Date.now()` (no DB call) while cache writes use `await getDbNowMs()` (authoritative). This is the correct split: cache hits are zero-DB-roundtrip, while cache writes are infrequent and benefit from the authoritative time source.

**No action.**

---

### PERF4-5: [LOW] `proxy.ts` cache cleanup at 90% capacity is correctly amortized

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/proxy.ts:64-85`

The auth-cache cleanup loop iterates the full cache only when `size >= 0.9 * MAX_SIZE` (=450). Under steady load, this triggers infrequently (only when cache is near full, which requires ~450 distinct active users + token-refresh churn). The amortized cost is constant per `setCachedAuthUser` call. Correct design.

**No action.**

---

### PERF4-6: [LOW] Heartbeat schedule could use `setInterval` instead of recursive `setTimeout`

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/components/exam/anti-cheat-monitor.tsx:200-216`

Recursive `setTimeout` is functionally equivalent to `setInterval` for a fixed-cadence heartbeat. The current pattern correctly clears via `clearTimeout(heartbeatTimer)` on cleanup. `setInterval` would be marginally simpler:

```ts
heartbeatTimer = setInterval(() => {
  if (document.visibilityState === "visible") {
    void reportEventRef.current("heartbeat");
  }
}, HEARTBEAT_INTERVAL_MS);
```

But: `setInterval` doesn't naturally accommodate the immediate first-call (`void reportEventRef.current("heartbeat")` at line 203). The current recursive-setTimeout pattern allows that. Tradeoff is fine.

**No action.**

---

## Confidence Summary

- PERF4-1: HIGH (verified fix from cycle 3).
- PERF4-2: HIGH (negligible cost; cosmetic).
- PERF4-3: HIGH (negligible cost).
- PERF4-4: HIGH (intentional design).
- PERF4-5: HIGH (correct amortization).
- PERF4-6: MEDIUM (subjective; current is fine).
