# Cycle 18 Security Reviewer Findings

**Date:** 2026-04-19
**Reviewer:** OWASP top 10, secrets, unsafe patterns, auth/authz
**Base commit:** 7c1b65cc

---

## Findings

### F1: Admin backup/restore/migrate routes verify password but discard `needsRehash` — bcrypt hashes persist for admin-heavy users

- **File**: `src/app/api/v1/admin/backup/route.ts:62`, `src/app/api/v1/admin/restore/route.ts:56`, `src/app/api/v1/admin/migrate/export/route.ts:56`, `src/app/api/v1/admin/migrate/import/route.ts:58,143`
- **Severity**: LOW
- **Confidence**: HIGH
- **Description**: All four admin data-management routes verify the user's password using `verifyPassword()` but only destructure `{ valid }`, discarding `needsRehash`. This is the same pattern identified in the cycle-18 comprehensive review (F2). The recruiting-invitations path has been fixed (now rehashes on `needsRehash`). The `change-password.ts` path is correctly handled (user is setting a new password anyway). However, these admin routes present a genuine missed rehash opportunity: an admin who only interacts with the system via backup/restore operations (rare but possible in a highly automated environment) would never have their bcrypt hash upgraded.
- **Concrete failure scenario**: An admin with a bcrypt hash verifies their password to download a backup. The `needsRehash` flag is true but discarded. The admin's password remains stored as bcrypt. If the admin never logs in through the main login page (e.g., uses API key auth for daily work), their hash is never upgraded.
- **Suggested fix**: Add rehash logic after successful password verification in the backup and export routes. The restore and import routes are lower risk since they run infrequently and the admin is likely to log in normally soon after.

### F2: `getRecruitingAccessContext` does not cache results — potential for timing-based user enumeration via repeated requests

- **File**: `src/lib/recruiting/access.ts:14-66`
- **Severity**: LOW
- **Confidence**: LOW
- **Description**: `getRecruitingAccessContext` queries the database on every call without any caching. An attacker who can observe response times could potentially distinguish between users who have recruiting invitations and those who don't, since the query will be faster for users with no invitations (empty result set). However, this is a very weak signal and would require many requests to establish a statistical baseline.
- **Concrete failure scenario**: Not practically exploitable with current query complexity (two simple indexed queries). The timing difference is likely sub-millisecond and swamped by network jitter.
- **Suggested fix**: Add request-scoped caching as suggested in the code reviewer's F1. This is more of a performance issue than a security one, but the caching also eliminates the minor timing side channel.

### F3: Internal cleanup endpoint rate limiting depends only on `CRON_SECRET` — no IP or request-count restrictions

- **File**: `src/app/api/internal/cleanup/route.ts:7-24`
- **Severity**: LOW
- **Confidence**: MEDIUM
- **Description**: The `/api/internal/cleanup` endpoint is protected only by a Bearer token (`CRON_SECRET`). There is no rate limiting, IP allowlist, or request count tracking. If `CRON_SECRET` is leaked (e.g., committed to a public repo, exposed in a log), any client can call this endpoint without restriction. The endpoint performs expensive batched DELETE operations that can cause significant DB load.
- **Concrete failure scenario**: `CRON_SECRET` is accidentally logged in a verbose debug output. An attacker discovers the secret and calls the cleanup endpoint in a tight loop, causing repeated batched DELETEs against `audit_events` and `login_events`, consuming DB connections and I/O.
- **Suggested fix**: Add rate limiting via `consumeApiRateLimit(request, "internal:cleanup")`. Alternatively, restrict the endpoint to internal IPs only (e.g., `127.0.0.1`) since cron jobs should only originate from the same server.

---

## Verified Safe

### VS1: Password hashing is properly implemented with argon2id
- All password verification paths use `verifyPassword()` which correctly differentiates bcrypt and argon2 hashes. The main login flow performs transparent rehashing.

### VS2: DOMPurify sanitization is properly configured
- `sanitizeHtml` uses strict allowlists, `ALLOW_DATA_ATTR: false`, and proper URI restrictions. No XSS vectors found.

### VS3: SQL injection is prevented throughout
- All raw queries use parameterized placeholders (`@paramName`). No string interpolation of user input into SQL.

### VS4: Recruiting token redemption is properly atomic
- Uses SQL-level `NOW()` for expiry validation and atomic `UPDATE ... WHERE` for claim. No TOCTOU races.

### VS5: Admin data-management routes have proper CSRF protection
- All admin routes check CSRF unless using API key auth. The `csrfForbidden` check is correctly placed before the capability check.
