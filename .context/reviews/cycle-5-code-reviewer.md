# Code Reviewer — RPF Cycle 5

**Reviewer:** code-reviewer
**Base commit:** 00002346
**Date:** 2026-04-22

## Findings

### CR-1: `discussion-post-delete-button.tsx` calls `.json()` before checking `response.ok` [MEDIUM/HIGH]

**File:** `src/components/discussions/discussion-post-delete-button.tsx:25-26`
**Confidence:** HIGH

`response.json()` is called on line 25 before `response.ok` is checked on line 26. When the server returns a non-JSON body (e.g., 502 HTML), this throws SyntaxError. The catch block catches it but the user sees a useless error message.

**Fix:** Check `response.ok` first, use `.json().catch(() => ({}))` for error responses.

---

### CR-2: `start-exam-button.tsx` calls `.json()` on error path without `.catch()` [MEDIUM/MEDIUM]

**File:** `src/components/exam/start-exam-button.tsx:41`
**Confidence:** HIGH

Inside the `!response.ok` branch, `await response.json()` can throw SyntaxError if the error body is not JSON. The outer catch handles it but falls through to the generic error toast, losing useful information.

**Fix:** Use `.json().catch(() => ({}))` on the error path.

---

### CR-3: `accepted-solutions.tsx` uses native `<select>` — two instances [LOW/LOW]

**File:** `src/components/problem/accepted-solutions.tsx:104-117,122-137`
**Confidence:** HIGH

Two native `<select>` elements for sort and language filter. Same class of issue previously fixed in `contest-replay.tsx` (cycle 3) and `contest-clarifications.tsx` (cycle 2).

**Fix:** Replace with project's `Select` component family.

---

### CR-4: `anti-cheat-dashboard.tsx` uses native `<select>` for student filter [LOW/LOW]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:419-432`
**Confidence:** HIGH

Native `<select>` instead of the project's `Select` component.

**Fix:** Replace with project's `Select` component family.

---

### CR-5: `code-timeline-panel.tsx` silently swallows fetch errors [LOW/MEDIUM]

**File:** `src/components/contest/code-timeline-panel.tsx:47-61`
**Confidence:** MEDIUM

When the API returns `!res.ok`, the function silently does nothing. No error toast. The `try` block has no `catch` — network errors are unhandled promise rejections.

**Fix:** Add catch block and show error toast on `!res.ok`.

---

### CR-6: `problem-set-form.tsx` calls `.json()` without `.catch()` on 4 error paths [MEDIUM/LOW]

**File:** `src/app/(dashboard)/dashboard/problem-sets/_components/problem-set-form.tsx:129,158,180,214`
**Confidence:** MEDIUM

Four API calls call `await response.json()` on error paths without `.catch()`.

**Fix:** Add `.json().catch(() => ({}))` pattern.

---

### CR-7: `anti-cheat-dashboard.tsx` missing `useVisibilityPolling` — stale data during live contests [MEDIUM/MEDIUM]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:149-151`
**Confidence:** HIGH

Instructor-facing anti-cheat dashboard fetches events once on mount and never polls. The student-facing `ParticipantAntiCheatTimeline` was fixed in cycle 3 to use `useVisibilityPolling`, but this component was not.

**Fix:** Replace `useEffect(() => { fetchEvents(); }, [fetchEvents])` with `useVisibilityPolling(() => { void fetchEvents(); }, 30_000)`.

---

### CR-8: `score-timeline-chart.tsx` uses native `<select>` [LOW/LOW]

**File:** `src/components/contest/score-timeline-chart.tsx:57`
**Confidence:** HIGH

Native `<select>` instead of the project's `Select` component.

**Fix:** Replace with project's `Select` component family.

---

### CR-9: `filter-form.tsx` uses native `<select>` [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/groups/[id]/assignments/[assignmentId]/filter-form.tsx:68`
**Confidence:** HIGH

Native `<select>` instead of the project's `Select` component.

**Fix:** Replace with project's `Select` component family.

---

### CR-10: `recruiting-invitations-panel.tsx` — `handleRevoke` and `handleDelete` have no try/catch [LOW/MEDIUM]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:229-281`
**Confidence:** MEDIUM

`handleRevoke` and `handleDelete` call `apiFetch` without try/catch. Network errors will result in unhandled promise rejections. While the UI will appear functional (the user clicked a button), the promise rejection is logged in the console and could cause issues in development.

**Fix:** Wrap in try/catch with error toast.

## Summary

10 findings: 1 MEDIUM/HIGH, 2 MEDIUM/MEDIUM, 1 MEDIUM/LOW, 4 LOW/LOW (native selects), 2 LOW/MEDIUM.
