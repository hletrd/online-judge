# Critic — RPF Cycle 5

**Reviewer:** critic
**Base commit:** 00002346
**Date:** 2026-04-22

## Multi-Perspective Critique

### CRI-1: `.json()` before `response.ok` still present — systemic pattern failure [MEDIUM/HIGH]

**Files:**
- `src/components/discussions/discussion-post-delete-button.tsx:25`
- `src/components/exam/start-exam-button.tsx:41`

**Confidence:** HIGH

After 4 cycles of fixing this pattern one instance at a time, it keeps reappearing. The current approach of fixing individual files is insufficient. The `apiFetch` JSDoc documents the correct pattern, but documentation alone does not prevent the bug. The `apiJson` helper was added in cycle 3 and removed in cycle 4 because no component used it — a clear signal that the approach was wrong. A successful fix requires making the safe path the *easiest* path.

**Recommendation:** Create an ESLint rule that flags `response.json()` or `res.json()` calls that are not preceded by a `response.ok` or `res.ok` check within the same function scope. This would catch the bug at write time.

---

### CRI-2: `anti-cheat-dashboard.tsx` missing polling is a feature gap, not just a bug [MEDIUM/MEDIUM]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:149-151`
**Confidence:** HIGH

The student-facing timeline was fixed in cycle 3 but the instructor dashboard was missed. During a live contest, instructors rely on the anti-cheat dashboard to detect cheating in real time. Without polling, they must manually refresh the page — a poor experience that undermines the purpose of the feature.

---

### CRI-3: Native `<select>` elements keep appearing — need structural solution [LOW/LOW]

**Files:** `accepted-solutions.tsx`, `anti-cheat-dashboard.tsx`, `score-timeline-chart.tsx`, `filter-form.tsx`

**Confidence:** HIGH

5 native `<select>` instances across 4 files. Same class of issue "fixed" in cycles 2 and 3. Without a lint rule or component lint, developers will keep using native `<select>` because it's simpler.

---

### CRI-4: `recruiting-invitations-panel.tsx` mutation handlers lack error handling — inconsistent with codebase conventions [LOW/MEDIUM]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:229-281`
**Confidence:** MEDIUM

`handleRevoke` and `handleDelete` call `apiFetch` without try/catch. Most mutation handlers in the codebase use try/catch with error toast. These two don't. Network errors become unhandled promise rejections.

**Fix:** Add try/catch with error toast, consistent with the rest of the codebase.

## Summary

4 findings: 1 MEDIUM/HIGH, 1 MEDIUM/MEDIUM, 1 LOW/MEDIUM, 1 LOW/LOW.
