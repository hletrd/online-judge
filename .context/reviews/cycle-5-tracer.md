# Tracer — RPF Cycle 5

**Reviewer:** tracer
**Base commit:** 00002346
**Date:** 2026-04-22

## Causal Traces

### TR-1: `discussion-post-delete-button.tsx` — `.json()` before `response.ok` [MEDIUM/HIGH]

**Trace:**
1. User clicks delete button on a discussion post
2. `handleDelete` calls `apiFetch(..., { method: "DELETE" })`
3. Server returns 502 with HTML body (reverse proxy error)
4. Line 25: `const body = await response.json()` throws `SyntaxError: Unexpected token < in JSON`
5. Line 26 `if (!response.ok)` is never reached
6. Line 32 catch block: `error instanceof Error` is true (SyntaxError extends Error)
7. `error.message` is "Unexpected token < in JSON at position 0"
8. `toast.error("Unexpected token < in JSON at position 0")` — useless to user

**Hypothesis confirmed:** The `.json()` call before `response.ok` check causes SyntaxError on non-JSON error bodies. The SyntaxError message leaks into the user-facing toast.

**Fix:** Check `response.ok` first, use `.json().catch(() => ({}))`.

---

### TR-2: `start-exam-button.tsx` — exam start flow loses error info on non-JSON response [MEDIUM/MEDIUM]

**Trace:**
1. Student clicks "Start Exam" button
2. `handleStart` calls `apiFetch` with POST
3. Server returns 500 with HTML body
4. Line 40: `if (!response.ok)` is true
5. Line 41: `const payload = await response.json()` throws SyntaxError
6. Catch block on line 48 catches it
7. `error instanceof Error && error.message === "assignmentClosed"` — false (message is SyntaxError)
8. Falls through to generic `toast.error(t("examSessionStartFailed"))`
9. Student sees generic error, doesn't know if session was created

**Hypothesis confirmed:** The error code discrimination logic is bypassed by the SyntaxError.

**Fix:** Use `.json().catch(() => ({}))` so the error code can be checked.

---

### TR-3: `anti-cheat-dashboard.tsx` — stale data trace [MEDIUM/MEDIUM]

**Trace:**
1. Instructor opens contest anti-cheat dashboard
2. Component mounts, `fetchEvents()` called once via `useEffect`
3. New anti-cheat events occur (tab switches, copy events)
4. `fetchEvents` is only called again if `assignmentId` changes (dependency of `useCallback`)
5. Instructor sees stale data until manual page refresh

**Hypothesis confirmed:** Missing `useVisibilityPolling` causes stale data for instructors.

**Fix:** Add `useVisibilityPolling(() => { void fetchEvents(); }, 30_000)`.

---

### TR-4: `code-timeline-panel.tsx` — silent failure trace [LOW/MEDIUM]

**Trace:**
1. Instructor opens code timeline panel
2. `fetchSnapshots` called, API returns 500
3. `res.ok` is false, no else branch — function silently returns
4. `setLoading(false)` in finally block
5. Component renders with empty snapshots array
6. User sees "No snapshots" message, doesn't know there was an error

**Hypothesis confirmed:** Missing error state and error feedback.

**Fix:** Add error state and show error toast.

## Summary

4 findings: 1 MEDIUM/HIGH, 2 MEDIUM/MEDIUM, 1 LOW/MEDIUM.
