# Test Engineer — Cycle 7 Deep Review

**Date:** 2026-04-20
**Scope:** Test coverage gaps, flaky tests, TDD opportunities

---

## Findings

### MEDIUM 1 — No test coverage for `tokenInvalidatedAt` clock-skew behavior

**Confidence:** HIGH
**Files:**
- `src/lib/auth/session-security.ts:26-36`
- `src/app/api/v1/users/[id]/route.ts:164,185,218,260,466`
- `src/lib/actions/user-management.ts:114,308`
- `src/lib/actions/change-password.ts:75`

**Problem:** While `tests/unit/db-time.test.ts` tests `getDbNow()` and `getDbNowUncached()`, there are no tests verifying that `tokenInvalidatedAt` is set using DB-consistent time. If a developer changes `tokenInvalidatedAt: new Date()` to use `getDbNowUncached()`, there is no test to prevent a regression back to `new Date()`. Additionally, `isTokenInvalidated()` itself has no unit test for the clock-skew scenario.

**Suggested fix:**
1. Add a unit test for `isTokenInvalidated()` that verifies the comparison is correct when `tokenInvalidatedAt` and `authenticatedAtSeconds` are in different clock reference frames.
2. Add integration tests that verify user deactivation, role change, and password reset all set `tokenInvalidatedAt` using DB-consistent time (after the fix is applied).

---

### MEDIUM 2 — No test coverage for public contest pages using DB time

**Confidence:** HIGH
**Files:**
- `src/lib/assignments/public-contests.ts:30,124`

**Problem:** The public contest pages determine contest status using `new Date()`. After the fix (using `getDbNow()`), there should be tests verifying that the status is computed against DB time, not app-server time. Currently there are no such tests.

**Suggested fix:** Add a test that verifies `getPublicContests()` and `getPublicContestById()` use `getDbNow()` for contest status computation.

---

### MEDIUM 3 — No test coverage for active-timed-assignments sidebar using DB time

**Confidence:** MEDIUM
**Files:**
- `src/lib/assignments/active-timed-assignments.ts:15,44`

**Problem:** After the fix to use `getDbNow()`, there should be tests verifying the sidebar correctly determines active contests against DB time.

**Suggested fix:** Add unit tests for `selectActiveTimedAssignments` and `getActiveTimedAssignmentsForSidebar`.

---

### LOW 1 — Missing test for anti-cheat `createdAt` DB-time consistency

**Confidence:** MEDIUM
**Files:**
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:110,128`

**Problem:** The anti-cheat route inserts events with `createdAt: new Date()`. After the fix to use DB time, a test should verify this.

**Suggested fix:** Add a unit test for the anti-cheat event insertion.

---

## Final sweep

The existing test suite covers the recent `getDbNow()` / `getDbNowUncached()` fixes well (`tests/unit/db-time.test.ts`, `tests/unit/escape-like-pattern.test.ts`). The main gap is test coverage for the NEW findings in this cycle — specifically `tokenInvalidatedAt`, public contest pages, and sidebar status.
