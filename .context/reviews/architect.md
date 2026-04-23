# Architecture Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** architect
**Base commit:** f55836d0

## ARCH-1: Double `.json()` anti-pattern indicates incomplete migration to `apiFetchJson` [MEDIUM/MEDIUM]

**Files:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:273,277`
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:67,71`
- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx:335,339`

Three components still use the error-first `.json()` pattern instead of `apiFetchJson`. This was the same class of issue fixed in cycles 23-24 for other files, but these were missed because the previous review cycles focused on the `error.message` leaking issue, not the structural pattern.

The `apiFetchJson` helper was specifically created to eliminate this class of bug. The remaining instances suggest the migration was incomplete.

**Fix:** Migrate these three components to `apiFetchJson` or the "parse once, then branch" pattern. This relates to DEFER-1/DEFER-38/DEFER-46 (apiFetchJson adoption for remaining components).

---

## ARCH-2: `handleResetAccountPassword` missing `fetchAll()` — inconsistent mutation pattern [LOW/LOW]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:282-301`

All other mutation handlers (`handleRevoke`, `handleDelete`) call `fetchAll()` after success. `handleResetAccountPassword` does not. While the reset does not change visible invitation fields today, the inconsistency creates a pattern where future mutations might also forget to refresh data.

**Fix:** Add `fetchAll()` after the success toast for consistency, or document the intentional omission.

---

## ARCH-3: `contest-replay.tsx` auto-play uses `setInterval` unlike other timed components [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:77-87`

The auto-play feature uses `setInterval`, while `countdown-timer.tsx` and `anti-cheat-monitor.tsx` use recursive `setTimeout`. The `setInterval` approach can accumulate drift and does not allow adjusting the interval dynamically. The recursive `setTimeout` pattern is more consistent and precise.

**Fix:** Replace `setInterval` with recursive `setTimeout`.
