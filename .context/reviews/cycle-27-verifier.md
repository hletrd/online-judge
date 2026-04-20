# Cycle 27 Verifier

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### V-1: Recruit page temporal logic diverges from API — consistency gap confirmed [MEDIUM/HIGH]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:33,89,167`
**Description:** Verified that the recruit page uses `new Date()` for temporal comparisons while the API (`src/app/api/v1/recruiting/validate/route.ts:36`) uses `SQL NOW()`. The comment in the API file explicitly states the reason: "Use SQL NOW() for expiry validation instead of new Date() to avoid clock skew between app server and DB server." This fix was not propagated to the server-rendered page.
**Evidence:**
- API route line 36: `sql\`(${recruitingInvitations.expiresAt} IS NULL OR ${recruitingInvitations.expiresAt} > NOW())\``
- Page line 33: `invitation.expiresAt && invitation.expiresAt < new Date()`
- Page line 89: same pattern
- Page line 167: `assignment.deadline && assignment.deadline < new Date()`

**Fix:** Fetch DB server time alongside the invitation and use it for page-level comparisons.
**Confidence:** HIGH

### V-2: `toLocaleString()` locale behavior depends on server environment [LOW/MEDIUM]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:218`
**Description:** `new Date(assignment.deadline).toLocaleString()` runs on the server where the locale defaults to the server's system locale, not the user's preferred locale. The app uses next-intl for internationalization, so this should use the intl formatter.
**Fix:** Replace with next-intl date formatting.
**Confidence:** MEDIUM

## Verified Safe

- All gates pass: 288 tests (2027 assertions) green, eslint clean, tsc clean.
- Previous cycle-26 fixes are confirmed working (recruit test, ESLint config, React.cache, tracking comments).
- Auth flow is robust with proper session validation, CSRF, and rate limiting.
- No regressions from recent commits.
