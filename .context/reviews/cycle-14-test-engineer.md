# Cycle 14 Test Engineer Report

**Base commit:** 74d403a6
**Reviewer:** test-engineer
**Scope:** Test coverage gaps, flaky tests, TDD opportunities

---

## CR14-TE1 — [MEDIUM] No test for `changePassword` TOCTOU race condition — concurrent wrong-password attempts

- **Confidence:** HIGH
- **Files:** `tests/unit/actions/change-password.test.ts` (existing), `src/lib/actions/change-password.ts`
- **Evidence:** The existing change-password tests likely test sequential behavior. There is no test verifying that concurrent wrong-password attempts are properly rate-limited. Given that the rate limiting is not atomic (see CR14-CR1), a test would have caught this.
- **Suggested fix:** Add a test that sends multiple concurrent wrong-password attempts and verifies that the rate limit is enforced correctly. This test would currently fail, confirming the TOCTOU bug.

## CR14-TE2 — [LOW] No test for `recordRateLimitFailureMulti` windowStartedAt inconsistency

- **Confidence:** MEDIUM
- **Files:** `tests/unit/server-action-rate-limit-await.test.ts` (or similar)
- **Evidence:** The `recordRateLimitFailureMulti` uses `windowStartedAt: now` for inserts while other functions use `entry.windowStartedAt`. There is no test verifying that all rate-limit functions produce consistent windowStartedAt values for the same scenario.
- **Suggested fix:** Add a test that calls each rate-limit function for a new key and verifies the windowStartedAt is consistent.

## CR14-TE3 — [LOW] No test for API key auth `mustChangePassword` behavior

- **Confidence:** MEDIUM
- **Files:** No test file for `src/lib/api/api-key-auth.ts`
- **Evidence:** `authenticateApiKey` hardcodes `mustChangePassword: false`. There is no test verifying that API key auth bypasses the forced-password-change check.
- **Suggested fix:** Add a test case: create a user with `mustChangePassword: true`, create an API key for them, verify that `authenticateApiKey` returns `mustChangePassword: false`. Document whether this is intentional.

## CR14-TE4 — [LOW] `api-rate-limit.ts` `consecutiveBlocks` always 0 — no test for API rate limit backoff escalation

- **Confidence:** LOW
- **Files:** No specific test file
- **Evidence:** The API rate limiter never increments `consecutiveBlocks`. There's no test verifying whether API rate limits should have backoff escalation.
- **Suggested fix:** If backoff is not intended for API rate limits, add a test confirming `consecutiveBlocks` is always 0. If it is intended, add a test verifying escalation.

## Final Sweep

- Previous test gaps (D21, D22) remain deferred.
- Component test infrastructure for PublicHeader (D5) remains deferred.
- Integration test coverage for SSE auth re-check is limited (D4 deferred).
