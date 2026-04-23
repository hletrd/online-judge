# UI/UX Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** designer
**Base commit:** 54cb92ed

## Inventory of UI Files Reviewed

- `src/app/(dashboard)/dashboard/contests/page.tsx` — Contests listing page
- `src/app/(dashboard)/dashboard/_components/candidate-dashboard.tsx` — Candidate dashboard
- `src/components/exam/anti-cheat-monitor.tsx` — Anti-cheat monitoring
- `src/components/exam/countdown-timer.tsx` — Exam countdown timer
- `src/components/problem/problem-submission-form.tsx` — Submission form
- `src/components/layout/active-timed-assignment-sidebar-panel.tsx` — Active assignment sidebar

## Previously Fixed Items (Verified)

- Chat widget entry animation + prefers-reduced-motion: PASS
- Chat textarea aria-label: PASS
- Chat widget button aria-label with message count: PASS
- API key auto-dismiss countdown: PASS

## New Findings

### DES-1: Contests page badge colors use inline Tailwind classes with hardcoded hex colors — inconsistent with design system [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/contests/page.tsx:224-228`

**Description:** The contest cards use hardcoded color classes like `bg-blue-500 text-white`, `bg-purple-500 text-white`, `bg-teal-500 text-white`, `bg-orange-500 text-white` for exam mode and scoring model badges. These are hardcoded and not theme-aware — they may have contrast issues in dark mode and don't use the design system's semantic color tokens.

**Fix:** Low priority — use semantic color variants from the design system or ensure these badges have adequate contrast in both light and dark modes.

**Confidence:** Low

---

### Carry-Over Items

- **DES-1 (from cycle 37):** Chat widget button badges use absolute positioning without proper ARIA announcement (LOW/LOW, deferred — screen reader users miss unread count when minimized)
