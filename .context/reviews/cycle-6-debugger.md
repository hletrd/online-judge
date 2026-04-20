# Cycle 6 Debugger Review

**Date:** 2026-04-20
**Base commit:** 528cdf29

## Findings

### DBG-1: Contest detail page `isUpcoming`/`isPast` flags use app-server clock [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:188-192`
**Description:** `const now = new Date()` is used to compute `isUpcoming` and `isPast`. These flags control whether contest problems are visible and what UI tabs are shown. If the app server clock drifts, the page shows the wrong contest status.
**Failure scenario:** During a 2-hour exam window, if the app server is 2 minutes behind the DB server, the contest appears "upcoming" for 2 extra minutes on the detail page. Students cannot start their exam session (the API correctly enforces the start time), creating confusion.
**Fix:** Use `getDbNow()` in this server component.
**Confidence:** HIGH

### DBG-2: Problem page `isSubmissionBlocked` computed with `new Date()` [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/problems/[id]/page.tsx:187-189`
**Description:** The submission blocking flag uses app-server time. If the clock is ahead, submissions are blocked too early. If behind, they appear available when they shouldn't be.
**Failure scenario:** Student with 30 seconds left sees the submit button become disabled 30 seconds before the actual deadline (app server is ahead). They try to refresh, losing time.
**Fix:** Use `getDbNow()`.
**Confidence:** MEDIUM

### DBG-3: Quick-create route `startsAt` default stored as app-server time [MEDIUM/MEDIUM]

**File:** `src/app/api/v1/contests/quick-create/route.ts:28-32`
**Description:** Default `startsAt = new Date()` stores app-server time. When exam session enforcement uses `NOW()` (DB time), the stored `startsAt` and the enforcement time can diverge.
**Failure scenario:** Contest created with `startsAt` = 10:00:00 (app server). DB time is 10:00:03. A student starting an exam at 10:00:01 (DB time) gets a session because `NOW() > startsAt`, but the intended start was 10:00:00.
**Fix:** Use `getDbNowUncached()` for default `startsAt`.
**Confidence:** MEDIUM
