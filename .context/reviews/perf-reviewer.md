# Performance Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** perf-reviewer
**Base commit:** f55836d0

## PERF-1: Double `.json()` anti-pattern causes unnecessary body parsing on error paths [LOW/MEDIUM]

**Files:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:273,277`
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:67,71`
- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx:335,339`

While not a runtime bug (the `throw` prevents double consumption), the error-first `.json()` pattern means that on error responses, the body is parsed in the error branch and the response object is still held in memory even though it has already been consumed. The "parse once, branch" pattern is cleaner and avoids creating unnecessary intermediate objects.

**Fix:** Migrate to `apiFetchJson` or the "parse once, then branch" pattern.

---

## PERF-2: `contest-quick-stats.tsx` non-null assertion `!` in tight polling loop [LOW/LOW]

**File:** `src/components/contest/contest-quick-stats.tsx:65-68`

The stats validation code still uses `data.data!.participantCount` with the `!` non-null assertion even after the `typeof` guard. While the guard already ensures the value is a number, the `!` assertion is redundant and prevents the TypeScript compiler from catching potential future regressions if the guard logic changes.

**Fix:** Remove `!` assertions where `typeof` guard already ensures the value exists.

---

## PERF-3: `active-timed-assignment-sidebar-panel.tsx` interval stops but effect does not re-enter [LOW/LOW]

**File:** `src/components/layout/active-timed-assignment-sidebar-panel.tsx:63-75`

The `setInterval` callback clears itself when all assignments expire. However, the effect depends on `[assignments]`, not on a derived "has active" boolean. If a new assignment is added while the interval is stopped (but the component is still mounted), the effect will not re-run because `assignments` reference equality has not changed if it is the same array object.

**Fix:** Add a derived `hasActiveAssignment` boolean to the effect dependencies, or use a state flag that tracks whether the timer is running.
