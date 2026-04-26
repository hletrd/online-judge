# Verifier Lane - Cycle 1

**Date:** 2026-04-26
**Angle:** Evidence-based correctness verification against stated behavior

## Verification Results

### VER-1: Analytics staleness optimization — VERIFIED CORRECT

**Stated behavior:** "Use Date.now() for the staleness check instead of getDbNowMs() to avoid a DB round-trip on every cache-hit request."

**Evidence:**
- Line 62: `const nowMs = Date.now()` — local time, no DB call. VERIFIED.
- `getDbNowMs()` at `db-time.ts:51-52` calls `getDbNowUncached()` which executes `SELECT NOW()::timestamptz AS now`. VERIFIED it's a DB query.
- Lines 79, 106: Cache writes still use `await getDbNowMs()`. VERIFIED.
- Lines 88-90: Fallback pattern: try `await getDbNowMs()`, catch → `Date.now()`. VERIFIED.

**Behavior match:** Code matches stated behavior. The staleness check avoids DB round-trips. Cache writes (where authoritative time matters) still use DB time.

---

### VER-2: Date.now() fallback on DB failure — VERIFIED CORRECT but implementation is nested

**Stated behavior:** "If the DB is unreachable, getDbNowMs() will also throw, leaving the cooldown unset and allowing a thundering herd on every subsequent request. Date.now() is acceptable here."

**Evidence:**
- Line 87-91: `try { _lastRefreshFailureAt.set(cacheKey, await getDbNowMs()); } catch { _lastRefreshFailureAt.set(cacheKey, Date.now()); }`
- This nested try/catch is inside the outer `catch` block of the refresh IIFE.

**Match:** The code does implement the stated fallback. If `getDbNowMs()` throws, `Date.now()` is used as the cooldown timestamp. VERIFIED.

**Edge case:** What if both `computeContestAnalytics` AND `getDbNowMs()` fail? The outer IIFE's `.catch(() => {})` handles the rejection. The `_refreshingKeys` key is deleted in `finally`. This is correct — the guard is reset even on double-failure.

---

### VER-3: scheduleRetryRef as single source of truth — VERIFIED CORRECT

**Stated behavior:** "This is the single source of truth for retry scheduling logic — both flushPendingEvents and reportEvent delegate here instead of duplicating the has-retriable check, backoff calculation, and timer setup."

**Evidence:**
- Line 125: `flushPendingEvents` calls `scheduleRetryRef.current(remaining)` after performFlush
- Line 169: `reportEvent` calls `scheduleRetryRef.current(pending)` on send failure
- Lines 132-145: `useEffect` updates `scheduleRetryRef.current` with the full retry logic
- Both callers go through the same ref. There is no duplicated retry logic elsewhere.

**Match:** VERIFIED. The retry scheduling logic exists in exactly one place (the useEffect at 132-145).

**Check:** The ref is initialized as `() => {}` (line 118). If called before the useEffect runs, it's a no-op. Is this OK?
- `flushPendingEvents` is called in `useEffect` at line 183 (`void flushPendingEventsRef.current()`)
- `reportEvent` is called in event handlers (copy, paste, visibility change)
- The `useEffect` at 132 runs after the initial render and sets `scheduleRetryRef.current`
- `reportEvent` can't fire before the component mounts (event handlers are registered in useEffect at 209)
- THEREFORE: the initial `() => {}` is never called with real events. VERIFIED SAFE.

---

### VER-4: Cookie name identity — VERIFIED CORRECT

**Stated behavior:** "The cookie names are derived from the same source as authConfig so they stay in sync if the naming convention ever changes."

**Evidence:**
- `env.ts:8-9`: `SECURE_AUTH_SESSION_COOKIE_NAME = "__Secure-authjs.session-token"`, `AUTH_SESSION_COOKIE_NAME = "authjs.session-token"`
- `env.ts:178-179`: `getAuthSessionCookieNames()` returns `{ name: AUTH_SESSION_COOKIE_NAME, secureName: SECURE_AUTH_SESSION_COOKIE_NAME }`
- Old code in proxy.ts (pre-change): `response.cookies.set("authjs.session-token", ...)`, `response.cookies.set("__Secure-authjs.session-token", ...)`
- New code: `const { name, secureName } = getAuthSessionCookieNames()` then uses `name` and `secureName`

**Identity check:**
- `name` = `AUTH_SESSION_COOKIE_NAME` = `"authjs.session-token"` — matches old hardcoded string
- `secureName` = `SECURE_AUTH_SESSION_COOKIE_NAME` = `"__Secure-authjs.session-token"` — matches old hardcoded string

**Match:** VERIFIED. The function returns exactly the same values as the old hardcoded strings.

---

### VER-5: authConfig cookie name source — VERIFIED CONSISTENT

Let's check what authConfig uses for cookie names.

**Evidence:**
- `env.ts:166-169`: `getAuthSessionCookieName()` returns `shouldUseSecureSessionCookie() ? SECURE_AUTH_SESSION_COOKIE_NAME : AUTH_SESSION_COOKIE_NAME`
- The same constants are used. authConfig picks one, proxy clears both.

**Match:** VERIFIED. Both modules use the same source constants.

---

### VER-6: Test suite status — 1 FAILURE (proxy.test.ts)

**Unit tests:** 302 files, 2192 passed, 15 failed (all in proxy.test.ts)
**Root cause:** Test mock at `tests/unit/proxy.test.ts:51-53` does not export `getAuthSessionCookieNames`.
**Integration tests:** All 3 files skipped (no DB connection)
**Component tests:** All passed

**Match:** The code itself is correct, but the test mock needs updating. This is a test-configuration issue, not a code bug.

---

### VER-7: TypeScript type check — PASSED

`npx tsc --noEmit` completed with exit code 0. No type errors.

---

## Summary

| ID | Finding | Status |
|----|---------|--------|
| VER-1 | Analytics staleness optimization | VERIFIED CORRECT |
| VER-2 | Date.now() fallback on DB failure | VERIFIED CORRECT |
| VER-3 | scheduleRetryRef as single source of truth | VERIFIED CORRECT |
| VER-4 | Cookie name identity with hardcoded strings | VERIFIED CORRECT |
| VER-5 | authConfig source consistency | VERIFIED CONSISTENT |
| VER-6 | Test suite — 15 failures | NEEDS FIX (mock) |
| VER-7 | TypeScript check | PASSED |

All 4 changed files behave as stated in their comments. The only issue is the test mock gap.
