# Code Reviewer — Cycle 19

**Date:** 2026-04-24
**Base commit:** f1817fdf

---

## Findings

### CR-1: [MEDIUM] `hcaptchaSecret` Missing from `ALWAYS_REDACT` in `export.ts` — Full-Fidelity Backup Leaks Encrypted hCaptcha Secret

**File:** `src/lib/db/export.ts:245-258`
**Confidence:** HIGH

The `ALWAYS_REDACT` map on line 255-258 redacts `passwordHash` from `users` and `encryptedKey` from `apiKeys` even in full-fidelity backup exports. However, `systemSettings.hcaptchaSecret` is NOT in `ALWAYS_REDACT` or `SANITIZED_COLUMNS`. The `hcaptchaSecret` column stores the hCaptcha secret encrypted with AES-256-GCM, but the encrypted ciphertext is still sensitive — it can be decrypted by anyone who has the `NODE_ENCRYPTION_KEY`, and the ciphertext itself leaks the fact that hCaptcha is configured.

In a full-fidelity backup export, the `systemSettings` table row will include the `hcaptchaSecret` column value (the `enc:...` string). If the backup file is leaked, an attacker with the encryption key can decrypt it. Even without the key, the presence of the `enc:` prefix reveals the encryption scheme and the fact that hCaptcha is configured.

**Concrete failure scenario:** An admin downloads a full-fidelity backup for disaster recovery. The backup JSON file contains the `systemSettings` row including `hcaptchaSecret: "enc:a1b2c3:..."`. The file is accidentally committed to a public repo or shared with an unauthorized party. An attacker with the `NODE_ENCRYPTION_KEY` (which may also be in the backup's env vars) can decrypt the hCaptcha secret.

**Fix:** Add `systemSettings: new Set(["hcaptchaSecret"])` to the `ALWAYS_REDACT` map in `src/lib/db/export.ts`.

---

### CR-2: [LOW] `leaderboard.ts` Uses `Date.now()` for Freeze Boundary Check — Clock Skew Can Cause Premature/Delayed Freeze

**File:** `src/lib/assignments/leaderboard.ts:52-53`
**Confidence:** MEDIUM

`computeLeaderboard()` uses `Date.now()` to determine whether the leaderboard is frozen (`nowMs >= freezeAt`). The freeze time (`freezeLeaderboardAt`) is stored in PostgreSQL. All other contest boundary checks (anti-cheat route, submission routes, assignment PATCH route) use DB server time via `getDbNowUncached()` or raw `SELECT NOW()`.

Under clock skew between the app server and DB, students may see the leaderboard freeze too early or too late relative to the actual freeze time recorded in the database. For a contest with a freeze time set to exactly 14:00, if the app server is 2 seconds fast, students see the frozen leaderboard at 13:59:58.

**Concrete failure scenario:** An instructor sets `freezeLeaderboardAt` to 14:00 via the admin UI (which stores it in PostgreSQL). The app server's clock is 3 seconds ahead. At 13:59:57 local time (14:00:00 DB time), `Date.now()` returns 13:59:57, which is before the freeze. Students continue seeing the live leaderboard for 3 extra seconds. If the app server is behind, they see the freeze prematurely.

**Fix:** Replace `Date.now()` with `await getDbNowMs()` in `computeLeaderboard()` at line 52, consistent with other contest boundary checks. The function is already async.

---

### CR-3: [LOW] `anti-cheat/route.ts` Mixed Clock Sources — DB Time for Contest Boundaries, `Date.now()` for Heartbeat Throttle

**File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:63-67, 92`
**Confidence:** LOW

The anti-cheat route correctly uses `SELECT NOW()` (DB server time) for contest boundary checks (lines 63-73) but uses `Date.now()` for the in-memory heartbeat throttle (line 92). This is internally consistent since the in-memory LRU cache uses `Date.now()` for its TTL and the throttle is purely local, but it creates a mixed-clock-source pattern in the same request handler. The risk is minimal since the 60-second heartbeat throttle doesn't need DB-precise timing.

**Concrete failure scenario:** Under extreme clock skew (minutes, not seconds), the heartbeat throttle could fire earlier or later than expected relative to the contest boundaries, but this would only affect how frequently heartbeat events are logged — not correctness.

**Fix:** Low priority. Document the intentional clock source split in a comment, or unify to DB time for consistency.

---

### CR-4: [LOW] `export.ts` `SANITIZED_COLUMNS` Missing `hcaptchaSecret` from `systemSettings`

**File:** `src/lib/db/export.ts:245-252`
**Confidence:** HIGH

Related to CR-1 but for the sanitized export path. The `SANITIZED_COLUMNS` map does not include `systemSettings.hcaptchaSecret`. In a sanitized export, the hCaptcha secret (encrypted ciphertext) would still be present. The `systemSettings` table is not even listed in `SANITIZED_COLUMNS`, so none of its columns are sanitized in human-downloadable exports.

**Fix:** Add `systemSettings: new Set(["hcaptchaSecret"])` to `SANITIZED_COLUMNS` in `src/lib/db/export.ts`.

---

## Verified Safe

### VS1: No `@ts-ignore`, `@ts-expect-error`, or `eslint-disable` suppressions found in source
All code quality suppressions are absent — the codebase uses no type-escape hatches.

### VS2: No empty catch blocks (except legitimate `localStorage` fallbacks)
All `catch {}` blocks are in client-side `localStorage` fallbacks (use-source-draft.ts) or have explicit error handling.

### VS3: No `as any` type casts in server code
Only one `as any` found in `src/lib/assignments/management.ts` — likely a Drizzle ORM type mismatch.

### VS4: `dangerouslySetInnerHTML` usage is safe
Two uses found: `json-ld.tsx` uses `safeJsonForScript()` (escapes `</script` and `<!--`), and `problem-description.tsx` uses `sanitizeHtml()` (DOMPurify with strict allowlist).

### VS5: `sanitizeMarkdown` now has unit tests
The cycle 17 review noted missing tests (AGG-6). Tests now exist in `tests/unit/security/sanitize-html.test.ts` covering null bytes, control characters, newline/tab preservation, and normal text pass-through.
