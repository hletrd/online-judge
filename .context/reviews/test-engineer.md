# Test Engineer Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Scope:** test coverage gaps, flaky tests, TDD opportunities

## Findings

### TE4-1: [LOW] `__test_internals` not exercised by every consumer it could be

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `tests/unit/api/contests-analytics-route.test.ts:230-248`

Only one test currently uses `__test_internals` (the dispose-hook eviction test). The other helper, `__test_internals.cacheClear()`, is exposed but unused. If unused test helpers stay, they slowly accumulate as dead surface that future contributors must reason about. Either:

1. Add a test that uses `cacheClear()` (e.g., between-test cache reset for isolation).
2. Remove `cacheClear()` from `__test_internals` until a test needs it.

Option (2) is YAGNI-aligned. Option (1) could improve test isolation.

**Fix:** Pending product decision. Defer.

**Exit criterion:** Either remove unused helpers or add a test that exercises them.

---

### TE4-2: [LOW, deferred] Anti-cheat retry/backoff lacks direct timing tests (carried)

**Severity:** LOW | **Confidence:** LOW | **File:** `src/components/exam/anti-cheat-monitor.tsx`

Carried from cycle 2 AGG-13 / cycle 3 AGG3-7. The exponential backoff (1s → 2s → 4s → 8s capped at 30s) has only indirect coverage. Direct testing would require:
- `vi.useFakeTimers`
- mock `apiFetch` to return `{ ok: false }` N times then `{ ok: true }`
- mock `localStorage` (or use jsdom)
- assert that `setTimeout` was called with expected delays

**Test sketch:**
```ts
import { act, renderHook } from "@testing-library/react";
// import the component, render, simulate failed sendEvent, advance timers, assert next sendEvent fires after backoff.
```

The setup is non-trivial (3+ mocks, jsdom, render hook). Defer to a dedicated testing-focused cycle.

**Exit criterion:** Pick up in a dedicated testing cycle.

---

### TE4-3: [INFO] Analytics suite has good behavioral coverage

**File:** `tests/unit/api/contests-analytics-route.test.ts`

Coverage of route GET behavior:
- 404 (missing assignment): line 100-104.
- 403 (forbidden): line 106-110.
- Cache miss: line 112-118.
- Cache hit (no DB call): line 120-140.
- Stale + in-progress dedup: line 142-176.
- Refresh failure logging: line 178-201.
- Cooldown respected: line 203-228.
- Dispose-hook eviction (new in cycle 3): line 230-248.

Comprehensive. The mock setup via `vi.hoisted` is correct, the `vi.useFakeTimers` + `vi.setSystemTime` pattern allows time control, and `vi.resetModules()` ensures module-state isolation between tests.

**No action.**

---

### TE4-4: [LOW] No test for `getAuthSessionCookieNames` shape against `proxy.ts` consumer

**Severity:** LOW | **Confidence:** MEDIUM | **Files:** `tests/unit/security/env.test.ts:412-440`, `src/proxy.ts:87-97`

`env.test.ts` covers `getAuthSessionCookieNames` literal-value assertions (resolved per cycle 3 AGG3-2). `proxy.ts` consumes `getAuthSessionCookieNames()` in `clearAuthSessionCookies`. There's no integration test that asserts:
1. `clearAuthSessionCookies` calls `response.cookies.set` with the names from `getAuthSessionCookieNames`.
2. The non-secure variant doesn't have `secure: true`.

Such a test would catch a refactor that swapped the names or accidentally set `secure` on the non-secure variant.

**Test sketch:**
```ts
import { NextResponse } from "next/server";
// (after extracting clearAuthSessionCookies as a testable export)
const res = NextResponse.next();
clearAuthSessionCookies(res);
const cookieHeader = res.headers.get("Set-Cookie");
expect(cookieHeader).toContain("authjs.session-token=;");
expect(cookieHeader).toContain("__Secure-authjs.session-token=;");
```

But `clearAuthSessionCookies` is currently a private function in `proxy.ts`. Would require export-for-test.

**Fix:** Defer. Add when `proxy.ts` next gets a refactor.

**Exit criterion:** N/A this cycle.

---

### TE4-5: [INFO] No flakes detected in unit suite

Cycle 3 ran the analytics suite cleanly (7/7 in 79ms). The full suite was reported at 2218 tests passing. The dispose-hook test added in cycle 3 is deterministic (no async, no timers — relies only on `analyticsCache.delete` firing the synchronous `dispose` callback).

**No action.**

---

### TE4-6: [LOW] Cycle-4 review identifies `loadPendingEvents` cap recommendation; no test currently asserts behavior

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/components/exam/anti-cheat-monitor.tsx:41-51`

If CR4-2 is implemented (cap at 200 events), a test should assert: load → returns at most 200 events even when localStorage has more. No current test exists for this surface.

**Fix:** If CR4-2 lands, add the test. Else N/A.

**Exit criterion:** Conditional on CR4-2 implementation.

---

## Confidence Summary

- TE4-1: MEDIUM (cosmetic).
- TE4-2: LOW (carried-deferred).
- TE4-3: HIGH (informational).
- TE4-4: MEDIUM (defensible defer).
- TE4-5: HIGH (informational).
- TE4-6: MEDIUM (conditional).
