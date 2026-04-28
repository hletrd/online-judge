# Aggregate Review — Cycle 6

**Date:** 2026-04-28
**Reviewers:** code-reviewer (1 lane — focused verification + new findings)
**Total findings:** 0 HIGH, 2 MEDIUM, 1 LOW (deduplicated, new findings only)

---

## Cycle 1-5 Fix Verification Summary

All 22 tasks from cycles 1-5 were verified:

| Cycle | Task | Description | Status |
|-------|------|-------------|--------|
| C1 | A | totalPoints reduce initial value | VERIFIED |
| C1 | B | examDurationMinutes in assignmentContext | VERIFIED |
| C1 | C | Redundant getExamSession fallback | VERIFIED |
| C1 | D | Dark mode badges on contest detail | VERIFIED |
| C1 | E | Layout upstream comment | VERIFIED |
| C2 | A | My Contests dark mode badges | VERIFIED |
| C2 | B | DEFAULT_PROBLEM_POINTS constant | VERIFIED — no remaining raw `?? 100` |
| C2 | C | Import route type guard | VERIFIED |
| C2 | D | Regression tests | VERIFIED |
| C2 | E | assignmentId on Virtual Practice links | VERIFIED |
| C2 | F | locale passed to formatScore | VERIFIED |
| C2 | G | Shared getContestStatusBorderClass | VERIFIED |
| C2 | H | Parallelized queries | VERIFIED |
| C3 | A | Badge color shades standardized | VERIFIED |
| C3 | B | Shared formatDateLabel utility | VERIFIED |
| C3 | C | Dashboard `?? 100` replaced | VERIFIED |
| C3 | D | Redundant getExamSession in problem detail | VERIFIED |
| C4 | A | Dashboard dark mode badge variants | VERIFIED |
| C4 | B | formatScore locale in public submissions | VERIFIED |
| C4 | C | formatScore locale in dashboard pages | VERIFIED |
| C5 | A | Dashboard contests page uses shared getContestStatusBorderClass | VERIFIED |
| C5 | B | formatScore in 4 dashboard views | VERIFIED |
| C5 | C | Removed misleading `as string | Date` cast | VERIFIED |
| C5 | D | SubmissionStatusBadge locale prop passed by all callers | VERIFIED |

All cycle 1-5 fixes are correctly implemented. No regressions found.

---

## Deduplicated Findings (sorted by severity)

### C6-AGG-1: [MEDIUM] Duplicate `getStatusBadgeVariant` function in dashboard and public contests pages

**Sources:** C6-CR-1 | **Confidence:** HIGH

`src/app/(dashboard)/dashboard/contests/page.tsx:35-48` and `src/app/(public)/contests/page.tsx:20-33` both define an identical `getStatusBadgeVariant(status: ContestStatus)` function. This is the same duplication pattern as C2-AGG-8/C5-AGG-1 where `getStatusBorderClass` was duplicated and had to be extracted to a shared utility. If a new contest status is added or a variant mapping changes, only one copy may get updated, causing visual inconsistency.

**Fix:** Extract `getStatusBadgeVariant` to `src/app/(public)/_components/contest-status-styles.ts` alongside `getContestStatusBorderClass` and `formatDateLabel`, then import from both pages.

---

### C6-AGG-2: [MEDIUM] Missing scoring model badge in public contests page "My Contests" section

**Sources:** C6-CR-2 | **Confidence:** HIGH

`src/app/(public)/contests/page.tsx:166-173` shows the status badge and exam mode badge in the "My Contests" section but is missing the scoring model badge (IOI/ICPC). Both the dashboard contests page (`src/app/(dashboard)/dashboard/contests/page.tsx:213-216`) and the public contest list component (`src/app/(public)/_components/public-contest-list.tsx:96,139`) display both badges. Users cannot distinguish IOI from ICPC contests in the "My Contests" section without navigating into each.

**Fix:** Add the scoring model badge after the exam mode badge using the same pattern as the dashboard page.

---

### C6-AGG-3: [LOW] Inconsistent `dark:text-white` in public contest badges

**Sources:** C6-CR-3 | **Confidence:** MEDIUM

5 badge instances across 2 public files have `text-white` but lack `dark:text-white`:
- `src/app/(public)/contests/page.tsx:170` — exam mode badge
- `src/app/(public)/_components/public-contest-list.tsx:93,96,136,139` — exam mode + scoring badges

All equivalent badges in the dashboard contests page and contest detail page include `dark:text-white`. The inconsistency is a maintenance risk if Badge base styles change.

**Fix:** Add `dark:text-white` to all 5 badge instances for consistency.

---

## Carried Deferred Items (unchanged from cycle 5)

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
- C2-AGG-9/C3-AGG-5/C4-AGG-4: `getDbNow` called redundantly — LOW, deferred
- C2-AGG-10: CountdownTimer namespace mismatch — LOW, deferred

---

## No Agent Failures

The review lane completed successfully.

---

## Gate Status

- **eslint:** PASS (0 errors, 0 warnings)
- **tsc --noEmit:** PASS (0 errors)

---

## Plannable Tasks for This Cycle

1. **C6-AGG-1** (MEDIUM) — Extract `getStatusBadgeVariant` to shared utility
2. **C6-AGG-2** (MEDIUM) — Add scoring model badge to public contests "My Contests" section
3. **C6-AGG-3** (LOW) — Add `dark:text-white` to 5 public contest badges
