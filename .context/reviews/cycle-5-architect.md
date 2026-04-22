# Architect — RPF Cycle 5

**Reviewer:** architect
**Base commit:** 00002346
**Date:** 2026-04-22

## Findings

### ARCH-1: Systematic `.json()` before `response.ok` pattern still present in 2+ components [MEDIUM/HIGH]

**Files:**
- `src/components/discussions/discussion-post-delete-button.tsx:25`
- `src/components/exam/start-exam-button.tsx:41`

**Confidence:** HIGH

Despite 4 prior cycles of fixing this pattern, two components still call `.json()` before checking `response.ok`. The root cause is architectural: there is no type-level enforcement. The `apiFetch` function returns a raw `Response`, and every consumer must manually remember the pattern. A typed wrapper (e.g., `apiJson<T>`) that enforces the check was added in cycle 3 but removed in cycle 4 because no component used it.

**Recommendation:** Re-introduce a typed API client helper that makes the safe pattern the default. Consider `apiFetch` returning a discriminated union after parsing, or a `safeJson` method on a wrapper type.

---

### ARCH-2: Inconsistent polling pattern — `AntiCheatDashboard` vs `ParticipantAntiCheatTimeline` [MEDIUM/MEDIUM]

**Files:**
- `src/components/contest/anti-cheat-dashboard.tsx:149-151` (missing polling)
- `src/components/contest/participant-anti-cheat-timeline.tsx:129` (has polling)

**Confidence:** HIGH

The student-facing timeline was fixed to use `useVisibilityPolling` in cycle 3, but the instructor-facing dashboard was missed. This is a systematic gap — when adding polling to one component, the same component's other view was not updated.

**Fix:** Add `useVisibilityPolling` to `AntiCheatDashboard`.

---

### ARCH-3: Native `<select>` proliferation — 5 instances across 4 files [LOW/LOW]

**Files:**
- `src/components/problem/accepted-solutions.tsx:104,122`
- `src/components/contest/anti-cheat-dashboard.tsx:419`
- `src/components/contest/score-timeline-chart.tsx:57`
- `src/app/(dashboard)/dashboard/groups/[id]/assignments/[assignmentId]/filter-form.tsx:68`

**Confidence:** HIGH

Despite fixing native `<select>` in `contest-replay.tsx` (cycle 3) and `contest-clarifications.tsx` (cycle 2), new instances continue to appear. This suggests a need for a lint rule or codemod to enforce use of the project's `Select` component.

**Fix:** Replace all native `<select>` elements with the project's `Select` component.

---

### ARCH-4: `code-timeline-panel.tsx` has no error boundary or error state [LOW/MEDIUM]

**File:** `src/components/contest/code-timeline-panel.tsx:47-61`
**Confidence:** MEDIUM

The `fetchSnapshots` function silently ignores errors. If the API fails, the user sees an empty timeline with no way to know something went wrong. This is an architectural issue — components should have a clear error state and retry mechanism.

**Fix:** Add error state and a retry button like other components in the codebase.

## Summary

4 findings: 1 MEDIUM/HIGH, 1 MEDIUM/MEDIUM, 1 LOW/MEDIUM, 1 LOW/LOW.
