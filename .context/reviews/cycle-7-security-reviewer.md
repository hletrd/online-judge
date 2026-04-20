# Security Reviewer — Cycle 7 Deep Review

**Date:** 2026-04-20
**Scope:** OWASP Top 10, secrets, unsafe patterns, auth/authz

---

## Findings

### HIGH 1 — `tokenInvalidatedAt` clock-skew undermines session revocation guarantee

**Confidence:** HIGH
**Files:**
- `src/app/api/v1/users/[id]/route.ts:164,185,218,260,466`
- `src/lib/actions/user-management.ts:114,308`
- `src/lib/actions/change-password.ts:75`
- `src/lib/assignments/recruiting-invitations.ts:242,359`
- `src/lib/auth/session-security.ts:26-36`
- `src/proxy.ts:240-274`

**Problem (OWASP A07:2021 — Identification and Authentication Failures):** Session revocation relies on comparing `tokenInvalidatedAt` (set via `new Date()`) against `authenticatedAtSeconds` from the JWT. The proxy re-checks this on every protected request. If the app server clock drifts forward (e.g., NTP correction after a period of drift), a JWT's `authenticatedAt` field (set via `Date.now()` at login time) could be AHEAD of a subsequently set `tokenInvalidatedAt`, causing `isTokenInvalidated()` to return `false` for a session that should be revoked. This creates a window where a deactivated user, or a user whose password was just changed by an admin, can continue accessing protected resources.

**Concrete failure scenario:**
1. App server clock drifts 10 seconds ahead of DB.
2. User logs in; JWT `authenticatedAt` = 1010 (app time), but DB time = 1000.
3. Admin deactivates user; `tokenInvalidatedAt` = `new Date()` = 1010 (app time, DB time 1000).
4. `isTokenInvalidated(1010, 1010)` = `1010 < 1010` = `false`. Session NOT invalidated.
5. Deactivated user continues accessing the system.

**Suggested fix:** Use `await getDbNowUncached()` for all `tokenInvalidatedAt` assignments. This ensures the invalidation timestamp is always in the DB clock reference frame, which is the same reference frame used by the proxy's DB lookup.

---

### HIGH 2 — Public contest pages use `new Date()` for access-control-adjacent status

**Confidence:** HIGH
**Files:**
- `src/lib/assignments/public-contests.ts:30,124`

**Problem (OWASP A01:2021 — Broken Access Control):** The public contests listing and detail pages determine contest status (open/closed) using `new Date()` instead of DB time. If the app server clock is behind the DB server, a closed contest appears open, potentially allowing users to attempt joining or starting an exam that has already ended. While the API-level checks use DB time (preventing actual unauthorized access), the UX displays incorrect state, which could be used for social engineering or confusion.

**Suggested fix:** Use `await getDbNow()` for contest status determination.

---

### MEDIUM 1 — Anti-cheat events `createdAt` timestamp inconsistency

**Confidence:** HIGH
**Files:**
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:110,128`

**Problem:** Anti-cheat event records are inserted with `createdAt: new Date()` while the boundary check uses `SELECT NOW()`. If clocks drift, an anti-cheat event's timestamp could appear to fall outside the contest window when compared against other DB-sourced timestamps, undermining the audit trail's integrity.

**Suggested fix:** Use the already-fetched DB time (line 63) for `createdAt` in both inserts.

---

### MEDIUM 2 — Invite route `redeemedAt`/`enrolledAt` clock-skew

**Confidence:** MEDIUM
**Files:**
- `src/app/api/v1/contests/[assignmentId]/invite/route.ts:103,115`

**Problem:** The invite route stores timestamps using `new Date()` while access code redemption (`access-codes.ts`) uses DB time for deadline checks. Timestamp inconsistency.

**Suggested fix:** Use `await getDbNowUncached()`.

---

### LOW 1 — DOMPurify allows `img` tags with `src` attribute in HTML sanitization

**Confidence:** LOW
**Files:**
- `src/lib/security/sanitize-html.ts:9-15,37`

**Problem:** The HTML sanitizer allows `<img>` tags with `src` attribute. While there is a hook that removes `src` for non-root-relative URLs (line 10-15), root-relative URLs like `/api/v1/files/any-id` are permitted. This is by design (to allow uploaded images in problem descriptions), but could be used for limited SSRF-like behavior if the files API has any side effects on GET. The current files API is read-only, so this is low risk.

**No fix needed** — current behavior is intentional and the API is read-only.

---

## Final sweep

No additional security-critical findings. The existing auth/CSRF/redirect validation infrastructure is solid. The `getSafeRedirectUrl()` function properly validates callback URLs against open-redirect attacks. SQL injection is mitigated by Drizzle ORM parameterized queries and `escapeLikePattern()`. The `dangerouslySetInnerHTML` usage is properly sanitized via DOMPurify.
