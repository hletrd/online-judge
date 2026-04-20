# Cycle 6 Critic Review

**Date:** 2026-04-20
**Base commit:** 528cdf29

## Findings

### CRI-1: Contest detail page `isUpcoming`/`isPast` computed with `new Date()` — UI shows wrong contest status [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:188-192`
**Description:** Same issue as CR-1 and SEC-1. The contest detail page shows the wrong status if app server clock drifts. This is the most user-visible instance of the problem because students rely on the contest status to know when they can start.
**Failure scenario:** Student sees "Contest not yet started" when the contest has actually started (per DB time). They wait, losing exam time. Or vice versa — they see "open" when the contest hasn't started, seeing problems prematurely.
**Fix:** Use `getDbNow()`.
**Confidence:** HIGH

### CRI-2: Problem page submission blocking uses app-server time — misleading UX [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/problems/[id]/page.tsx:187-189`
**Description:** The `isSubmissionBlocked` flag uses `new Date()`. This creates a UX mismatch where the UI shows submissions as open/closed at different times than the API enforces.
**Failure scenario:** Student sees "Submit" button as available, writes code, clicks submit, and gets "deadline passed" from the API. Frustrating experience.
**Fix:** Use `getDbNow()` for consistency.
**Confidence:** MEDIUM

### CRI-3: Quick-create contest `startsAt` default is app-server time — could break exam scheduling [MEDIUM/MEDIUM]

**File:** `src/app/api/v1/contests/quick-create/route.ts:28-32`
**Description:** The `now = new Date()` default for `startsAt` means the stored timestamp is from the app server clock, while exam session enforcement uses DB time. For windowed exams, this could cause the contest to appear started before or after the stored `startsAt`.
**Failure scenario:** Admin creates a quick contest for a recruiting exam. The stored `startsAt` is 5 seconds behind the DB time. Students who start their exam session immediately see a 5-second discrepancy in their remaining time.
**Fix:** Use `getDbNowUncached()` for the default values.
**Confidence:** MEDIUM

### CRI-4: Student dashboard `new Date()` for deadline comparisons is cosmetic only [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/_components/student-dashboard.tsx:24,98,101-106`
**Description:** The student dashboard uses `new Date()` to filter upcoming/completed assignments. This is display-only — no access control depends on it. The API enforces real deadlines.
**Failure scenario:** An assignment appears as "open" in the dashboard but the API correctly enforces the deadline. Minor UX inconsistency.
**Fix:** Low priority. Could use `getDbNow()` for consistency.
**Confidence:** LOW
