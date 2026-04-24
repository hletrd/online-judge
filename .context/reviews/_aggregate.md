# Aggregate Review — Cycle 19

**Date:** 2026-04-24
**Reviewers:** code-reviewer, security-reviewer, perf-reviewer, architect, test-engineer, debugger
**Total findings:** 8 (deduplicated to 3)

---

## Deduplicated Findings (sorted by severity)

### AGG-1: [MEDIUM] `hcaptchaSecret` Missing from Export Redaction Maps — Leaked in All Backup Exports

**Sources:** CR-1, CR-4, S-1, S-2, A-1, D-1 | **Confidence:** HIGH
**Cross-agent signal:** 6 of 6 review perspectives

The `systemSettings.hcaptchaSecret` column is not included in either `SANITIZED_COLUMNS` or `ALWAYS_REDACT` in `src/lib/db/export.ts:245-258`. While the logger's `REDACT_PATHS` was updated to include `hcaptchaSecret` in cycle 17, the parallel update to the export module was never made. As a result, all backup exports (both sanitized and full-fidelity) include the encrypted hCaptcha secret ciphertext.

The `ALWAYS_REDACT` map already protects `users.passwordHash` and `apiKeys.encryptedKey` in full-fidelity backups. The `hcaptchaSecret` column stores the hCaptcha site secret encrypted with AES-256-GCM, but in operational disaster recovery scenarios, the backup file and `NODE_ENCRYPTION_KEY` are often co-located, making the ciphertext decryptable.

This is a systemic issue: secret column redaction is fragmented across three independent configuration points (logger, export, audit), and there is no test to validate consistency. The `hcaptchaSecret` omission in the logger was caught and fixed in cycle 17, but the same omission in the export module was not.

**Concrete failure scenario:** An admin downloads a full-fidelity backup for disaster recovery. The JSON file contains `systemSettings.hcaptchaSecret: "enc:a1b2c3:..."`. The backup is stored on a shared drive alongside the `.env` file containing `NODE_ENCRYPTION_KEY`. A low-privileged user with access to both can decrypt the hCaptcha secret and programmatically bypass CAPTCHA verification.

**Fix:**
1. Add `systemSettings: new Set(["hcaptchaSecret"])` to `SANITIZED_COLUMNS` in `src/lib/db/export.ts`
2. Add `systemSettings: new Set(["hcaptchaSecret"])` to `ALWAYS_REDACT` in `src/lib/db/export.ts`
3. Add a test that validates `ALWAYS_REDACT` and `SANITIZED_COLUMNS` include entries for known secret columns (`passwordHash`, `encryptedKey`, `hcaptchaSecret`)

---

### AGG-2: [LOW] `computeLeaderboard` Uses `Date.now()` for Freeze Boundary — Clock Skew Inconsistency

**Sources:** CR-2, CR-3, A-2, D-2, T-2 | **Confidence:** MEDIUM
**Cross-agent signal:** 5 of 6 review perspectives

`computeLeaderboard()` in `src/lib/assignments/leaderboard.ts:52` uses `Date.now()` to determine whether the leaderboard should be frozen (`nowMs >= freezeAt`), while the freeze time is stored in PostgreSQL. All other contest boundary checks (anti-cheat route, submission routes, assignment PATCH route) use DB server time via `getDbNowMs()` or `SELECT NOW()`.

Under clock skew between the app server and database, students may see the leaderboard freeze too early (app server clock ahead) or too late (app server clock behind) relative to the actual freeze time recorded in the database.

**Concrete failure scenario:** An instructor sets `freezeLeaderboardAt` to 14:00:00 via the admin UI. The app server's clock is 3 seconds ahead. At 13:59:57 local time (14:00:00 DB time), `Date.now()` returns 13:59:57, which is before the freeze. Students continue seeing the live leaderboard for 3 extra seconds after the actual freeze time.

**Fix:** Replace `const nowMs = Date.now()` with `const nowMs = await getDbNowMs()` at line 52 of `src/lib/assignments/leaderboard.ts`. The function is already async.

---

### AGG-3: [LOW] Proxy Auth Cache Cleanup Iterates All Entries on Every `setCachedAuthUser` Call

**Sources:** P-2 | **Confidence:** LOW
**Cross-agent signal:** 1 of 6 review perspectives

The fix from cycle 18b (AGG-6) added expired entry cleanup in `setCachedAuthUser` (lines 68-75 of `src/proxy.ts`). However, the cleanup iterates ALL entries in the cache on every `set` call when `size > 0`. Under high traffic, this adds per-request overhead proportional to cache size.

`getCachedAuthUser` already deletes expired entries on read (line 60). The `setCachedAuthUser` cleanup is redundant for entries that will be read soon, and wasteful for entries that won't be read again.

**Concrete failure scenario:** 500 concurrent users. Each request calls `setCachedAuthUser` after a DB lookup. The cleanup iterates 500+ entries each time, adding ~0.1ms per request.

**Fix:** Only run cleanup when `size >= AUTH_CACHE_MAX_SIZE * 0.9` (i.e., when eviction is imminent) rather than on every set.

---

## Carried Forward from Prior Cycle-18b Aggregate (AGG-1 through AGG-6)

The following findings from `rpf-cycle-18b-aggregate.md` are carried forward unchanged:

| ID | Finding | Severity | Status |
|----|---------|----------|--------|
| AGG-1(c18) | Inconsistent locale handling in number formatting | MEDIUM/MEDIUM | Open |
| AGG-2(c18) | Access code share link missing locale prefix | LOW/MEDIUM | Open |
| AGG-3(c18) | Practice page progress-filter in-JS filtering at scale | MEDIUM/MEDIUM | Open |
| AGG-4(c18) | Hardcoded English error string in api-keys clipboard | LOW/MEDIUM | Open |
| AGG-5(c18) | `userId!` non-null assertion in practice page | LOW/MEDIUM | Open |
| AGG-6(c18) | Copy-code-button no error feedback on clipboard failure | LOW/LOW | Open |
| AGG-7(c18) | Practice page component exceeds 700 lines | LOW/MEDIUM | Open |
| AGG-8(c18) | Recruiting invitations panel `min` date uses client time | LOW/LOW | Open |

## Previously Deferred Items (Still Active)

All prior deferred items from cycle 18b and earlier remain unchanged. See `rpf-cycle-18b-comprehensive-review.md` lines 119-141 for the full list.

## Positive Observations

- `sanitizeMarkdown` now has comprehensive unit tests (resolves cycle 17 AGG-6)
- No `@ts-ignore`, `@ts-expect-error`, or `eslint-disable` suppressions found
- No `as any` type casts in server code (1 in management.ts for Drizzle ORM)
- `dangerouslySetInnerHTML` usage is safe (DOMPurify + safeJsonForScript)
- Audit event flush re-buffer now preserves chronological ordering (cycle 18b fix verified)
- Proxy auth cache expired entry cleanup works correctly (cycle 18b fix verified)
- Cron cleanup endpoint properly gated behind `ENABLE_CRON_CLEANUP` (cycle 18b fix verified)
- All prior cycle 16-18 fixes remain correctly implemented

## No Agent Failures

All 6 review perspectives completed successfully.
