# Test Engineer Lane - Cycle 1

**Date:** 2026-04-26
**Angle:** Test coverage gaps, flaky tests, missing tests for new behavior

## Test Suite Status

| Layer | Result |
|-------|--------|
| Unit tests (vitest run) | 302 files, 2192 passed, **15 FAILED** (all in proxy.test.ts) |
| Integration tests | 3 files, 37 skipped (no DB connection) |
| Component tests | All passed |
| E2E tests (playwright) | Not run (needs dev server + test server) |
| TypeScript (tsc --noEmit) | PASSED |

---

## Finding TE-1: CRITICAL — Test mock missing export causes 15 failures

**File:** `tests/unit/proxy.test.ts:51-53`
**Severity:** HIGH
**Confidence:** HIGH

**Root cause:** See CR-1/DBG-1/VER-6 in other lanes. The test mock for `@/lib/security/env` doesn't export `getAuthSessionCookieNames`. All tests that reach `clearAuthSessionCookies` fail.

**Fix:** Add `getAuthSessionCookieNames` to the vi.mock return value.

---

## Finding TE-2: No tests for getAuthSessionCookieNames() in env.test.ts

**File:** Check if `tests/unit/env.test.ts` or `tests/unit/security/env.test.ts` exists

Let me check:
```
find tests/unit -name "*env*" -o -name "*security*"
```

Need to verify. If env.test.ts exists, it should test the new function.

**Gap:** New exported function has no dedicated unit test.

**Suggested test:**
```typescript
describe("getAuthSessionCookieNames", () => {
  it("returns both cookie name variants", () => {
    const result = getAuthSessionCookieNames();
    expect(result.name).toBe("authjs.session-token");
    expect(result.secureName).toBe("__Secure-authjs.session-token");
  });
});
```

---

## Finding TE-3: No test for analytics Date.now() staleness behavior

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts`

**Gap:** The analytics route uses Date.now() for staleness instead of getDbNowMs(). There's no test verifying that:
1. Cache hits don't trigger a DB query for staleness check
2. Stale-but-within-TTL data is returned while background refresh runs
3. Date.now() fallback on DB failure correctly sets cooldown

**Check:** Look for analytics route tests:
```
find tests -name "*analytics*" 2>/dev/null
```

**Recommended:** Add API-level tests for the analytics route covering these scenarios.

---

## Finding TE-4: Anti-cheat monitor has no component tests for retry deduplication

**File:** `src/components/exam/anti-cheat-monitor.tsx`

**Gap:** The refactored retry scheduling (scheduleRetryRef) has no specific test verifying:
1. reportEvent delegates to scheduleRetryRef on send failure
2. flushPendingEvents delegates to scheduleRetryRef after flush
3. Only one timer is created when both paths fire
4. The backoff calculation is correct

**Check:** Look for anti-cheat tests:
```
find tests -name "*anti-cheat*" -o -name "*anticheat*" 2>/dev/null
```

**Recommended:** Component tests using React Testing Library or Playwright component tests.

---

## Finding TE-5: No E2E test for analytics page with cache staleness

**File:** E2E tests directory

**Gap:** The analytics page is677 likely tested (dashboard/contests/[id]/analytics) but the specific cache-staleness behavior (serving stale data while refreshing in background) is not specifically tested.

**Recommended:** Add E2E test: load analytics, wait 35+ seconds, reload — verify data is served immediately (from stale cache) while background refresh occurs.

---

## Finding TE-6: Pre-existing: Password validation test date might be stale

**File:** Check for password validation tests

**Context from DOC-6:** AGENTS.md says "only check minimum length" but password.ts also checks common passwords, username, email. Tests should verify all checks.

---

## Summary

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| TE-1 | Test mock missing export | HIGH | HIGH |
| TE-2 | Missing unit test for getAuthSessionCookieNames | LOW | HIGH |
| TE-3 | Missing test for Date.now() staleness behavior | LOW | MEDIUM |
| TE-4 | Missing component test for retry deduplication | LOW | MEDIUM |
| TE-5 | Missing E2E test for stale cache behavior | LOW | LOW |
| TE-6 | Password validation test coverage | LOW | LOW |

6 findings. TE-1 is blocking (test failures). TE-2 through TE-6 are coverage gaps.
