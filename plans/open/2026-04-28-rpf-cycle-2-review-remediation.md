# Cycle 2 Review Remediation Plan

**Date:** 2026-04-28
**Source:** `.context/reviews/_aggregate.md` (cycle 2)
**Status:** DONE

---

## Tasks

### Task A: [MEDIUM] Add dark mode variants to My Contests section badges and border classes

- **Source:** C2-AGG-1 (3-agent convergence: CR-6, DES-C2-1, CRIT-C2-1)
- **Files:**
  - `src/app/(public)/contests/page.tsx:188` — badge without dark mode
  - `src/app/(public)/contests/page.tsx:26-37` — `getContestStatusBorderClass` without dark mode
- **Fix:**
  1. Add dark mode classes to badge at line 188: `dark:bg-blue-600`/`dark:bg-purple-600`
  2. Add dark mode border variants to `getContestStatusBorderClass`: `dark:border-l-blue-400`, `dark:border-l-green-400`, `dark:border-l-gray-500`
- **Exit criteria:** My Contests section badges and borders have proper contrast in both light and dark modes, matching the catalog section styling
- [x] Done (commit 6d84c09f)

### Task B: [MEDIUM] Extract `DEFAULT_PROBLEM_POINTS` constant and centralize the default

- **Source:** C2-AGG-2 (4-agent convergence: CR-8, TRC-C2-1, ARCH-C2-2, CRIT-C2-3)
- **Files:**
  - `src/lib/assignments/public-contests.ts:349` — `ap.points ?? 100`
  - `src/lib/assignments/submissions.ts:536` — `row.points ?? 100`
  - `src/lib/assignments/participant-timeline.ts:213,280` — `problemRow.points ?? 100`
  - `src/app/api/v1/groups/[id]/assignments/[assignmentId]/route.ts:160` — `problem.points ?? 100`
  - `src/app/api/v1/groups/[id]/assignments/[assignmentId]/overrides/route.ts:86` — `assignmentProblem.points ?? 100`
  - `src/components/assignment/assignment-overview.tsx:272` — `problem.points ?? 100`
- **Fix:**
  1. Create a shared constant `DEFAULT_PROBLEM_POINTS = 100` in a suitable location (e.g., `src/lib/assignments/constants.ts` or alongside existing assignment types)
  2. Replace all `?? 100` instances with `?? DEFAULT_PROBLEM_POINTS`
- **Exit criteria:** All 6+ locations use the shared constant; no raw `?? 100` for problem points remains
- [x] Done (commit 780a8b0c)

### Task C: [MEDIUM] Add runtime type guard for rawJsonBody in import route JSON path

- **Source:** C2-AGG-4 (SEC-C2-1)
- **File:** `src/app/api/v1/admin/migrate/import/route.ts:162`
- **Fix:** Before the cast `rawJsonBody as Record<string, unknown>`, add:
  ```typescript
  if (typeof rawJsonBody !== "object" || rawJsonBody === null || Array.isArray(rawJsonBody)) {
    return NextResponse.json({ error: "invalidJson" }, { status: 400 });
  }
  ```
- **Exit criteria:** Non-object JSON body (e.g., array) is rejected with 400 instead of being unsafely cast
- [x] Done (commit ea39a4be)

### Task D: [MEDIUM] Add regression tests for totalPoints and examDurationMinutes fixes

- **Source:** C2-AGG-3 (CRIT-C2-2, TE-C2-1)
- **Files:** New test file(s)
- **Fix:**
  1. Add a test verifying `totalPoints` equals the sum of problem points (not sum + 100)
  2. Add a test verifying `StartExamButton` receives the correct `durationMinutes` from assignment context
- **Exit criteria:** Both cycle 1 bug fixes have regression tests that would catch a re-introduction
- [x] Done (commit 016a3af2)

### Task E: [LOW] Add `assignmentId` parameter to Virtual Practice section links

- **Source:** C2-AGG-5 (carried from AGG-14, DBG-C2-1, DES-C2-3)
- **File:** `src/app/(public)/contests/[id]/page.tsx:665`
- **Fix:** Change `buildLocalePath(\`/practice/problems/${problem.id}\`, locale)` to include `?assignmentId=${contest.id}`:
  ```tsx
  href={buildLocalePath(`/practice/problems/${problem.id}?assignmentId=${contest.id}`, locale)}
  ```
- **Exit criteria:** Virtual Practice links include the contest assignmentId, preserving exam context for private problems
- [x] Done (commit 332ae9cb)

### Task F: [LOW] Pass locale to `formatScore` in enrolled contest view

- **Source:** C2-AGG-7 (DBG-C2-2, TE-C2-2)
- **File:** `src/app/(public)/contests/[id]/page.tsx:396`
- **Fix:** Change `formatScore(sub.score)` to `formatScore(sub.score, locale)`
- **Exit criteria:** Score display in enrolled contest view uses locale-aware digit grouping
- [x] Done (commit 332ae9cb)

### Task G: [LOW] Extract shared `getContestStatusBorderClass` utility with dark mode support

- **Source:** C2-AGG-8 (ARCH-C2-1, DES-C2-2)
- **Files:**
  - `src/app/(public)/contests/page.tsx:26-37` — duplicate without dark mode
  - `src/app/(public)/_components/public-contest-list.tsx:31-42` — has dark mode
- **Fix:**
  1. Extract `getContestStatusBorderClass` (with dark mode variants from `public-contest-list.tsx`) to a shared utility
  2. Import and use in both files
- **Exit criteria:** Single source of truth for contest status border styling, consistent dark mode support
- [x] Done (commit TBD — pending G commit)

### Task H: [LOW] Parallelize independent queries on contest listing page

- **Source:** C2-AGG-6 (PERF-C2-1)
- **File:** `src/app/(public)/contests/page.tsx:99-108`
- **Fix:** Change sequential calls to `Promise.all`:
  ```tsx
  const [myContestsRaw, contests] = await Promise.all([
    isAuthenticated && session?.user
      ? getContestsForUser(session.user.id, session.user.role)
      : Promise.resolve([]),
    getPublicContests(),
  ]);
  ```
- **Exit criteria:** `getContestsForUser` and `getPublicContests` run concurrently
- [x] Done (commit TBD — pending H commit)

---

## Deferred Items

The following findings from the cycle 2 review are deferred this cycle with reasons:

| C2-AGG ID | Description | Severity | Reason for deferral | Exit criterion |
|-----------|-------------|----------|---------------------|----------------|
| C2-AGG-9 | `getDbNow` called redundantly in enrolled contest flow | LOW | Requires changing the signature of `getEnrolledContestDetail`; minor optimization. Risk of regression in a hot path for minimal gain. | When `public-contests.ts` is refactored (AGG-3) |
| C2-AGG-10 | CountdownTimer uses dashboard translation namespace | LOW | Works correctly at runtime because `next-intl` loads all namespaces. Creating a new shared namespace is a larger i18n refactor. | Next i18n namespace reorganization |
| C2-AGG-11 | Problem detail page calls `getExamSession` redundantly | LOW | `validateAssignmentSubmission` is a shared function; changing its return type has wide scope. | When `submissions.ts` is refactored |

---

## Notes

- C2-AGG-1 (dark mode badges) is the most visible fix — the inconsistency between My Contests and catalog section is immediately noticeable in dark mode.
- C2-AGG-2 (DEFAULT_PROBLEM_POINTS) is a maintainability improvement that centralizes a magic number across 6+ files.
- C2-AGG-3 (regression tests) addresses the test coverage gap that allowed the cycle 1 bugs to exist undetected.
- C2-AGG-4 (import route type guard) is a defense-in-depth fix for an admin-only endpoint.
