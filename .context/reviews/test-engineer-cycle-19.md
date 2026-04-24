# Test Engineer — Cycle 19

**Date:** 2026-04-24
**Base commit:** f1817fdf

---

## Findings

### T-1: [LOW] No Test for Export Redaction Coverage of Secret Columns

**Files:** `src/lib/db/export.ts:245-258`, related test files
**Confidence:** HIGH

There is no automated test that validates the `SANITIZED_COLUMNS` and `ALWAYS_REDACT` maps in `export.ts` include entries for all known secret columns in the schema. This is the same systemic gap that was identified and fixed for `REDACT_PATHS` in cycle 17 (AGG-4). The current gap: `systemSettings.hcaptchaSecret` is missing from both maps but no test caught it.

**Fix:** Add a test that:
1. Defines a `KNOWN_SECRET_COLUMNS` map listing expected secret columns by table.
2. Validates that `ALWAYS_REDACT` includes at least those entries.
3. Validates that `SANITIZED_COLUMNS` includes at least those entries (plus the broader set).
4. Fails when a new secret column is added to the schema without updating the export redaction maps.

---

### T-2: [LOW] `computeLeaderboard` Freeze Boundary Not Tested for Clock Skew

**File:** `src/lib/assignments/leaderboard.ts:52-53`
**Confidence:** MEDIUM

The `computeLeaderboard` function uses `Date.now()` for the freeze boundary check. There is no test that validates the freeze behavior when the app server clock differs from the DB clock. While this would be difficult to test precisely (it's a `Date.now()` call, not a parameter), the function could be refactored to accept a `now` parameter for testability, similar to `getRetentionCutoff`.

**Fix:** Low priority. Refactor `computeLeaderboard` to accept an optional `nowMs` parameter (defaulting to `Date.now()`), and add a test that verifies freeze behavior with explicit timestamps.

---

## Verified Safe

### VS1: `sanitizeMarkdown` now has comprehensive unit tests
Tests cover null bytes, control characters, newline/tab preservation, normal text, empty string, and mixed content. This resolves the AGG-6 finding from cycle 17.

### VS2: Audit event flush tests properly validate re-buffer ordering
Tests in `tests/unit/audit/events.test.ts` verify that after a flush failure, the buffer maintains correct chronological ordering (the fix from cycle 18b).

### VS3: REDACT_PATHS coverage test exists
`tests/unit/auth/rate-limit-await.test.ts` or `tests/unit/security/` validates that `REDACT_PATHS` includes known secret fields. The same pattern should be applied to export redaction.
