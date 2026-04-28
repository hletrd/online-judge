# Code Reviewer — RPF Cycle 10

**Date:** 2026-04-28
**Reviewer:** code-reviewer (focused verification + new findings)
**Scope:** Verification of cycles 1-9 fixes and fresh sweep for remaining issues

---

## Cycle 1-9 Fix Verification

All prior cycle fixes verified as complete and correct. Specific verification this cycle:

- C9-AGG-1 (SVG stacked bar dark fills): `fill-green-500 dark:fill-green-600` and `fill-yellow-500 dark:fill-yellow-600` confirmed at `analytics-charts.tsx:231,237`
- C9-AGG-2 (legend swatches dark variants): `bg-green-500 dark:bg-green-600` and `bg-yellow-500 dark:bg-yellow-600` confirmed at `analytics-charts.tsx:612,616`
- C9-AGG-3 (submission overview progress bar): `bg-green-500 dark:bg-green-600` confirmed at `submission-overview.tsx:167`
- C9-AGG-4 (submission overview text colors): `text-green-500 dark:text-green-400` at line 163, `text-green-500 dark:text-green-400` on icon line 173, `text-green-500 dark:text-green-400`, `text-blue-500 dark:text-blue-400`, `text-red-500 dark:text-red-400` at lines 204-206 — all confirmed
- C9-AGG-5 (anti-cheat icon bg): `bg-orange-500/10 dark:bg-orange-500/15` confirmed at `anti-cheat-dashboard.tsx:398` (note: plan Task E was marked `[ ]` but the fix IS applied)
- C9-AGG-6 (anti-cheat SVG palette): All 6 palette entries have `dark:fill-*` variants confirmed at `analytics-charts.tsx:418-425`

**No regressions found.**

---

## New Findings

### C10-CR-1: [MEDIUM] `formatNumber` in sidebar panel missing locale parameter

**File:** `src/components/layout/active-timed-assignment-sidebar-panel.tsx:179`
**Confidence:** HIGH

`formatNumber(progressPercent, { maximumFractionDigits: 1 })` does not pass `locale`. The component already imports and uses `useLocale()` for `labelTracking`, so locale is available but not passed to `formatNumber`. This is the same bug class as C8-AGG-1 (formatBytes missing locale) and C8-AGG-2 (formatNumber in system-info.ts).

**Fix:** Change to `formatNumber(progressPercent, { locale, maximumFractionDigits: 1 })`.

---

### C10-CR-2: [MEDIUM] `bg-red-500` progress bar in sidebar panel missing dark mode variant

**File:** `src/components/layout/active-timed-assignment-sidebar-panel.tsx:185`
**Confidence:** HIGH

The urgent progress bar uses `"bg-red-500"` without a dark mode variant. The non-urgent state uses `"bg-sidebar-primary"` which is a CSS variable that auto-adapts, but the red variant does not. Same bug class as C9-AGG-3.

**Fix:** Change to `"bg-red-500 dark:bg-red-600"`.

---

### C10-CR-3: [LOW] Submission overview icon colors missing dark mode variants (residual)

**File:** `src/components/lecture/submission-overview.tsx`
**Lines:** 177 (`text-red-500`), 181 (`text-orange-500`), 185 (`text-yellow-500`), 190 (`text-blue-500`)
**Confidence:** MEDIUM

While C9-AGG-4 fixed the text-label colors (lines 163, 173, 204-206), the Lucide icon colors on lines 177, 181, 185, 190 still use `text-{color}-500` without dark mode variants. These are small decorative icons, so contrast impact is lower than text labels, but for consistency with the text label fixes:

**Fix:** Add dark mode variants: `text-red-500 dark:text-red-400`, `text-orange-500 dark:text-orange-400`, `text-yellow-500 dark:text-yellow-400`, `text-blue-500 dark:text-blue-400`.

---

### C10-CR-4: [LOW] Anti-cheat dashboard user icon missing dark mode text variant

**File:** `src/components/contest/anti-cheat-dashboard.tsx:399`
**Confidence:** MEDIUM

`<Users className="size-4 text-orange-500" />` — icon color without dark mode variant. Same pattern as C10-CR-3.

**Fix:** Change to `text-orange-500 dark:text-orange-400`.

---

### C10-CR-5: [LOW] Leaderboard trophy icon missing dark mode variant

**File:** `src/components/contest/leaderboard-table.tsx:84`
**Confidence:** LOW

`<Trophy className="size-4 text-yellow-500" />` for rank 1 — no dark mode variant. Ranks 2 and 3 use `text-slate-400` and `text-amber-600` which have reasonable dark mode contrast. This is a decorative icon, low impact.

**Fix:** Change to `text-yellow-500 dark:text-yellow-400`.

---

### C10-CR-6: [LOW] Language config table status badges missing dark mode variants

**File:** `src/app/(dashboard)/dashboard/admin/languages/language-config-table.tsx`
**Lines:** 328, 424, 429, 430
**Confidence:** MEDIUM

Status badges use `text-green-600`, `text-yellow-600`, `border-green-300`, `border-yellow-300` without dark mode variants. In dark mode, these 600-level text colors and 300-level border colors may lack sufficient contrast against dark backgrounds.

**Fix:** Add `dark:text-green-400 dark:border-green-700` and `dark:text-yellow-400 dark:border-yellow-700` variants to the badge classes.

---

### C10-CR-7: [LOW] File upload dialog success text missing dark mode variant

**File:** `src/app/(dashboard)/dashboard/admin/files/file-upload-dialog.tsx:189`
**Confidence:** LOW

`text-green-600` without dark mode variant. In dark mode, green-600 text against dark backgrounds may have reduced contrast.

**Fix:** Change to `text-green-600 dark:text-green-400`.

---

### C10-CR-8: [LOW] Contest join success text missing dark mode variant

**File:** `src/app/(public)/contests/join/contest-join-client.tsx:92`
**Confidence:** LOW

`text-green-600` without dark mode variant for success message text.

**Fix:** Change to `text-green-600 dark:text-green-400`.

---

## Plan Status Note

C9 Task E (`anti-cheat-dashboard.tsx:398` icon background dark variant) is marked `[ ] Done` in the plan but the fix IS already applied in the source code. The plan document needs to be updated to `[x] Done`.
