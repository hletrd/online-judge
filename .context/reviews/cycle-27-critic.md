# Cycle 27 Critic

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### CRI-1: Recruit page clock-skew vs API — user-facing consistency gap [MEDIUM/HIGH]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:33,89,167`
**Description:** The recruit page renders expiry/deadline state using `new Date()` (app server clock), while the validating API uses SQL `NOW()` (DB server clock). This is a consistency gap that affects user trust: a candidate could see "valid invitation" on the page but get "expired" when they try to start the exam. The API fix (commit b42a7fe4) was correctly scoped to the API route, but the page was missed.
**Failure scenario:** Candidate opens a recruit link that is about to expire. The page shows "valid" (app server is 2 min behind DB). They click "Start" and the API returns "expired". Confusing and frustrating experience.
**Fix:** Fetch DB server time alongside the invitation and use it for all comparisons on the page.
**Confidence:** HIGH

### CRI-2: `toLocaleString()` used without locale context on recruit page [LOW/MEDIUM]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:218`
**Description:** The deadline is formatted with `new Date(assignment.deadline).toLocaleString()` which uses the server's default locale. The app is internationalized with next-intl and Korean locale support, so this should use the user's locale.
**Failure scenario:** Korean users see dates in English locale format.
**Fix:** Use the next-intl date formatter or `@/lib/datetime` utilities.
**Confidence:** MEDIUM

## Verified Safe

- The codebase is in excellent shape overall after 26+ review cycles.
- Previous findings (flaky test, ESLint warnings, React.cache dedup, Korean tracking comments) are all resolved.
- Security posture is strong: Argon2id passwords, timing-safe comparisons, CSRF protection, rate limiting, DOMPurify sanitization, SQL parameterization.
- The `createApiHandler` middleware pattern is well-designed and consistently applied to the majority of routes.
