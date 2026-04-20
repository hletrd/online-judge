# Cycle 27 Test Engineer

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### TE-1: No test coverage for recruit page clock-skew behavior [MEDIUM/MEDIUM]

**File:** `tests/unit/recruit-page-metadata.test.ts`
**Description:** The existing test covers metadata generation for valid/invalid tokens, but does not test the temporal comparison logic. Specifically, there is no test that verifies behavior when the app server clock differs from the DB server clock for expiry/deadline checks. The API route (`recruiting/validate`) uses SQL NOW() making it immune to clock skew, but the server page uses `new Date()`.
**Failure scenario:** A clock-skew regression could be introduced without any test catching it.
**Fix:** Add a test case that verifies the page uses DB-sourced time for comparisons, or at minimum, a test that documents the expected behavior when `new Date()` diverges from DB time.
**Confidence:** MEDIUM

### TE-2: SSE events route lacks integration test for connection cleanup [LOW/LOW]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts`
**Description:** The SSE connection tracking (in-memory Maps/Sets) has no integration test verifying that connections are properly cleaned up when streams close. The cleanup timer and eviction logic are untested.
**Failure scenario:** A regression in connection cleanup could lead to memory leaks in production without any test failure.
**Fix:** Add a unit test for `addConnection`/`removeConnection` and the cleanup timer logic.
**Confidence:** LOW

## Verified Safe

- Full test suite passes: 288 test files, 2027 assertions, 0 failures.
- The recruit-page-metadata test is now properly fixed and passing (was the main flaky test from cycle 26).
- Security tests cover timing-safe comparisons, rate limiting, and env validation.
