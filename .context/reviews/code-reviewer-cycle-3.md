# Code-Reviewer Pass — RPF Cycle 3/100

**Date:** 2026-04-26
**Lane:** code-reviewer
**Scope:** Full repo, prioritising the cycle-2 commits (env.ts factory, proxy.ts cookie clearing, analytics route refactor + tests, anti-cheat retry-clamp comment).

## Summary

Cycle 2 cleanly committed all six tasks (Tasks A–F) and produced a coherent diff. Lint is clean (0 errors), build passes, tests grew from 2210 → 2217 (7 added) and all pass. This cycle is in a steady state — most of the high-impact work for the surface area touched in cycles 1–2 has landed.

The remaining issues are smaller seams that the cycle-2 changes either created or exposed. None are blocking, but a few are worth landing this cycle to keep the surface area tight.

## Findings

### CR3-1: [MEDIUM] Analytics test "returns cached data on second request" coupling between phases is fragile

**File:** `tests/unit/api/contests-analytics-route.test.ts:120-140`
**Confidence:** MEDIUM

The test primes the cache via `await callRoute()` which calls `vi.resetModules()`, then performs a second `await import("@/app/api/v1/contests/[assignmentId]/analytics/route")` to call the same module instance and assert on its module-level cache. This works because no `vi.resetModules()` runs between the two imports, so they yield the same instance — but the relationship is implicit. A future contributor adding `vi.resetModules()` to a `beforeEach` (without a per-test override) would silently break the cache assertions while the test would still report status 200.

**Failure scenario:** Maintenance hazard, not a current bug. The next time someone adds module reset between tests, the staleness assertion `expect(getDbNowMsMock).not.toHaveBeenCalled()` would still pass against a freshly-empty cache (cache miss → `getDbNowMs()` is called once in the cache-write path, the assertion fails — actually it would catch this). Re-reading: the cache-miss path *does* call `getDbNowMs()` at line 115 of the route, so the test would fail if reset accidentally. Lower the severity to LOW.

**Fix (deferred):** Add an inline comment in the test explaining why `vi.resetModules()` must NOT be called between the prime and the assertion phase.

---

### CR3-2: [LOW] `_refreshingKeys` and `_lastRefreshFailureAt` retained leading-underscore convention

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:20,24`
**Confidence:** LOW

Cycle 2 left these module-level state variables with a leading underscore even after refactoring around them. The convention is inconsistent with the rest of the file (`analyticsCache` has no underscore). This was flagged in cycle 2 (CR2-4 / ARCH2-3) and deferred as cosmetic.

**Fix (deferred):** Either drop the underscore on both names (keep top-level `analyticsCache` consistent) or wrap in a single `RefreshState` object for cohesion. Cosmetic; defer.

---

### CR3-3: [LOW] `refreshAnalyticsCacheInBackground` reuses `getDbNowMs()` for the success path but `Date.now()` for the failure path

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:47,52`
**Confidence:** MEDIUM

The new function uses `getDbNowMs()` to record `createdAt` (success path) but `Date.now()` to record `_lastRefreshFailureAt` (failure path, with a comment explaining the rationale). This is internally consistent under the cycle-2 design ("DB time for persisted-style timestamps; app time for in-process state"), but `_lastRefreshFailureAt` is read against `Date.now()` (line 89 + 98 of the route), so the pure pairing is fine.

The asymmetry that's left: `cached.createdAt` is in DB time domain, but is compared against `Date.now()` at line 90 (`age = nowMs - cached.createdAt`). With 1-2s of clock skew the staleness comparison can be off by up to that skew — well within the 30s `STALE_AFTER_MS` tolerance, so still safe. Cycle-2 plan recorded this as a deliberate hybrid decision.

**Fix:** No change needed — comment at line 83-88 documents the trade-off. Optionally tighten the doc comment on `refreshAnalyticsCacheInBackground` to reiterate that `getDbNowMs()` is used for the cache `createdAt` while the staleness comparison uses `Date.now()` and that this is intentional.

---

### CR3-4: [LOW] `getAuthSessionCookieNames()` returns a fresh object on every call

**File:** `src/lib/security/env.ts:178-180`
**Confidence:** LOW

Every call constructs a new `{ name, secureName }` object. The values are compile-time string constants, so the object could be hoisted to module scope and reused. Negligible perf impact (one allocation per logout, not per request) — flagged for completeness only.

**Fix:** Defer; would lose the function-call contract advantage (we can lazily change the cookie names later without touching consumers). Current pattern is fine.

---

### CR3-5: [LOW] `proxy.ts:94` uses literal `secure: true` instead of `request.nextUrl.protocol === "https:"`

**File:** `src/proxy.ts:94`
**Confidence:** LOW

`clearAuthSessionCookies` sets `secure: true` for the `__Secure-` variant unconditionally. In dev (HTTP), the browser ignores `Set-Cookie` with the `Secure` attribute, so the cookie is never cleared. This was tagged in cycle 2 as AGG-9 and deferred ("dev-only nuisance"). The deferral decision still holds: production is HTTPS-only, and in dev the `__Secure-` cookie is never set in the first place, so there's nothing to clear. Defer.

**Fix (deferred):** No change.

---

### CR3-6: [INFO] `src/components/exam/anti-cheat-monitor.tsx` re-references `flushPendingEventsRef` from inside event handler closures

**File:** `src/components/exam/anti-cheat-monitor.tsx:280, 197`
**Confidence:** LOW

The `online` and `visibilitychange` handlers correctly use `flushPendingEventsRef.current()` to access the latest closure. There's no bug, but the pattern introduces a subtle race window: if `online` fires while a retry timer is queued, both can call `performFlush()` concurrently. Cycle 2 deferred this as AGG-10 — duplicate POSTs are server-idempotent. The deferral remains correct.

**Fix (deferred):** No change.

## Verification Notes

- `npm run lint`: 0 errors, 14 warnings (all in untracked dev scripts — `add-stress-tests.mjs`, `auto-solver.mjs`, etc. — non-gating).
- `npm run test:unit -- tests/unit/api/contests-analytics-route.test.ts`: 7/7 pass in ~80ms.
- `git log` confirms all six cycle-2 tasks committed cleanly with proper conventional + gitmoji format.

## Confidence

- MEDIUM: CR3-1 (test maintenance hazard, low immediate risk).
- LOW: CR3-2..6 (cosmetic / deferred cycle-2 items still applicable).

No HIGH-severity findings this pass. Cycle 3 has a small deferred-item-only surface; main work area should be elsewhere (review of older code that hasn't been touched recently, or workspace-to-public migration).
