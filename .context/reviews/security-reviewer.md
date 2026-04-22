# Security Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** security-reviewer
**Base commit:** b3147a98

## Findings

### SEC-1: `bulk-create-dialog.tsx` calls `response.json()` before `response.ok` — SyntaxError on non-JSON error can mask server errors [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/users/bulk-create-dialog.tsx:212-215`

**Description:** The bulk user creation endpoint calls `response.json()` before checking `response.ok`. On a non-JSON error response, this throws SyntaxError that the catch block handles as a generic error. For an admin operation that creates multiple users, losing the error message means the admin cannot tell which users were created and which failed.

**Fix:** Check `response.ok` before `response.json()`.

**Confidence:** HIGH

---

### SEC-2: `window.location.origin` used in `access-code-manager.tsx` and `workers-client.tsx` — previously flagged as DEFER-24 [LOW/MEDIUM]

**Files:**
- `src/components/contest/access-code-manager.tsx:134`
- `src/app/(dashboard)/dashboard/admin/workers/workers-client.tsx:147`

**Description:** Carried forward from prior cycles (DEFER-24). These components use `window.location.origin` to build shareable URLs. Behind a misconfigured reverse proxy, these URLs could be incorrect, leading users to a wrong host.

**Fix:** Use a server-provided `appUrl` config value.

**Confidence:** MEDIUM

---

### SEC-3: `create-group-dialog.tsx` exposes raw error messages from server via toast [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:33-44,67`

**Description:** The `getErrorMessage` function maps known error codes to i18n keys, but the default case on line 43 returns `error.message` verbatim. If the server returns an unexpected error message (e.g., internal stack trace in development), this is displayed in a toast.

**Fix:** Map unknown errors to a generic i18n key instead of showing raw `error.message`.

**Confidence:** LOW

---

## Final Sweep

The CSRF protection, auth config, session security, and password hashing remain solid. The rate-limiter circuit breaker pattern in `rate-limiter-client.ts` is well-implemented with proper fail-open semantics. The Docker sandbox in `execute.ts` has proper security boundaries (--network=none, --cap-drop=ALL, seccomp, read-only rootfs). The shell command validation is thorough with both basic and strict validators. No new critical security findings.
