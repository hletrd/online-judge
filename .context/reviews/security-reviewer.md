# Security-Reviewer Pass — RPF Cycle 3/100

**Date:** 2026-04-27
**Lane:** security-reviewer
**Scope:** OWASP Top 10, secrets, unsafe patterns, auth/authz, with emphasis on cycle-2 commits (env.ts factory, proxy.ts cookie clearing, analytics route)

## Summary

The cycle-2 security surface is clean. The `getAuthSessionCookieNames` factory consolidates cookie naming in one place, reducing drift risk. The analytics route changes do not affect authn/authz (the original `canViewAssignmentSubmissions` check is preserved).

The deferred items from cycle 2 (AGG-9 `__Secure-` cookie clear over HTTP, AGG-11 password.ts vs AGENTS.md) are both still applicable — neither is exploitable, both have clear deferral rationales.

## Findings

### SEC3-1: [LOW] `clearAuthSessionCookies` clears `__Secure-` cookie with literal `secure: true` regardless of request protocol

**File:** `src/proxy.ts:94`
**Confidence:** MEDIUM

In dev (HTTP), the browser ignores `Set-Cookie` with `Secure`, so the clear is a no-op. In production (HTTPS), the `Secure` flag is correct.

Risk surface: dev-only nuisance (a stale `__Secure-` cookie could persist if a developer flipped between HTTPS and HTTP). Production is HTTPS-only and `__Secure-` is the only variant set, so the clear works.

**Fix:** Defer (cycle-2 AGG-9 deferred). No security impact in production.

---

### SEC3-2: [LOW] Analytics route does not log the user ID on background refresh failures

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:53`
**Confidence:** LOW

The `logger.error({ err, assignmentId }, ...)` does not include the `user.id` of the requester. For audit purposes, knowing which user triggered a stale refresh that then failed could help correlate with abuse patterns (e.g., a user repeatedly hitting an endpoint to trigger DB load).

**Failure scenario:** Forensic — debugging an abuse vector requires correlating logs against access logs.

**Fix:** Optional. Pass `user.id` into `refreshAnalyticsCacheInBackground` (or a request-correlation ID). Not a security bug.

---

### SEC3-3: [LOW] AGENTS.md vs `src/lib/security/password.ts` policy mismatch (carried from cycle 2 AGG-11)

**File:** `AGENTS.md:516-521`, `src/lib/security/password.ts:45,50,59`
**Confidence:** MEDIUM

AGENTS.md states "Password validation MUST only check minimum length"; `password.ts` enforces dictionary + similarity checks. Either side could be the truth — removing the checks would weaken security; updating the doc would change the rule.

Per cycle-2 deferral: requires user/PM decision before any code or doc change. Neither side should be silently flipped.

**Fix:** Defer. Re-flag in cycle-3 plan.

---

### SEC3-4: [INFO] Cycle-2 commits did not introduce any new credentials, secrets, or unsafe patterns

**Confidence:** N/A (informational)

- `getAuthSessionCookieNames` only returns string constants; no secrets touched.
- `proxy.ts` change is name-only; no auth logic change.
- Analytics route refactor preserves the existing `canViewAssignmentSubmissions` authorization check (line 74).
- No `eval`, `Function(...)`, `dangerouslySetInnerHTML`, raw HTML injection, or unsafe deserialization introduced.
- `npm audit` was not run this cycle but was clean as of the cycle-2 baseline.

---

### SEC3-5: [LOW] No CSRF token check observed for `/api/v1/contests/[assignmentId]/analytics` (GET only)

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts`
**Confidence:** LOW

GET requests don't typically need CSRF protection (no mutating side effect). The route is GET-only, so this is correct. Confirming the absence — not a finding.

## Verification Notes

- `git log --since="3 days ago" --grep="(security)"` shows only the cycle-2 commits (`1c25cbed feat(security)`).
- No secrets in git diff or log.
- `npm run lint` clean.

## Confidence

- MEDIUM: SEC3-1 (deferred, dev-only nuisance), SEC3-3 (deferred, requires user decision).
- LOW: SEC3-2 (optional log enrichment), SEC3-5 (confirm-no-finding).
- INFO: SEC3-4.

No HIGH-severity findings. Cycle-3 security surface is steady-state.
