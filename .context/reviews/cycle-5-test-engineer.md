# Test Engineer — RPF Cycle 5

**Reviewer:** test-engineer
**Base commit:** 00002346
**Date:** 2026-04-22

## Findings

### TE-1: No tests for `discussion-post-delete-button.tsx` error handling [MEDIUM/MEDIUM]

**File:** `src/components/discussions/discussion-post-delete-button.tsx`
**Confidence:** HIGH

This component has the `.json()` before `response.ok` bug (CR-1/DBG-1) but also has no unit tests. A test should verify:
1. Successful delete shows success toast and refreshes router
2. 403 response with JSON error body shows the specific error message
3. 502 response with HTML body shows a generic error, not a SyntaxError
4. Network error (fetch throws TypeError) shows generic error

**Fix:** Add unit tests for all 4 scenarios after fixing the `.json()` ordering bug.

---

### TE-2: No tests for `start-exam-button.tsx` error handling [MEDIUM/MEDIUM]

**File:** `src/components/exam/start-exam-button.tsx`
**Confidence:** HIGH

Same as TE-1. The exam start flow is critical — students need to know whether their exam session was created. Tests should cover:
1. Successful start
2. `assignmentClosed` error
3. `assignmentNotStarted` error
4. Non-JSON error body (502 HTML)
5. Network error

**Fix:** Add unit tests after fixing the `.json()` ordering bug.

---

### TE-3: No tests for `anti-cheat-dashboard.tsx` polling behavior [LOW/LOW]

**File:** `src/components/contest/anti-cheat-dashboard.tsx`
**Confidence:** MEDIUM

Once `useVisibilityPolling` is added, a test should verify that the dashboard re-fetches events when the tab becomes visible.

**Fix:** Add after implementing the polling fix.

---

### TE-4: Prior deferred test items (DEFER-4, DEFER-5, DEFER-6) remain unimplemented [MEDIUM/MEDIUM]

**Files:** Various
**Confidence:** HIGH

Cycle 4 deferred tests for `invite-participants.tsx`, `access-code-manager.tsx`, `countdown-timer.tsx` (DEFER-4), `discussion-vote-buttons.tsx`, `problem-submission-form.tsx` (DEFER-5), and `participant-anti-cheat-timeline.tsx` (DEFER-6). All exit criteria are met. These should be picked up in a future cycle.

## Summary

4 findings: 2 MEDIUM/MEDIUM (missing tests for buggy components), 1 MEDIUM/MEDIUM (deferred tests), 1 LOW/LOW (polling test).
