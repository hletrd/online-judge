# Cycle 14 Tracer Report

**Base commit:** 74d403a6
**Reviewer:** tracer
**Scope:** Causal tracing of suspicious flows, competing hypotheses

---

## Flow 1 — Change Password Rate Limiting

**Trace:** `changePassword()` -> `isRateLimited(key)` -> `execTransaction(getEntry + blockedUntil > now)` -> returns false -> `verifyPassword()` -> fails -> `recordRateLimitFailure(key)` -> `execTransaction(getEntry + increment)`

**Finding:** The `isRateLimited` transaction reads the entry with `SELECT FOR UPDATE` and returns a boolean. The transaction then commits and releases the row lock. `recordRateLimitFailure` starts a NEW transaction, reads the entry again (with a new `SELECT FOR UPDATE`), and increments. Between these two transactions, another request can read the same pre-increment value and also pass the `isRateLimited` check. This is a textbook TOCTOU race.

**Hypothesis:** This is the same anti-pattern that `consumeRateLimitAttemptMulti` was designed to fix for the login path. The change-password path was likely missed because it was written before the atomic pattern was introduced.

**Fix:** Replace the two-call pattern with `consumeRateLimitAttemptMulti(rateLimitKey)`, which does check+increment atomically.

## Flow 2 — API Key Auth mustChangePassword

**Trace:** `authenticateApiKey()` -> fetch creator user from DB -> return `{ ..., mustChangePassword: false, _apiKeyAuth: true }` -> `getApiUser()` returns this -> middleware `proxy()` checks `activeUser.mustChangePassword` -> sees `false` -> allows access

**Finding:** The API key auth path always returns `mustChangePassword: false`, even if the creator user's actual `mustChangePassword` field in the DB is `true`. The DB query at lines 89-93 fetches `authUserSelect` which includes `mustChangePassword`, but the returned object hardcodes it to `false`.

**Hypothesis:** This was likely an oversight when the API key auth was first implemented. The `mustChangePassword` field was not considered relevant for API key auth (machine-to-machine). But in a system where admins can force password changes, bypassing this check via API key undermines the security policy.

**Fix:** Read `mustChangePassword` from the fetched user object instead of hardcoding `false`.

## Flow 3 — Rate Limit Window Start Consistency

**Trace:** `recordRateLimitFailureMulti(key)` -> `getEntry(key)` -> returns `{ entry: { windowStartedAt: now }, exists: false }` -> insert with `windowStartedAt: now` (line 261)

vs

`recordRateLimitFailure(key)` -> `getEntry(key)` -> returns `{ entry: { windowStartedAt: now }, exists: false }` -> insert with `windowStartedAt: entry.windowStartedAt` (line 225)

**Finding:** For new entries, both use `now` as the value. But the source of the value differs: one uses the raw variable `now`, the other uses `entry.windowStartedAt` which was set to `now` by `getEntry`. If `getEntry`'s logic changes (e.g., preserving the original window start for expired windows in the reset path), the `entry.windowStartedAt` version would be more correct because it reflects what `getEntry` computed. The `now` version would ignore `getEntry`'s computation.

**Fix:** Normalize all insert paths to use `entry.windowStartedAt`.

## Final Sweep

- Traced the login flow end-to-end: credentials -> authorize() -> createSuccessfulLoginResponse() -> syncTokenWithUser() -> mapTokenToSession() -> session. All fields are properly mapped.
- Traced the capability resolution flow: user.role -> resolveCapabilities() -> cache -> Set. Works correctly for both built-in and custom roles.
- Traced the navigation rendering flow: capabilities -> getDropdownItems() -> PublicHeader dropdown items vs capabilities -> filterItems() -> AppSidebar items. Both use capability-based filtering. The dropdown lacks "contests" which the sidebar has — this is a minor gap.
