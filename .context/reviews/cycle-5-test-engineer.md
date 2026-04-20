# Test Engineer — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** test-engineer

## Findings

### TE-1: No test coverage for `escapeLikePattern` utility [MEDIUM/HIGH]

**File:** `src/lib/db/like.ts`

**Description:** The `escapeLikePattern` utility is used across 20+ files in the codebase but has no dedicated unit test. This is the central LIKE escape function — if it breaks, it breaks every search feature. The function is small and pure, making it trivial to test.

**Fix:** Add unit tests covering:
- Normal strings (no special characters) — passthrough
- Strings with `%` — should be escaped to `\%`
- Strings with `_` — should be escaped to `\_`
- Strings with `\` — should be escaped to `\\` FIRST
- Strings with `\%` (backslash before percent) — backslash should NOT escape the percent
- Strings with `\\` (double backslash) — should become `\\\\`

**Confidence:** HIGH

---

### TE-2: No test coverage for `getDbNow` utility [LOW/MEDIUM]

**File:** `src/lib/db-time.ts`

**Description:** The `getDbNow` utility was introduced in cycle 27 but has no dedicated test. The `recruit-page-metadata.test.ts` tests verify that the recruit page uses it, but there is no direct test for the utility itself (e.g., that it returns a Date, that `React.cache()` deduplicates calls).

**Fix:** Add a unit test for `getDbNow` that verifies:
- It returns a Date object
- The returned Date is reasonable (within a few seconds of `new Date()`)
- The fallback to `new Date()` works when the DB query returns null

**Confidence:** MEDIUM

---

### TE-3: No test coverage for API key expiry check using app-server time [LOW/MEDIUM]

**File:** `src/lib/api/api-key-auth.ts:86`

**Description:** There is no test verifying the API key expiry behavior. If the expiry check is updated to use DB-sourced time (per SEC-1), a test should verify the new behavior.

**Fix:** Add a test for `authenticateApiKey` covering:
- Expired key is rejected
- Non-expired key is accepted
- Key with no expiry is always accepted (if that's the intended behavior)

**Confidence:** MEDIUM

---

### TE-4: No test coverage for exam session deadline enforcement [LOW/MEDIUM]

**File:** `src/lib/assignments/exam-sessions.ts:49-56`

**Description:** The exam session creation checks if the assignment has started and if the deadline has passed, but there are no tests for these temporal boundary conditions.

**Fix:** Add tests for `startExamSession` covering:
- Attempt to start before `startsAt` — should throw "assignmentNotStarted"
- Attempt to start after `deadline` — should throw "assignmentClosed"
- Successful start within the valid window
- Idempotent behavior when called twice

**Confidence:** MEDIUM

---

## Verified Safe

- 277+ test files, 1932+ tests, all passing.
- IP allowlist tests cover CIDR edge cases well.
- Security tests cover encryption, timing-safe comparison, rate limiting, and CSRF.
- Component tests use proper mocking patterns.
- The `recruit-page-metadata.test.ts` tests added in cycle 27 verify DB-sourced time usage.
