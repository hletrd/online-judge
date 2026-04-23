# Performance Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** perf-reviewer
**Base commit:** 63557cc2

## Previously Fixed Items (Verified)

- Double `.json()` anti-pattern: Fixed in all 3 files from cycle 26 + admin-config from cycle 27
- Separate stats fetch from invitations fetch: Fixed
- quick-stats redundant `!` assertions: Fixed

## PERF-1: `contest-replay.tsx` auto-play uses `setInterval` unlike other timed components [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:77-87`

Carried from cycle 26 AGG-5 and cycle 27 AGG-5. The auto-play feature uses `setInterval`, while `countdown-timer.tsx` and `anti-cheat-monitor.tsx` use recursive `setTimeout`. The `setInterval` approach can accumulate drift and does not allow adjusting the interval dynamically. The recursive `setTimeout` pattern is more consistent and precise.

**Fix:** Replace `setInterval` with recursive `setTimeout`.

---

## PERF-2: `active-timed-assignment-sidebar-panel.tsx` interval stops but effect does not re-enter [LOW/LOW]

**File:** `src/components/layout/active-timed-assignment-sidebar-panel.tsx:63-75`

Carried from cycle 26 AGG-6 and cycle 27 AGG-6. The `setInterval` callback clears itself when all assignments expire. However, the effect depends on `[assignments]`, not on a derived "has active" boolean. If a new assignment is added while the interval is stopped (but the component is still mounted), the effect will not re-run because `assignments` reference equality has not changed.

**Fix:** Add a derived `hasActiveAssignment` boolean to the effect dependencies, or use a state flag that tracks whether the timer is running.

---

## Verified Safe / No Issue

- All API-consuming components now use "parse once, then branch" pattern
- No unnecessary double body parsing
- Quick-stats validation uses typeof + Number.isFinite (efficient)
- AbortController used correctly in recruiting-invitations-panel and contest-quick-stats
- useVisibilityPolling has jitter to prevent simultaneous polling
