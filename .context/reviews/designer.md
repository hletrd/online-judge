# UI/UX Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** designer
**Base commit:** f55836d0

## DES-1: `contest-quick-stats.tsx` stat cards lack loading skeleton [LOW/MEDIUM]

**File:** `src/components/contest/contest-quick-stats.tsx:86-124`

When the stats are loading (initial state before `fetchStats` completes), the cards show "0" for participant count, submissions, and problems solved, and "---" for avg score. This can be misleading — "0" implies there are genuinely no participants, when in reality the data has not loaded yet. A skeleton/shimmer loading state would provide better UX feedback.

**Fix:** Show a skeleton loader or "---" for all stats until the first fetch completes.

---

## DES-2: `recruiting-invitations-panel.tsx` create dialog has no loading state for form fields [LOW/LOW]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:410-521`

The create invitation dialog disables the submit button while creating (`disabled={creating || !createName.trim()}`), but the form fields themselves remain enabled. If the creation takes time, a user could modify fields while the request is in flight, leading to confusion about what data was actually submitted.

**Fix:** Disable all form fields during creation, or add a visual overlay to the dialog.

---

## DES-3: `contest-replay.tsx` slider lacks step markers for key moments [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:159-168`

The timeline slider shows a plain range input with no markers for key moments (e.g., when submissions happened, when standings changed). For large contests with many snapshots, the slider is hard to use because there is no visual indication of where interesting events occurred.

**Fix:** Add tick marks or dots on the slider track to indicate snapshots where standings changed significantly.
