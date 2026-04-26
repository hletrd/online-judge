# Code Reviewer Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Scope:** code quality, SOLID adherence, naming, maintainability of recently-modified files
**Files inventoried:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts`, `src/components/exam/anti-cheat-monitor.tsx`, `src/lib/security/env.ts`, `src/proxy.ts`, `tests/unit/api/contests-analytics-route.test.ts`, `tests/unit/security/env.test.ts`

## Findings

### CR4-1: [LOW] `__test_internals` is shipped in production bundles

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:92-101`

The exported `__test_internals` object survives into the production bundle even though only test code consumes it. Tree-shaking won't drop it because it is a named export from the same module that exports `GET`. The bundle is served to the server only (route handler), not the client, so the size cost is minimal — but it does mean a future malicious or accidental call from another server module could mutate cache state.

**Fix (preferred):**
```ts
export const __test_internals = process.env.NODE_ENV === "test"
  ? { /* current shape */ }
  : (undefined as never);
```
This makes accidental production access throw `Cannot read properties of undefined (reading 'cacheClear')` instead of silently working.

**Failure scenario:** A future contributor adds a debug-utility route that imports `__test_internals.cacheClear()` to "fix a stuck cache" in prod. Cache invalidation now happens out-of-band from the documented invalidation paths, leading to confusing reliability incidents.

**Exit criterion:** `__test_internals` is `undefined` at runtime in non-test environments.

---

### CR4-2: [LOW] `loadPendingEvents` accepts arbitrary stored JSON without bounds checking

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/components/exam/anti-cheat-monitor.tsx:41-51`

`loadPendingEvents` reads `localStorage`, parses JSON, filters by `isValidPendingEvent`, and returns the result. If a user (or a malicious extension/script) writes a 10MB string to that key, `JSON.parse` will allocate, the filter will iterate, and the function will silently return whatever passed validation. There's no length cap or size cap.

**Failure scenario:** A page-extension or browser bug injects a very large pending-events array. On every visibility-change/online event, the entire list is iterated and re-saved. Realistic? Low. But the function trusts the storage origin too completely.

**Fix:** Cap returned array length to a reasonable upper bound (e.g., 200 events). Anything beyond that gets dropped on load with a single `console.warn`.

```ts
return parsed.filter(isValidPendingEvent).slice(0, 200);
```

**Exit criterion:** `loadPendingEvents` returns at most N events; oversized stored arrays are truncated gracefully.

---

### CR4-3: [LOW] `describeElement` returns "unknown" for missing element rather than null/undefined

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/components/exam/anti-cheat-monitor.tsx:240-261`

The function returns the literal string `"unknown"` when `el === null`. While this works, it makes callers unable to distinguish between "really unknown element" and "literal `<unknown>` tag" (very edge-case but exists). Cleaner: return `null | undefined` and let the caller decide what to log.

This is a minor code-style nit. The current behavior is unambiguous in practice (HTML doesn't define an `<unknown>` element).

**Fix (optional):** No change recommended. Note for future ref.

**Exit criterion:** N/A.

---

### CR4-4: [LOW] `_refreshingKeys` and `_lastRefreshFailureAt` use private-style underscore prefix on module-level vars

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:19,32`

JavaScript/TypeScript convention varies, but the underscore prefix is most commonly reserved for `_unused` parameters (consumed by linters) or class private fields. For module-scoped consts, the prefix is unusual and may confuse readers ("is this private to a class? Does eslint think it's unused?").

**Fix (optional):** Either:
1. Drop the underscore: `refreshingKeys`, `lastRefreshFailureAt`.
2. Move them inside an IIFE or class wrapper that makes the privacy real.

Option (1) is cosmetic. Carried from cycle 3 AGG3-10. Defer.

**Exit criterion:** N/A this cycle.

---

### CR4-5: [INFO] Test file has good coverage of analytics route

**File:** `tests/unit/api/contests-analytics-route.test.ts:1-249`

The test suite covers: 404 (missing assignment), 403 (forbidden), cache miss/hit, staleness without DB call, in-progress dedup, refresh failure logging, cooldown, and the new dispose-hook eviction (added in cycle 3). The mock isolation via `vi.hoisted` is correct. The `vi.runAllTimersAsync()` calls now have inline comments explaining the microtask drain. Solid suite.

**No action.**

---

### CR4-6: [LOW] `proxy.ts` `clearAuthSessionCookies` re-derives cookie names on every call

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/proxy.ts:87-97`

```ts
function clearAuthSessionCookies(response: NextResponse) {
  const { name, secureName } = getAuthSessionCookieNames();
  // ...
}
```

`getAuthSessionCookieNames()` is a pure function returning a fresh object literal every call. In the proxy hot path, this allocates ~2 strings + 1 object on every unauthorized response. Not a real issue (allocation is sub-microsecond), but the helper could be hoisted to a module-level const.

**Fix (optional):** Hoist the call:
```ts
const AUTH_SESSION_COOKIE_NAMES = getAuthSessionCookieNames();
function clearAuthSessionCookies(response: NextResponse) {
  response.cookies.set(AUTH_SESSION_COOKIE_NAMES.name, "", { ... });
  response.cookies.set(AUTH_SESSION_COOKIE_NAMES.secureName, "", { ..., secure: true });
  return response;
}
```

But: hoisting at module load means the cookie names are frozen at import time. If the underlying constants change (they don't currently), the proxy wouldn't pick up the change. Currently safe because the function reads two `const` strings.

**Exit criterion:** Optional optimization. Defer.

---

### CR4-7: [INFO] `getAuthSessionCookieNames` doesn't depend on env state

**File:** `src/lib/security/env.ts:178-180`

Unlike `getAuthSessionCookieName()` (singular, which checks `shouldUseSecureSessionCookie()`), the plural `getAuthSessionCookieNames()` returns both literal constants without consulting env. This is intentional (the proxy needs to clear both variants), but it means a renamed cookie literal would only update if both functions are kept in sync. The current code does this correctly via shared module-private constants `AUTH_SESSION_COOKIE_NAME` / `SECURE_AUTH_SESSION_COOKIE_NAME`.

**No action.**

---

## Confidence Summary

- CR4-1: HIGH (export survives into prod bundle).
- CR4-2: MEDIUM (theoretical large-storage attack; defense-in-depth).
- CR4-3: HIGH (cosmetic).
- CR4-4: HIGH (style nit; deferred).
- CR4-5: HIGH (informational; no action).
- CR4-6: HIGH (negligible perf; cosmetic).
- CR4-7: HIGH (informational).
