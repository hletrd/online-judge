# Cycle 14 Critic Report

**Base commit:** 74d403a6
**Reviewer:** critic
**Scope:** Multi-perspective critique, challenging assumptions, edge cases

---

## CR14-CT1 — [MEDIUM] `changePassword` TOCTOU race — same class of bug that `consumeRateLimitAttemptMulti` was designed to fix

- **Confidence:** HIGH
- **Files:** `src/lib/actions/change-password.ts:40-53`
- **Evidence:** The `changePassword` server action uses the check-then-record pattern (`isRateLimited` then `recordRateLimitFailure`) that `consumeRateLimitAttemptMulti` was specifically designed to replace. The auth login path was refactored to use `consumeRateLimitAttemptMulti` for atomicity, but the change-password path was missed. This is the exact same anti-pattern.
- **What could go wrong:** Concurrent wrong-password attempts bypass the rate limit, allowing brute-force attacks on the change-password endpoint.

## CR14-CT2 — [MEDIUM] `recordRateLimitFailureMulti` insert uses `windowStartedAt: now` while all other functions use `entry.windowStartedAt` — subtle behavioral difference

- **Confidence:** MEDIUM
- **Files:** `src/lib/security/rate-limit.ts:261`
- **Evidence:** When `recordRateLimitFailureMulti` inserts a new entry, it uses `windowStartedAt: now` at line 261. But `recordRateLimitFailure` at line 225 uses `windowStartedAt: entry.windowStartedAt`. And `consumeRateLimitAttemptMulti` at line 184 also uses `entry.windowStartedAt`. For a new entry, `getEntry` returns `entry.windowStartedAt = now`, so the values are the same. But if `getEntry`'s logic ever changes (e.g., to preserve the original window start for expired windows), this inconsistency would cause behavioral differences. The `entry.windowStartedAt` pattern is more correct because it uses the value that `getEntry` computed.
- **Suggested fix:** Normalize `recordRateLimitFailureMulti` to use `entry.windowStartedAt` like the others.

## CR14-CT3 — [LOW] `api-rate-limit.ts` `atomicConsumeRateLimit` does not increment `consecutiveBlocks` — no backoff escalation for persistent API abusers

- **Confidence:** MEDIUM
- **Files:** `src/lib/security/api-rate-limit.ts:70-109`
- **Evidence:** The login rate limiter tracks `consecutiveBlocks` for exponential backoff. The API rate limiter always uses `consecutiveBlocks: 0` on insert and never updates it. This means an attacker who repeatedly hits the API rate limit gets the same block duration every time, with no escalation. For a competitive programming platform, this means automated scrapers or brute-force tools face no increasing penalty.
- **Suggested fix:** Either add `consecutiveBlocks` tracking (matching `rate-limit.ts`), or document that API rate limits use fixed blocking without backoff.

## CR14-CT4 — [LOW] `validateShellCommand` regex rejects `>` and `<` which blocks redirect operators — already documented but worth re-examining

- **Confidence:** LOW
- **Files:** `src/lib/compiler/execute.ts:156`
- **Evidence:** The regex `/`|\$\(|\$\{|[<>]\(|\|\||\||>|<|\n|\r|\beval\b|\bexec\b|\bsource\b/` blocks `>` and `<` entirely. This is already deferred (L3). However, the regex also blocks `<(` (process substitution) which is a subset already covered. The `[<>]\(` pattern matches `<(` and `>(` but the standalone `>` and `<` patterns make the `[<>]\(` redundant. This is a minor observation about regex efficiency, not a security issue.
- **Suggested fix:** No action needed. Already deferred.

## Final Sweep

- Challenged the assumption that `mustChangePassword: false` in API key auth is acceptable. If an admin forces a password change, the user should be blocked from ALL access methods, including API keys.
- Challenged the assumption that `recordRateLimitFailure` in `changePassword` is sufficient. It is not atomic.
- Challenged the assumption that `consecutiveBlocks: 0` in API rate limiting is acceptable. Without escalation, persistent abusers face no increasing penalty.
