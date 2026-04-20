# Cycle 6 Code Reviewer

**Date:** 2026-04-20
**Base commit:** 528cdf29

## Findings

### CR-1: Contest detail page uses `new Date()` for access-control-adjacent temporal comparisons [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:188-192`
**Description:** The contest detail page computes `isUpcoming` and `isPast` using `new Date()` on lines 188-192:
```
const now = new Date();
const isUpcoming = assignment.startsAt != null && new Date(assignment.startsAt) > now;
const isPast = ...new Date(assignment.deadline) < now;
```
These status flags determine what UI the user sees (e.g., whether the contest is shown as "upcoming" vs "open" vs "closed"). While actual submission access is enforced by API routes using DB time, the `isUpcoming` flag controls whether users are blocked from viewing problems before the contest starts (similar to the problem page on line 159). If the app server clock drifts behind the DB server, users could see problems before the official start time.
**Failure scenario:** A student sees contest problems before the official start time because `isUpcoming` evaluates to `false` on the app server while the DB considers the contest not yet started.
**Fix:** Use `getDbNow()` in this server component instead of `new Date()`.
**Confidence:** HIGH

### CR-2: Problem detail page uses `new Date()` for contest start access gate [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/problems/[id]/page.tsx:159,187-189`
**Description:** Line 159 blocks access before contest start: `new Date(assignment.startsAt) > new Date()`. Line 187-189 determines if submissions are blocked: `const now = new Date(); const effectiveDeadline = ...; const isSubmissionBlocked = effectiveDeadline ? new Date(effectiveDeadline) < now : false;`. These use app-server time for access control decisions.
**Failure scenario:** If app server clock drifts ahead, a student could be blocked from submitting before the actual deadline. If it drifts behind, they could submit after the actual deadline (though the API route would still enforce it server-side).
**Fix:** Use `getDbNow()` instead of `new Date()` on lines 159 and 187.
**Confidence:** HIGH

### CR-3: Groups page uses `new Date()` for assignment status display [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/groups/[id]/page.tsx:304-308`
**Description:** The groups page computes assignment status (upcoming/past) using `new Date()` in a client component render. This is display-only (the actual assignment submission is enforced by API routes using DB time), but it creates inconsistent UX where a contest could appear "open" on the groups page while the API enforces it as "closed".
**Failure scenario:** Assignment appears as "open" in the groups list but submitting returns "deadline passed" from the API.
**Fix:** Low priority — the API is the source of truth. Could pass DB-sourced time from the server component for consistency.
**Confidence:** MEDIUM

### CR-4: Quick-create contest route uses `new Date()` for contest schedule [LOW/MEDIUM]

**File:** `src/app/api/v1/contests/quick-create/route.ts:28-32`
**Description:** `const now = new Date()` is used as the default `startsAt` when the client doesn't provide one. This value is stored directly in the DB. If the app server clock is significantly off from the DB server clock, the stored `startsAt` could be wrong. The `startsAt` and `deadline` values are used for access control in other routes (exam sessions, submission validation) that correctly use `NOW()`.
**Failure scenario:** Admin creates a quick contest without specifying `startsAt`. The stored `startsAt` is the app server's time. If the DB clock is 5 minutes ahead, the contest appears to have started 5 minutes early from the DB's perspective, potentially allowing submissions before the admin intended.
**Fix:** Use `getDbNowUncached()` for the default `startsAt` value. The `deadline` default calculation should also use DB-sourced time.
**Confidence:** MEDIUM

### CR-5: `submittedAt: new Date()` in submission insert uses app-server time [LOW/LOW]

**File:** `src/app/api/v1/submissions/route.ts:317`
**Description:** Inside the transaction, `submittedAt: new Date()` uses app-server time for the stored timestamp. The deadline check on line 298 correctly uses `NOW()` in SQL, so access control is correct. But the stored `submittedAt` timestamp could be slightly off from the DB server's time.
**Failure scenario:** A submission is recorded as submitted at 12:00:00 (app server time) when the DB server time is 11:59:58. This is cosmetic — the deadline enforcement uses `NOW()`.
**Fix:** Use `DEFAULT NOW()` in the schema for `submittedAt` instead of passing it from JS, or use the transaction's `SELECT NOW()` result.
**Confidence:** LOW

## Verified Safe

- Auth flow is robust with Argon2id, timing-safe dummy hash, rate limiting, and proper token invalidation.
- No `dangerouslySetInnerHTML` without sanitization.
- No `as any` type casts.
- No `@ts-ignore` or `@ts-expect-error`.
- Only 2 eslint-disable directives, both justified.
- Encryption module properly validates key in production.
- Import/export routes properly require password re-confirmation and enforce size limits.
- Shell command validation has dual-layer defense (denylist + allowlist prefix).
- SQL LIKE queries all properly use `escapeLikePattern`.
- `getDbNow()` / `getDbNowUncached()` are properly implemented and used where needed.
- Previous cycle fixes (recruit page clock-skew, SSE viewerId, etc.) are all confirmed working.
