# Performance Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** perf-reviewer
**Base commit:** b3147a98

## Findings

### PERF-1: `submission-detail-client.tsx` queue-status poll uses `setTimeout` recursion without `useVisibilityPolling` [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/submissions/[id]/submission-detail-client.tsx:112-171`

**Description:** The queue-status polling effect uses a manual `setTimeout` recursion pattern with its own visibility change listener. The codebase has a `useVisibilityPolling` hook that encapsulates this pattern. While the implementation is functionally correct (it checks `document.visibilityState` before polling and has a visibility change listener), it duplicates the logic that `useVisibilityPolling` already provides. This is a maintainability concern more than a performance issue.

**Fix:** Refactor to use `useVisibilityPolling` for consistency with other components.

**Confidence:** LOW

---

### PERF-2: `accepted-solutions.tsx` fetches on every parameter change with no debounce [LOW/LOW]

**File:** `src/components/problem/accepted-solutions.tsx:58-102`

**Description:** The `useEffect` for loading accepted solutions fires on every change to `sort`, `language`, `page`, or `pageSize`. When a user rapidly changes the sort or language dropdown, each change triggers a separate API call. The `cancelled` flag prevents stale state updates, but the requests themselves are not debounced.

**Fix:** Add a small debounce (e.g., 150ms) to the effect when the trigger is a filter change (not page change).

**Confidence:** LOW

---

## Final Sweep

The `useVisibilityPolling` hook is used consistently across contest monitoring components (leaderboard, announcements, clarifications, anti-cheat timeline). The `useSubmissionPolling` hook properly implements SSE-to-fetch-polling fallback with exponential backoff. The code snapshot timer in `problem-submission-form.tsx` adapts its interval based on user activity. The execution limiter in `execute.ts` caps concurrent Docker containers. No critical performance issues found.
