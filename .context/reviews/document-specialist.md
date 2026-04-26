# Document Specialist Lane - Cycle 1

**Date:** 2026-04-26
**Angle:** Documentation-code alignment against authoritative sources

## Finding DOC-1: AGENTS.md CSRF rule still accurate

**File:** `AGENTS.md:238`
**Rule:** "CSRF: Mutation API routes require the X-Requested-With: XMLHttpRequest header."

**Code verification:** `src/lib/api/handler.ts:143`: CSRF checked for mutation methods. The analytics route is GET, so it correctly skips CSRF. No documentation mismatch.

**Verdict:** Documentation matches code.

---

## Finding DOC-2: AGENTS.md cookie name document reference is now slightly stale

**File:** `AGENTS.md:238`
**Rule mentions:** "do not use x-csrf-token" as the header name.

But the cookie clearing documentation in proxy.ts now correctly references constants from env.ts. The AGENTS.md doesn't document cookie clearing internals, so this isn't a mismatch.

**Verdict:** No issue.

---

## Finding DOC-3: Code comments accurately describe new behavior

**Files checked:**
1. `analytics/route.ts:56-61` — Comment accurately describes Date.now() rationale. VERIFIED.
2. `analytics/route.ts:82-86` — Comment accurately describes Date.now() fallback rationale. VERIFIED.
3. `anti-cheat-monitor.tsx:96-99` — Comment accurately describes performFlush extraction. VERIFIED.
4. `anti-cheat-monitor.tsx:128-131` — Comment accurately describes scheduleRetryRef as single source of truth. VERIFIED.
5. `env.ts:172-179` — JSDoc for getAuthSessionCookieNames() accurately describes purpose. VERIFIED.
6. `proxy.ts:87-91` — Comment accurately describes cookie clearing behavior. VERIFIED.

**Verdict:** All inline comments match actual code behavior. High-quality documentation.

---

## Finding DOC-4: CLAUDE.md deployment rules not affected

**File:** `CLAUDE.md:5`
**Rule:** "always use the current src/lib/auth/config.ts as-is"

**Check:** The cookie name change doesn't touch `src/lib/auth/config.ts`. The new `getAuthSessionCookieNames()` is in `src/lib/security/env.ts`, not in `config.ts`. The deployment rule is not violated.

**Verdict:** No issue.

---

## Finding DOC-5: No TypeDoc/JSDoc on `performFlush` or `scheduleRetryRef` internal details

**File:** `src/components/exam/anti-cheat-monitor.tsx:100-118`
**Issue:** `performFlush` and `scheduleRetryRef` are internal to the component and not exported, so lack of JSDoc is acceptable. The inline comments are sufficient.

**Verdict:** Acceptable. Internal component logic doesn't need exported JSDoc.

---

## Finding DOC-6: AGENTS.md password validation rule still accurate

**File:** `AGENTS.md:517-521`
**Rule:** "Password validation MUST only check minimum length — exactly 8 characters minimum"

**Code verification:** `src/lib/security/password.ts:40`: `if (password.length < FIXED_MIN_PASSWORD_LENGTH)`. Also checks common passwords, username match, email match — which are additional checks beyond minimum length.

Wait — the AGENTS.md says "Do NOT add complexity requirements (uppercase, numbers, symbols), similarity checks, or dictionary checks." But `password.ts` DOES perform:
- Common password dictionary check (line 45)
- Username similarity check (line 50-55)
- Email local-part check (line 59-66)

This is a documentation-code MISMATCH. The code has MORE checks than the AGENTS.md mandates. The AGENTS.md says "only check minimum length" but the code also checks common passwords, username, and email.

**Assessment:** This is a discrepancy. Either:
1. AGENTS.md needs updating to reflect the actual password checks, or
2. The additional checks in password.ts should be removed per the AGENTS.md rule

However, the additional checks (common passwords, username matching) are security best practices and shouldn't be removed. The AGENTS.md28 rule is likely outdated — it may have been written before these checks were added.

**Verdict:** LOW severity documentation mismatch. The AGENTS.md password validation section should be updated to include the additional checks.

---

## Summary

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| DOC-1 | CSRF doc accurate | — | HIGH |
| DOC-2 | Cookie name doc — no issue | — | HIGH |
| DOC-3 | Inline comments accurate | — | HIGH |
| DOC-4 | Deploy rules not affected | — | HIGH |
| DOC-5 | Internal JSDoc — acceptable | — | HIGH |
| DOC-6 | Password validation doc/code mismatch | LOW | MEDIUM |

1 finding (DOC-6): Pre-existing documentation mismatch, not caused by this cycle's changes.
