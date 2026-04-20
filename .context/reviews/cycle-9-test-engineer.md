# Cycle 9 Test Engineer Report

**Reviewer:** test-engineer
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** Test coverage gaps, flaky tests, TDD opportunities

## Inventory of Test Files Reviewed

- `tests/` directory structure
- `vitest.config.ts`, `vitest.config.component.ts`, `vitest.config.integration.ts`
- `playwright.config.ts`, `playwright.visual.config.ts`
- `src/lib/security/__tests__/rate-limit.test.ts` (referenced from prior cycles)
- Existing route tests added in prior cycles

## Findings

### CR9-TE1 — [MEDIUM] No unit tests for `auth/config.ts` field mapping consistency

- **Confidence:** HIGH
- **File:** `src/lib/auth/config.ts`
- **Evidence:** The triple field mapping (createSuccessfulLoginResponse, syncTokenWithUser, jwt callback) has no automated test that verifies all three produce the same fields. If a new field is added to one but not the others, there is no test to catch the omission.
- **Failure scenario:** Developer adds `newPreference` field to `createSuccessfulLoginResponse` and `syncTokenWithUser` but forgets the jwt callback. No test failure. Users get `newPreference` on login but it's lost on JWT refresh.
- **Suggested fix:** Add a unit test that constructs an `AuthUserRecord` with all fields set, calls both `createSuccessfulLoginResponse` and `syncTokenWithUser`, and asserts that the resulting objects have the same set of keys and values. Run this test in CI.

### CR9-TE2 — [MEDIUM] No integration test for SSE re-auth behavior

- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts`
- **Evidence:** The SSE re-auth check (fire-and-forget async IIFE) is a critical security control with no test coverage. There is no test that verifies:
  1. A deactivated user's SSE connection is closed within the re-auth interval
  2. The re-auth check does not prevent the final result event from being sent
  3. The connection tracking is correctly cleaned up after re-auth failure
- **Failure scenario:** The re-auth check silently breaks due to a code change (e.g., `getApiUser` changes its return type). No test catches the regression.
- **Suggested fix:** Add an integration test that: (1) opens an SSE connection, (2) deactivates the user, (3) waits for the re-auth interval, (4) verifies the connection is closed.

### CR9-TE3 — [LOW] No test for `normalizeValue` handling of BigInt

- **Confidence:** MEDIUM
- **File:** `src/lib/db/export.ts:215-222`
- **Cross-agent agreement:** verifier CR9-V3
- **Evidence:** If a BigInt value ever reaches `normalizeValue`, `JSON.stringify` would throw. There's no test for this edge case.
- **Suggested fix:** Add a unit test for `normalizeValue` with BigInt input.

### CR9-TE4 — [LOW] Missing route-level tests for playground run endpoint

- **Confidence:** HIGH
- **File:** `src/app/api/v1/playground/run/route.ts`
- **Evidence:** The playground run endpoint has no route-level tests. This endpoint accepts user-submitted code and executes it in a Docker container — it's a high-risk endpoint that should have test coverage.
- **Failure scenario:** A code change breaks the stdin handling or the language validation. No test catches it.
- **Suggested fix:** Add route-level tests that mock `executeCompilerRun` and verify: valid language, disabled language, invalid language, source code too large, missing auth.

## Previously Identified Gaps (Still Open)

- Tags GET route: tests added in prior cycle (commit 37fabda0)
- Files GET (list) route: no tests
- Groups/[id]/assignments route: no tests
- Admin backup/restore/migrate routes: no tests
- PublicHeader dropdown: tests added in prior cycle (commit 37fabda0)
