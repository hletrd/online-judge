# Security Reviewer Lane - Cycle 1

**Date:** 2026-04-26
**Scope:** Full repository security audit, focus on 4 changed files

## Findings

### Finding SEC-1: Cookie clearing now follows single source of truth — improvement [LOW/HIGH]

**File:** `src/proxy.ts:87-96`, `src/lib/security/env.ts:172-180`

The cookie clearing function now derives cookie names from the same constants used by authConfig, eliminating the risk of hardcoded-string drift. Previously, the strings `"authjs.session-token"` and `"__Secure-authjs.session-token"` were hardcoded in proxy.ts. The new approach ensures consistency.

**Verdict:** Security improvement. No vulnerability introduced.

---

### Finding SEC-2: No X-Requested-With header check in analytics route [MEDIUM/MEDIUM]

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:32`

AGENTS.md states: "CSRF: Mutation API routes require the X-Requested-With: XMLHttpRequest header." The analytics route is GET (not a mutation), but `createApiHandler` defaults CSRF check to false for GET requests. This is correct per the handler framework.

**Verdict:** No issue — GET routes don't require CSRF headers. Verified via `handler.ts:143`: `MUTATION_METHODS.has(req.method)` only includes POST/PUT/PATCH/DELETE.

---

### Finding SEC-3: Date.now() usage in rate-limit cooldown doesn't weaken security [LOW/MEDIUM]

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:90`

The Date.now() fallback in `_lastRefreshFailureAt` is only used for cooldown (preventing thundering herd on DB failure), not for authorization or rate-limiting. Clock skew of 1-2s is irrelevant for a 5s cooldown. The rate limiter itself (`api-rate-limit.ts`) correctly uses `getDbNowMs()` for all authorization-relevant time comparisons.

**Example:** `api-rate-limit.ts:58-59` uses `const now = await getDbNowMs()` for all rate-limit window comparisons. `api-rate-limit.ts:165,203` uses `await getDbNowMs()` for `X-RateLimit-Reset` headers.

**Verdict:** No security issue. Analytics cache cooldown is not a security boundary.

---

### Finding SEC-4: Cookie name constants are appropriate for their scope [LOW/HIGH]

**File:** `src/lib/security/env.ts:8-9`

The constants `AUTH_SESSION_COOKIE_NAME` and `SECURE_AUTH_SESSION_COOKIE_NAME` are module-level constants not exported. The new `getAuthSessionCookieNames()` is the only public API to access them. This encapsulation is correct — the constants should not be spread across the codebase.

**Verdict:** Good security encapsulation.

---

### Finding SEC-5: No auth bypass in analytics route [MEDIUM/HIGH]

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:32-43`

The analytics route:
1. Uses `createApiHandler` which defaults `auth = true` — requires authentication
2. Checks DB for assignment existence and exam mode
3. Validates `canViewAssignmentSubmissions` for authorization

**Verdict:** Properly secured. No bypass.

---

### Finding SEC-6: Anti-cheat monitor sends user behavior data — no PII exposure [LOW/HIGH]

**File:** `src/components/exam/anti-cheat-monitor.tsx:226-247`

The `describeElement` function intentionally avoids capturing text content (line 238-239: "text content is intentionally NOT captured to avoid storing copyrighted exam problem text"). Only element types and parent class names are captured.

**Verdict:** Privacy-conscious design. No PII in anti-cheat events.

---

### Finding SEC-7: Proxy CSP headers remain unchanged [LOW/HIGH]

**File:** `src/proxy.ts:210-222`

CSP headers are not affected by the cookie name change. The `createSecuredNextResponse` function is called separately from `clearAuthSessionCookies`. No CSP regression.

**Verdict:** No security regression.

---

## Broader Security Observations

### OBS-1: Auth cache TTL and security tradeoff documented

**File:** `src/proxy.ts:23-27`

The in-process auth cache has a 2-second TTL with explicit documentation of the security tradeoff: revoked/deactivated users may retain access for up to 2 seconds. This is a reasonable tradeoff documented in comments.

### OBS-2: Session cookie clearing handles both variants

**File:** `src/proxy.ts:87-96`

Clearing both `authjs.session-token` and `__Secure-authjs.session-token` prevents session-fixation-like issues where a cookie from a previous security context lingers. The non-secure cookie is cleared without `secure: true` flag, matching how it was set.

### OBS-3: Rate limiter sidecar architecture is defense-in-depth

**File:** `src/lib/security/api-rate-limit.ts:28-35,148-176`

Two-tier rate limiting: Rust sidecar for fast pre-check, PostgreSQL for authoritative enforcement. Sidecar failure falls through to DB path — never fail-closed (line 25: "MUST NEVER fail-closed here").

---

## Summary

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| SEC-1 | Cookie name consistency — improvement | LOW | HIGH |
| SEC-2 | CSRF check for GET — no issue | MEDIUM | MEDIUM |
| SEC-3 | Date.now() in cooldown — no security impact | LOW | MEDIUM |
| SEC-4 | Cookie constant encapsulation — good | LOW | HIGH |
| SEC-5 | Auth check — no bypass | MEDIUM | HIGH |
| SEC-6 | Anti-cheat privacy — good design | LOW | HIGH |
| SEC-7 | CSP headers — no change | LOW | HIGH |

Total: 0 security vulnerabilities found in the changes. 7 findings, all verifying correct security posture.
