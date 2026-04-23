# Critic Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** critic
**Base commit:** 4b9d48f0

## CRI-1: `anti-cheat-dashboard.tsx` `formatDetailsJson` not migrated to i18n — partial fix from cycle 18 [MEDIUM/HIGH]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:91-97`
**Confidence:** HIGH

The cycle-18 fix for AGG-1 (hardcoded English in `formatDetailsJson`) only addressed `participant-anti-cheat-timeline.tsx`. The `anti-cheat-dashboard.tsx` has a separate copy that was not updated. The dashboard is the instructor-facing view of the same anti-cheat data. Both components should display localized details consistently.

**Concrete failure:** An instructor viewing the anti-cheat dashboard sees raw JSON `{"target": "code-editor"}` in expanded details, while a student viewing the participant timeline sees the localized "Target: Code editor".

**Fix:** Migrate the dashboard's `formatDetailsJson` to accept `t` as a parameter and use i18n keys, matching the timeline implementation.

---

## CRI-2: Stale plan files continue to accumulate — process debt [LOW/HIGH]

**Files:** `plans/open/` directory
**Confidence:** HIGH

Carried from cycle 18 (CRI-3). Multiple plan files in `plans/open/` have been present since cycles 8-17 and may have items already implemented. This wastes review effort and creates confusion about what remains.

**Fix:** Audit all open plan files and archive those where all items are DONE.

---

## CRI-3: `recruiter-candidates-panel.tsx` uses export endpoint for display — architectural mismatch [MEDIUM/MEDIUM]

**File:** `src/components/contest/recruiter-candidates-panel.tsx:50-53`
**Confidence:** HIGH

Carried from cycle 18 (CRI-4). Same finding as PERF-1 and DEFER-29.

---

## Verified Safe

- All cycle-18/19/20 fixes confirmed working (apiFetchJson migration, .catch() guards, aria-labels, parseInt fixes)
- Korean letter-spacing compliance maintained
- No new `as any` or `@ts-ignore` introduced
- i18n keys used consistently in new code
