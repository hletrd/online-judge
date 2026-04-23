# Performance Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** perf-reviewer
**Base commit:** 4b9d48f0

## PERF-1: `recruiter-candidates-panel.tsx` loads full export dataset into memory — no pagination [MEDIUM/HIGH]

**File:** `src/components/contest/recruiter-candidates-panel.tsx:50-53`
**Confidence:** HIGH

Carried from cycle 18 (AGG-2, DEFER-29). The component fetches the entire candidate export dataset into the browser, then does client-side search and sort. No server-side pagination, filtering, or sorting is used.

**Concrete failure:** A contest with 5000+ candidates causes a large JSON payload download and full in-memory sort/filter on every keystroke.

**Fix:** Create a dedicated server-side paginated endpoint with search and sort parameters.

---

## PERF-2: Practice page Path B progress filter — fetches all into memory [MEDIUM/MEDIUM]

**File:** `src/app/(public)/practice/page.tsx:410-519`
**Confidence:** HIGH

Carried from cycles 18-20. When a progress filter is active, Path B fetches ALL matching problem IDs and ALL user submissions into memory, filters in JavaScript, and paginates.

**Fix:** Move the progress filter logic into a SQL CTE or subquery.

---

## PERF-3: `contest-replay.tsx` `setInterval` without visibility awareness — wasted CPU in background [LOW/MEDIUM]

**File:** `src/components/contest/contest-replay.tsx:77-87`
**Confidence:** MEDIUM

The replay playback uses `window.setInterval` for auto-advancing snapshots. Unlike `countdown-timer.tsx` and `active-timed-assignment-sidebar-panel.tsx` which have `visibilitychange` listeners, this component continues ticking when the tab is hidden. At 4x speed, the interval fires every 350ms.

**Concrete failure:** User switches tabs while replay is playing. The interval continues firing in the background, advancing snapshots unnecessarily. When the user returns, the replay may have finished or be at a different point than expected.

**Fix:** Add a `visibilitychange` listener to pause the interval when the tab is hidden and resume when visible. Alternatively, since this is a playback animation (not a timer), simply pausing on hide and resuming from the same position on show would be correct.

---

## Verified Safe

- All polling components use `useVisibilityPolling` with AbortController
- `contest-quick-stats` properly validates response data with `Number.isFinite`
- `submission-list-auto-refresh` uses recursive `setTimeout` with backoff
- Anti-cheat heartbeat uses recursive `setTimeout` (not `setInterval`)
- `countdown-timer` has visibility-aware recalculation on tab switch
- `active-timed-assignment-sidebar-panel` has `visibilitychange` listener (fixed in cycle 18)
- `apiFetchJson` helper avoids double `.json()` parsing
