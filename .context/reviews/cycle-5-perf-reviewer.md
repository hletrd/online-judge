# Performance Reviewer — RPF Cycle 5

**Reviewer:** perf-reviewer
**Base commit:** 00002346
**Date:** 2026-04-22

## Findings

### PERF-1: `anti-cheat-dashboard.tsx` missing `useVisibilityPolling` — instructor stale data [MEDIUM/MEDIUM]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:149-151`
**Confidence:** HIGH

The instructor-facing anti-cheat dashboard does not poll for updates. During a live contest with many participants, anti-cheat events arrive continuously, but instructors see stale data until they manually refresh the page. The student-facing `ParticipantAntiCheatTimeline` was already fixed with `useVisibilityPolling` in cycle 3.

**Fix:** Replace `useEffect(() => { fetchEvents(); }, [fetchEvents])` with `useVisibilityPolling(() => { void fetchEvents(); }, 30_000)`.

---

### PERF-2: `accepted-solutions.tsx` uses native `<select>` — two instances [LOW/LOW]

**File:** `src/components/problem/accepted-solutions.tsx:104-117,122-137`
**Confidence:** HIGH

Native `<select>` elements don't participate in the project's design system, causing layout shift and inconsistent rendering. While not a direct performance issue, they cause unnecessary style recalculation when the theme changes because they don't use CSS variables.

**Fix:** Replace with project's `Select` component.

---

### PERF-3: `anti-cheat-dashboard.tsx` uses native `<select>` [LOW/LOW]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:419-432`
**Confidence:** HIGH

Same as PERF-2. Native `<select>` in the student filter.

**Fix:** Replace with project's `Select` component.

---

### PERF-4: `score-timeline-chart.tsx` uses native `<select>` [LOW/LOW]

**File:** `src/components/contest/score-timeline-chart.tsx:57`
**Confidence:** HIGH

Same class of issue.

**Fix:** Replace with project's `Select` component.

## Summary

4 findings: 1 MEDIUM/MEDIUM (missing polling), 3 LOW/LOW (native selects).
