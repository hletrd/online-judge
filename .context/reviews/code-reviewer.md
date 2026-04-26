# Code Reviewer Lane - Cycle 1

**Date:** 2026-04-26
**Scope:** Full repository, focus on 4 changed files + dependencies

## Change Inventory

| File | Summary |
|------|--------|
| `src/app/api/v1/contests/[assignmentId]/analytics/route.ts` | Cache staleness uses Date.now() instead of getDbNowMs(); Date.now() fallback on DB failure |
| `src/components/exam/anti-cheat-monitor.tsx` | Retry scheduling deduplication via scheduleRetryRef |
| `src/lib/security/env.ts` | New getAuthSessionCookieNames() export |
| `src/proxy.ts` | Uses getAuthSessionCookieNames() instead of hardcoded cookie names |

---

## Finding CR-1: Broken test mock — getAuthSessionCookieNames not exported [HIGH/HIGH]

**File:** `tests/unit/proxy.test.ts:51-53`

`vi.mock("@/lib/security/env")` only exports `getValidatedAuthSecret`. `proxy.ts` now imports and calls `getAuthSessionCookieNames()` (line 7, called at 92). This causes 15 test failures with: "No getAuthSessionCookieNames export is defined on the mock."

**Failure:** Any test reaching `clearAuthSessionCookies` throws. Affects unauthorized API, login redirect, token-without-user tests.

**Fix:** Add the mock:
```typescript
vi.mock("@/lib/security/env", () => ({
  getValidatedAuthSecret: getValidatedAuthSecretMock,
  getAuthSessionCookieNames: vi.fn().mockReturnValue({
    name: "authjs.session-token",
    secureName: "__Secure-authjs.session-token",
  }),
}));
```

---

## Finding CR-2: Analytics cache mixes Date.now() and getDbNowMs() inconsistently [MEDIUM/MEDIUM]

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:62,70,79,88,90`

Cache staleness check (line 62) uses `Date.now()` but cache-write (line 79) uses `await getDbNowMs()`. The `cached.createdAt` is set via DB time but `nowMs` comes from app-server time. Clock skew > 30s can cause indefinite stale reads or excessive refreshes.

**Failure scenario:** DB clock 40s ahead: `Date.now() - cached.createdAt` always negative or < STALE_AFTER_MS — never triggers refresh.

**Fix:** Either always use `Date.now()` for both writes and reads (documented approach), or always use `getDbNowMs()`. Mixing creates incoherent time domain.

---

## Finding CR-3: scheduleRetryRef called with inconsistent semantics [MEDIUM/MEDIUM]

**File:** `src/components/exam/anti-cheat-monitor.tsx:125,169`

`flushPendingEvents` calls `scheduleRetryRef(remaining)` where `remaining` = events that just failed. `reportEvent` calls `scheduleRetryRef(pending)` where `pending` = ALL pending events (including the newly added one). The backoff calculation (`maxRetry`) differs between these two paths, and the asymmetry is undocumented.

**Fix:** Document the semantic difference. Consider whether `reportEvent` should only schedule retry for the specific failed event.

---

## Finding CR-4: reportEvent has unused flushPendingEvents dependency [LOW/LOW]

**File:** `src/components/exam/anti-cheat-monitor.tsx:172`

`reportEvent` lists `flushPendingEvents` in deps but no longer calls it after refactoring. Causes unnecessary re-creation.

**Fix:** Remove `flushPendingEvents` from dependency array.

---

## Finding CR-5: Retry timer collision when flushPendingEvents fires during pending retry [MEDIUM/MEDIUM]

**File:** `src/components/exam/anti-cheat-monitor.tsx:135,138`

`scheduleRetryRef` checks `!retryTimerRef.current` to avoid duplicate timers. When visibility change triggers `flushPendingEvents` while a retry timer is pending, the flush's retry won't schedule a new timer. The existing timer will still fire, but this relies on implicit behavior.

**Fix:** Document this behavior. Consider resetting timer on new flush for fresher retry scheduling.

---

## Finding CR-6: getAuthSessionCookieNames is a function returning constants [LOW/LOW]

**File:** `src/lib/security/env.ts:178-180`

Function returns hardcoded constants but uses getter pattern suggesting dynamic behavior. Could be simpler as `export const AUTH_SESSION_COOKIE_NAMES = { ... }`.

**Fix:** Make it a `const` object or add JSDoc explaining the function form.

---

## Finding CR-7: Overly broad outer catch in analytics async IIFE [LOW/LOW]

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:96-99`

Outer `.catch(() => {})` swallows ALL errors, potentially masking bugs in `computeContestAnalytics`. The inner try/catch already handles expected errors.

**Fix:** Clarify comment or narrow catch scope. The current implementation is defensive and reasonably safe.

---

## Summary

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| CR-1 | Test mock missing export | HIGH | HIGH |
| CR-2 | Mixed time sources | MEDIUM | MEDIUM |
| CR-3 | Inconsistent retry semantics | MEDIUM | MEDIUM |
| CR-4 | Unused dependency | LOW | LOW |
| CR-5 | Timer collision | MEDIUM | MEDIUM |
| CR-6 | Function vs const | LOW | LOW |
| CR-7 | Broad error swallowing | LOW | LOW |

Total: 7 findings (1 HIGH, 3 MEDIUM, 3 LOW)
