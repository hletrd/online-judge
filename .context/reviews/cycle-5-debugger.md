# Debugger — RPF Cycle 5

**Reviewer:** debugger
**Base commit:** 00002346
**Date:** 2026-04-22

## Findings

### DBG-1: `discussion-post-delete-button.tsx` — SyntaxError on non-JSON error response causes confusing user feedback [MEDIUM/HIGH]

**File:** `src/components/discussions/discussion-post-delete-button.tsx:25-26`
**Confidence:** HIGH

**Failure scenario:** User clicks delete on a discussion post. Server returns 502 with HTML from reverse proxy. `response.json()` throws SyntaxError: "Unexpected token < in JSON at position 0". The catch block catches it and shows the SyntaxError message in a toast. User sees "Unexpected token < in JSON at position 0" instead of a meaningful error.

**Fix:** Check `response.ok` first, use `.json().catch(() => ({}))`.

---

### DBG-2: `start-exam-button.tsx` — SyntaxError on non-JSON error during exam start [MEDIUM/MEDIUM]

**File:** `src/components/exam/start-exam-button.tsx:41`
**Confidence:** HIGH

**Failure scenario:** Student clicks "Start Exam". Server returns 500 with HTML. `response.json()` throws SyntaxError. The catch block catches it but falls through to the generic `toast.error(t("examSessionStartFailed"))`. The student sees a generic error but the actual cause is lost. Worse, the student may not know whether their exam session was actually created.

**Fix:** Use `.json().catch(() => ({}))` on error path, then check for known error codes.

---

### DBG-3: `code-timeline-panel.tsx` — no error handling, silently fails [LOW/MEDIUM]

**File:** `src/components/contest/code-timeline-panel.tsx:47-61`
**Confidence:** MEDIUM

**Failure scenario:** Instructor views code timeline. Network request fails. No error state is set, no toast is shown. The component shows "Loading..." forever or an empty timeline with no indication of failure.

**Fix:** Add catch block and error state.

---

### DBG-4: `recruiting-invitations-panel.tsx` — `handleRevoke` and `handleDelete` unhandled promise rejections [LOW/MEDIUM]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:229-281`
**Confidence:** MEDIUM

**Failure scenario:** Admin clicks "Revoke" on an invitation. Network goes offline. The `apiFetch` promise rejects with a TypeError. Since there's no try/catch, this is an unhandled promise rejection. In development, React may show an error overlay. In production, the user sees no feedback.

**Fix:** Wrap in try/catch with error toast.

---

### DBG-5: `anti-cheat-dashboard.tsx` — stale data for instructors during live contests [MEDIUM/MEDIUM]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:149-151`
**Confidence:** HIGH

**Failure scenario:** During a live contest, an instructor monitors the anti-cheat dashboard. New tab switches and copy events are happening, but the dashboard only loaded data once on mount. The instructor sees zero events and believes no cheating is occurring. This is a data-freshness bug that directly affects the reliability of the anti-cheat system.

**Fix:** Add `useVisibilityPolling` like `ParticipantAntiCheatTimeline`.

## Summary

5 findings: 1 MEDIUM/HIGH, 2 MEDIUM/MEDIUM, 2 LOW/MEDIUM.
