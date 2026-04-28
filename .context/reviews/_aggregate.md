# Aggregate Review — Cycle 2

**Date:** 2026-04-28
**Reviewers:** code-reviewer, security-reviewer, perf-reviewer, debugger, verifier, architect, critic, test-engineer, tracer, designer (10 lanes)
**Total findings:** 0 HIGH, 4 MEDIUM, 7 LOW (deduplicated, new findings only)

---

## Cycle 1 Fix Verification Summary

All 5 cycle 1 tasks were verified as correctly implemented:
- **Task A** (totalPoints reduce initial value): VERIFIED OK — now uses 0
- **Task B** (examDurationMinutes): VERIFIED OK — type, DB query, and prop passing all correct
- **Task C** (redundant getExamSession): VERIFIED OK — removed, uses `contest.examSession` directly
- **Task D** (dark mode badges): VERIFIED OK — contest detail page has dark variants
- **Task E** (layout comment): VERIFIED OK — includes upstream tracking note

**Notable gap:** The dark mode fix (Task D) was applied only to `contests/[id]/page.tsx` but not to `contests/page.tsx` (My Contests section), creating an inconsistency on the same page.

---

## Cross-Agent Convergence Map (Cycle 2 New Findings)

| Topic | Agents flagging | Severity peak |
|-------|-----------------|---------------|
| My Contests section badges missing dark mode variants | CR-6, DES-C2-1, CRIT-C2-1 | MEDIUM (3-agent convergence) |
| `points ?? 100` default inflates totalPoints when null | CR-8, TRC-C2-1, ARCH-C2-2, CRIT-C2-3 | MEDIUM (4-agent convergence) |
| No regression tests for cycle 1 bug fixes | CRIT-C2-2, TE-C2-1 | MEDIUM (2-agent convergence) |
| Virtual Practice links lack assignmentId | DBG-C2-1, DES-C2-3 | MEDIUM (carried from AGG-14) |
| Contest listing page sequential queries | PERF-C2-1 | LOW |
| `getDbNow` called redundantly | PERF-C2-2 | LOW |
| `formatScore` missing locale param | DBG-C2-2, TE-C2-2 | LOW (2-agent convergence) |
| Duplicate `getContestStatusBorderClass` function | ARCH-C2-1, DES-C2-2 | LOW (2-agent convergence) |
| Import route unsafe Record cast | SEC-C2-1 | MEDIUM |
| CountdownTimer translation namespace mismatch | DBG-C2-3 | LOW |

---

## Deduplicated Findings (sorted by severity)

### C2-AGG-1: [MEDIUM] My Contests section badges missing dark mode variants — inconsistent with catalog section

**Sources:** CR-6, DES-C2-1, CRIT-C2-1 | **Confidence:** HIGH (3-agent convergence)

`src/app/(public)/contests/page.tsx:188` — The "My Contests" section uses hardcoded `bg-blue-500`/`bg-purple-500` without dark mode variants. The same page's catalog section (rendered by `public-contest-list.tsx:105`) has proper dark variants. This was the same pattern fixed in cycle 1 (AGG-13) but the fix was not applied to the listing page.

**Fix:** Add dark mode classes to badge at line 188: `dark:bg-blue-600`/`dark:bg-purple-600`. Also fix `getContestStatusBorderClass` at lines 26-37 to include dark mode border variants.

---

### C2-AGG-2: [MEDIUM] `points ?? 100` default can inflate displayed totalPoints when problem points are null

**Sources:** CR-8, TRC-C2-1, ARCH-C2-2, CRIT-C2-3 | **Confidence:** MEDIUM (4-agent convergence)

`src/lib/assignments/public-contests.ts:349` — When `ap.points` is null/undefined, the code defaults to 100. This default propagates into `totalPoints` which is displayed to students. The magic number `100` is scattered across 6+ files without a shared constant.

**Data flow:** `public-contests.ts:349` → `contests/[id]/page.tsx:183-184` → `AssignmentOverview` total points display.

**Fix:** Extract `DEFAULT_PROBLEM_POINTS = 100` as a shared constant. Consider whether displaying a warning is appropriate when points are null rather than silently defaulting.

---

### C2-AGG-3: [MEDIUM] No regression tests for the two confirmed bugs fixed in cycle 1

**Sources:** CRIT-C2-2, TE-C2-1 | **Confidence:** HIGH (2-agent convergence)

The totalPoints off-by-100 bug and the examDurationMinutes=0 bug were fixed without adding any tests. These are student-facing data integrity bugs that could regress in a future refactor.

**Fix:** Add (1) a test verifying `totalPoints` equals the sum of problem points, (2) a test verifying `StartExamButton` receives the correct `durationMinutes` from assignment context.

---

### C2-AGG-4: [MEDIUM] Import route JSON path has unsafe `as Record<string, unknown>` cast

**Sources:** SEC-C2-1 | **Confidence:** HIGH

`src/app/api/v1/admin/migrate/import/route.ts:162` — After Zod validation, `rawJsonBody` (typed as `unknown`) is cast to `Record<string, unknown>` without a runtime type check. If `rawJsonBody` is an array or non-object, the destructuring `{ password: _, data: _data, ...restFields }` produces unexpected results that are then cast as `JudgeKitExport`.

**Fix:** Add runtime type guard: `if (typeof rawJsonBody !== "object" || rawJsonBody === null || Array.isArray(rawJsonBody)) return error response`.

---

### C2-AGG-5: [LOW] Virtual Practice section links lack `assignmentId` parameter — breaks exam context

**Sources:** DBG-C2-1, DES-C2-3 | **Confidence:** MEDIUM (carried from AGG-14)

`src/app/(public)/contests/[id]/page.tsx:665` — Links to `/practice/problems/${problem.id}` without `?assignmentId=...`. For private problems, this causes a 404. For public problems, the student loses exam context.

**Fix:** Add `assignmentId` query parameter to Virtual Practice links.

---

### C2-AGG-6: [LOW] Contest listing page runs independent queries sequentially

**Sources:** PERF-C2-1 | **Confidence:** LOW

`src/app/(public)/contests/page.tsx:99-108` — `getContestsForUser` and `getPublicContests` are called sequentially but are independent. They could be parallelized with `Promise.all`.

**Fix:** Use `Promise.all([getContestsForUser(...), getPublicContests()])`.

---

### C2-AGG-7: [LOW] `formatScore` called without locale parameter in enrolled contest view

**Sources:** DBG-C2-2, TE-C2-2 | **Confidence:** LOW (2-agent convergence)

`src/app/(public)/contests/[id]/page.tsx:396` — `formatScore(sub.score)` omits the `locale` parameter. The function supports locale-aware digit grouping but defaults to `en-US` when not provided.

**Fix:** Change to `formatScore(sub.score, locale)`.

---

### C2-AGG-8: [LOW] Duplicate `getContestStatusBorderClass` function with inconsistent dark mode support

**Sources:** ARCH-C2-1, DES-C2-2 | **Confidence:** LOW (2-agent convergence)

`src/app/(public)/contests/page.tsx:26-37` defines `getContestStatusBorderClass` without dark mode variants, while `src/app/(public)/_components/public-contest-list.tsx:31-42` defines the same function with dark mode variants. This is a DRY violation leading to inconsistent styling.

**Fix:** Extract the function (with dark mode variants) to a shared utility and import it in both files.

---

### C2-AGG-9: [LOW] `getDbNow` called redundantly in enrolled contest flow

**Sources:** PERF-C2-2 | **Confidence:** LOW

`src/lib/assignments/public-contests.ts:315` calls `getDbNow()` internally, but the caller (`contests/[id]/page.tsx:135`) already has a `now` value from an earlier `getDbNow()` call.

**Fix:** Accept `now` as an optional parameter in `getEnrolledContestDetail`.

---

### C2-AGG-10: [LOW] CountdownTimer uses `useTranslations("groups")` — dashboard namespace in public pages

**Sources:** DBG-C2-3 | **Confidence:** LOW

`src/components/exam/countdown-timer.tsx:52` uses `useTranslations("groups")` for threshold messages. When rendered in public pages, this couples the public page to the dashboard translation namespace.

**Fix:** Move exam countdown translations to a shared namespace (e.g., `common` or `contests`).

---

### C2-AGG-11: [LOW] Problem detail page calls `getExamSession` redundantly

**Sources:** TRC-C2-2 | **Confidence:** LOW

`src/app/(public)/practice/problems/[id]/page.tsx:441` calls `getExamSession()`, but `validateAssignmentSubmission` already queried exam session data internally.

**Fix:** Have `validateAssignmentSubmission` return the exam session alongside the validation result.

---

## Carried Deferred Items (unchanged from cycle 1)

- DEFER-22: `.json()` before `response.ok` — 60+ instances
- DEFER-23: Raw API error strings without translation — partially fixed
- DEFER-24: `migrate/import` unsafe casts — partially addressed by C2-AGG-4
- DEFER-27: Missing AbortController on polling fetches
- DEFER-28: `as { error?: string }` pattern — 22+ instances
- DEFER-29: Admin routes bypass `createApiHandler`
- DEFER-30: Recruiting validate token brute-force
- DEFER-32: Admin settings exposes DB host/port
- DEFER-33: Missing error boundaries
- DEFER-34: Hardcoded English fallback strings
- DEFER-35: Hardcoded English strings in editor title attributes
- DEFER-36: `formData.get()` cast assertions
- DEFER-43: Docker client leaks `err.message` in build responses
- DEFER-44: No documentation for timer pattern convention

---

## No Agent Failures

All 10 reviewer lanes completed successfully. No retries needed.

---

## Plannable Tasks for This Cycle

1. **C2-AGG-1** (MEDIUM, 3-agent convergence) — Add dark mode variants to My Contests badges and border classes
2. **C2-AGG-2** (MEDIUM, 4-agent convergence) — Extract `DEFAULT_PROBLEM_POINTS = 100` constant; centralize default
3. **C2-AGG-3** (MEDIUM) — Add regression tests for totalPoints and examDurationMinutes fixes
4. **C2-AGG-4** (MEDIUM) — Add runtime type guard for rawJsonBody in import route
5. **C2-AGG-5** (LOW, carried) — Add assignmentId to Virtual Practice links
6. **C2-AGG-7** (LOW) — Pass locale to formatScore in enrolled contest view
7. **C2-AGG-8** (LOW) — Extract shared getContestStatusBorderClass utility
8. **C2-AGG-6** (LOW) — Parallelize independent queries on contest listing page
