# Cycle 14 Code Reviewer Report

**Base commit:** 74d403a6
**Reviewer:** code-reviewer
**Scope:** Full repository code quality, logic correctness, SOLID, maintainability

---

## CR14-CR1 — [MEDIUM] `recordRateLimitFailure` uses single-key transaction while `consumeRateLimitAttemptMulti` is atomic multi-key — TOCTOU race in `changePassword`

- **Confidence:** HIGH
- **Files:** `src/lib/actions/change-password.ts:40-53`, `src/lib/security/rate-limit.ts:118-123,195-232`
- **Evidence:** The `changePassword` server action calls `isRateLimited(key)` then `recordRateLimitFailure(key)` as two separate DB operations. The `isRateLimited` function uses `execTransaction` with `SELECT FOR UPDATE`, but `recordRateLimitFailure` also starts its own transaction. Between the `isRateLimited` check and the `recordRateLimitFailure` increment, another request could slip through because the row lock from `isRateLimited`'s transaction has already been released. The auth login path correctly uses `consumeRateLimitAttemptMulti` which does an atomic check+increment in a single transaction. The change-password path does not.
- **Failure scenario:** User has 4 out of 5 rate limit attempts. Two concurrent change-password requests with wrong passwords both pass the `isRateLimited` check (4 < 5), then both increment to 5, but neither gets blocked because the threshold was not checked atomically with the increment. Both requests get "currentPasswordIncorrect" instead of one being rate-limited.
- **Suggested fix:** Replace the `isRateLimited` + `recordRateLimitFailure` pair with `consumeRateLimitAttemptMulti(rateLimitKey)`, which atomically checks and increments in a single transaction. This mirrors the auth login pattern.

## CR14-CR2 — [MEDIUM] `recordRateLimitFailure` and `recordRateLimitFailureMulti` use `windowStartedAt: entry.windowStartedAt` for updates but `windowStartedAt: now` for inserts — inconsistent vs `consumeRateLimitAttemptMulti`

- **Confidence:** MEDIUM
- **Files:** `src/lib/security/rate-limit.ts:225,261`
- **Evidence:** In `recordRateLimitFailure`, when inserting a new entry (line 222-229), it uses `windowStartedAt: entry.windowStartedAt`. But in `recordRateLimitFailureMulti`, when inserting (line 258-266), it uses `windowStartedAt: now`. The `consumeRateLimitAttemptMulti` uses `windowStartedAt: entry.windowStartedAt` consistently for both update and insert. This means `recordRateLimitFailureMulti` creates entries with a different window start time than the other two functions, which could cause subtle timing differences in rate-limit window calculations.
- **Failure scenario:** A rate-limit key is first encountered via `recordRateLimitFailureMulti` (gets `windowStartedAt: now`), then later via `consumeRateLimitAttemptMulti` (gets `windowStartedAt: entry.windowStartedAt` from the existing row). The window start time is correct in both cases, but the inconsistency suggests the `now` in `recordRateLimitFailureMulti` insert was an oversight. The `entry.windowStartedAt` is already set to `now` for non-existent entries (from `getEntry`), so using `entry.windowStartedAt` would be identical and more consistent.
- **Suggested fix:** Change `windowStartedAt: now` to `windowStartedAt: entry.windowStartedAt` in `recordRateLimitFailureMulti` line 261, matching the pattern in the other two functions.

## CR14-CR3 — [LOW] `canManageUsers` and `isInstructorOrAbove` sync functions in `role-helpers.ts` are unused dead code

- **Confidence:** HIGH
- **Files:** `src/lib/auth/role-helpers.ts:30-32,46-48`
- **Evidence:** Grep for `canManageUsers(` shows only the definition at line 30. Grep for `isInstructorOrAbove(` shows only the definition at line 46. Both are sync functions that only work for built-in roles. The async versions (`canManageUsersAsync`, `isInstructorOrAboveAsync`) are used instead. These sync functions are dead code, just like `canManageRole` which was removed in cycle 14.
- **Suggested fix:** Remove `canManageUsers` and `isInstructorOrAbove` sync functions, keeping only the async versions.

## CR14-CR4 — [LOW] `isAtLeastRole` in `role-helpers.ts` is only used by the two dead-code sync functions above

- **Confidence:** HIGH
- **Files:** `src/lib/auth/role-helpers.ts:11-13`
- **Evidence:** `isAtLeastRole` is only called by `canManageUsers` (line 31) and `isInstructorOrAbove` (line 47). If those are removed, `isAtLeastRole` becomes dead code too. The async version `isAtLeastRoleAsync` exists and is used.
- **Suggested fix:** Remove `isAtLeastRole` along with `canManageUsers` and `isInstructorOrAbove`.

## CR14-CR5 — [LOW] `SSE onPollResult` has duplicate terminal-state-fetch logic in two code paths

- **Confidence:** MEDIUM
- **Files:** `src/app/api/v1/submissions/[id]/events/route.ts:316-384, 393-414`
- **Evidence:** The `onPollResult` callback has nearly identical terminal-state-fetch logic in two places: (1) inside the re-auth async IIFE (lines 350-370) and (2) in the non-re-auth path (lines 393-414). Both query the full submission, sanitize it, enqueue a result event, and close. This duplication means any change to the terminal-state handling must be applied in two places.
- **Suggested fix:** Extract a `sendFinalResultAndClose` helper function that both code paths call.

## CR14-CR6 — [LOW] `api-rate-limit.ts` `atomicConsumeRateLimit` does not set `consecutiveBlocks` on insert or update

- **Confidence:** MEDIUM
- **Files:** `src/lib/security/api-rate-limit.ts:70-81, 89-109`
- **Evidence:** The API rate limiter's `atomicConsumeRateLimit` function never sets `consecutiveBlocks` on insert (line 70-81, missing from values) or update (line 102-108, missing from set). The login rate limiter in `rate-limit.ts` correctly tracks `consecutiveBlocks` for exponential backoff. The API rate limiter always uses `0` for `consecutiveBlocks`, meaning the backoff cap never escalates even for repeated rate limit violations.
- **Failure scenario:** A user hits the API rate limit, waits for the window to expire, hits it again, and so on. With `consecutiveBlocks` stuck at 0, the block duration never increases, so there's no escalation for persistent abusers.
- **Suggested fix:** This may be intentional (API rate limits may not need exponential backoff). If so, add a comment explaining why. If not, add `consecutiveBlocks` tracking.

## Final Sweep

- No bare `catch {}` blocks remain (all have comments or logging).
- `isAdmin()` is now internal-only in `auth.ts` (fast-path for `isAdminAsync`), not called externally.
- No `catch () => {}` patterns that swallow errors in critical paths.
- Auth module field mapping is now consistent after cycle 13 Object.assign fix.
