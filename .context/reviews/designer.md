# UI/UX Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** designer
**Base commit:** 4b9d48f0

## DES-1: `anti-cheat-dashboard.tsx` expand/collapse buttons lack `aria-controls` [LOW/LOW]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:534`
**Confidence:** MEDIUM

Carried from cycle 18 (DES-2 was about participant-anti-cheat-timeline.tsx). The dashboard's expand/collapse buttons use `aria-expanded` but don't have `aria-controls` pointing to the panel they control. This makes it harder for screen reader users to understand the relationship between the button and the expanded content.

**Fix:** Add an `id` to the expanded `<pre>` element and reference it via `aria-controls`.

---

## DES-2: `contest-replay.tsx` range slider lacks `aria-valuetext` for screen readers [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:159-168`
**Confidence:** LOW

The range slider uses `type="range"` with numeric values but no `aria-valuetext`. Screen readers announce "3 of 10" as just "3" without context. Adding `aria-valuetext` would improve the experience.

**Fix:** Add `aria-valuetext={selectedSnapshot.label}` to the range input.

---

## DES-3: `active-timed-assignment-sidebar-panel.tsx` progress bar `aria-valuenow` uses rounded integer instead of precise value [LOW/LOW]

**File:** `src/components/layout/active-timed-assignment-sidebar-panel.tsx:172`
**Confidence:** LOW

Carried from cycle 18 (DES-3). The progress bar uses `aria-valuenow={Math.round(progressPercent)}` while the visual display shows one decimal place. For accessibility accuracy, the ARIA value should match the visual presentation.

**Fix:** Use `aria-valuenow={progressPercent}` (the value is already constrained 0-100).

---

## Verified Safe

- All icon-only buttons have `aria-label`
- Dialog components use proper focus trapping
- `countdown-timer.tsx` uses `aria-live="polite"` for non-critical announcements
- Anti-cheat privacy notice uses Dialog component with focus trapping
- Korean letter-spacing properly conditional throughout
- Mobile menu sign-out button meets WCAG minimum of 24px touch target
- `code-timeline-panel.tsx` snapshot dots have `aria-label` (fixed in cycle 18)
