# Cycle 6 Security Reviewer

**Date:** 2026-04-20
**Base commit:** 528cdf29

## Findings

### SEC-1: Contest detail page clock-skew reveals problems before start time [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:188-192`
**Description:** The `isUpcoming` flag computed with `new Date()` controls whether contest problems are visible. In a windowed exam, problems should only be visible after the start time. If the app server clock is behind the DB clock, students see problems before the official start.
**Failure scenario:** During a proctored exam, students with access to the contest detail page can see problem descriptions before the exam officially starts. This undermines the exam integrity.
**Fix:** Use `getDbNow()` instead of `new Date()`.
**Confidence:** HIGH

### SEC-2: Problem page access gate uses app-server time [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/problems/[id]/page.tsx:159`
**Description:** `new Date(assignment.startsAt) > new Date()` controls whether non-admin users are redirected away from the problem page before contest start. Clock skew could allow early access to problems.
**Failure scenario:** Student accesses a problem URL directly. If the app server clock is behind the DB server, they see the problem before the contest starts.
**Fix:** Use `getDbNow()` instead of `new Date()`.
**Confidence:** HIGH

### SEC-3: Quick-create contest stores app-server time as `startsAt` [MEDIUM/MEDIUM]

**File:** `src/app/api/v1/contests/quick-create/route.ts:28-32`
**Description:** When `body.startsAt` is not provided, `const now = new Date()` is stored as the default `startsAt`. This stored value is then used by exam session enforcement and submission deadline checks that use DB time (`NOW()`). A discrepancy between the stored app-server timestamp and the DB clock could cause unexpected behavior.
**Failure scenario:** Admin creates a quick contest. The stored `startsAt` is the app server's time (e.g., 10:00:00). The DB server time is 10:00:05. Exam session enforcement uses `NOW()` which returns 10:00:05. The contest appears to have started 5 seconds early from the DB's perspective.
**Fix:** Use `await getDbNowUncached()` for the default `startsAt` and `deadline` calculation.
**Confidence:** MEDIUM

### SEC-4: Submission deadline blocking on problem page uses app-server time [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/problems/[id]/page.tsx:187-189`
**Description:** `isSubmissionBlocked` is computed using `new Date()`. This controls UI-level submission blocking. While the API route enforces deadlines using DB time, the UI could misleadingly show the submission form as available or blocked when it shouldn't be.
**Failure scenario:** A student sees the "Submit" button as active when the deadline has actually passed (API will reject), causing frustration. Or conversely, the button is disabled when there's still time.
**Fix:** Use `getDbNow()` for the temporal comparison.
**Confidence:** MEDIUM

## Verified Safe

- All previously fixed clock-skew issues (recruit page, API key auth, exam sessions, access codes, anti-cheat, submission creation) are confirmed working.
- SQL injection: All LIKE queries use `escapeLikePattern()`. The `buildGroupMemberScopeFilter` interpolation is safe because `groupId` values come from DB queries, not user input.
- XSS: No unsanitized `dangerouslySetInnerHTML`. Two uses are properly sanitized.
- Auth: Robust with Argon2id, timing-safe dummy hash, rate limiting, proper token invalidation.
- CSRF: Protected for server actions and non-API-key routes.
- Encryption: AES-256-GCM with proper IV and auth tag. Production requires `NODE_ENCRYPTION_KEY`.
- Shell command validation: Dual-layer defense (denylist + prefix allowlist).
- Import/export: Proper size limits, password re-confirmation, validation.
