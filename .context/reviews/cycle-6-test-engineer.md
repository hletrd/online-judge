# Cycle 6 Test Engineer Review

**Date:** 2026-04-20
**Base commit:** 528cdf29

## Findings

### TE-1: No test coverage for contest detail page temporal status computation [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:188-192`
**Description:** The `isUpcoming` and `isPast` flags computed with `new Date()` have no test coverage. When these are fixed to use `getDbNow()`, the behavior should be verified with tests that confirm DB time is used instead of app-server time.
**Failure scenario:** A refactor changes the temporal comparison logic but no test catches a regression.
**Fix:** Add unit tests that verify the contest status computation uses DB-sourced time.
**Confidence:** MEDIUM

### TE-2: No test coverage for problem page submission blocking logic [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/problems/[id]/page.tsx:187-189`
**Description:** The `isSubmissionBlocked` computation has no test coverage. When fixed to use `getDbNow()`, tests should verify that DB time is used.
**Fix:** Add unit tests for the submission blocking logic using DB-sourced time.
**Confidence:** MEDIUM

### TE-3: No test coverage for quick-create contest default scheduling [LOW/LOW]

**File:** `src/app/api/v1/contests/quick-create/route.ts:28-32`
**Description:** The default `startsAt` and `deadline` values from `new Date()` have no test coverage. When fixed to use `getDbNowUncached()`, a test should verify that the stored timestamps come from DB time.
**Fix:** Add integration test for quick-create with default scheduling.
**Confidence:** LOW

## Verified Safe

- `escapeLikePattern` tests: 8 cases (commit 0b949d47) — comprehensive.
- `getDbNow` / `getDbNowUncached` tests: 6 cases (commit 0b949d47) — covers throw on failure.
- Recruit page metadata test: covers DB-sourced time behavior (commit d2ceed3d).
