# Aggregate Review — Cycle 10

**Date:** 2026-04-28
**Reviewers:** code-reviewer (1 lane — focused verification + new findings)
**Total findings:** 0 HIGH, 2 MEDIUM, 6 LOW (deduplicated, new findings only)

---

## Cycle 1-9 Fix Verification Summary

All 40+ tasks from cycles 1-9 were re-verified. No regressions found. Key verifications this cycle:

- C9-AGG-1 through C9-AGG-6: All dark mode fixes confirmed applied and correct
- C9 Task E plan document was marked `[ ]` but the fix IS already in the source — plan doc needs update only
- All prior locale fixes (formatBytes, formatScore, formatDifficulty) remain intact
- ContestStatusKey type fully eliminated, buildContestStatusLabels shared utility still in place
- Badge dark mode variants from cycles 7-8 all present

---

## Deduplicated Findings (sorted by severity)

### C10-AGG-1: [MEDIUM] `formatNumber` in sidebar panel missing locale parameter

**Sources:** C10-CR-1 | **Confidence:** HIGH

`src/components/layout/active-timed-assignment-sidebar-panel.tsx:179` — `formatNumber(progressPercent, { maximumFractionDigits: 1 })` does not pass `locale`. The component already imports and uses `useLocale()` for `labelTracking`, so locale is available but not passed. Same bug class as C8-AGG-1/C8-AGG-2.

**Fix:** Change to `formatNumber(progressPercent, { locale, maximumFractionDigits: 1 })`.

---

### C10-AGG-2: [MEDIUM] `bg-red-500` progress bar in sidebar panel missing dark mode variant

**Sources:** C10-CR-2 | **Confidence:** HIGH

`src/components/layout/active-timed-assignment-sidebar-panel.tsx:185` — Urgent progress bar uses `"bg-red-500"` without a dark mode variant. Non-urgent state uses `"bg-sidebar-primary"` which auto-adapts, but the red variant does not. Same bug class as C9-AGG-3.

**Fix:** Change to `"bg-red-500 dark:bg-red-600"`.

---

### C10-AGG-3: [LOW] Submission overview icon colors missing dark mode variants

**Sources:** C10-CR-3 | **Confidence:** MEDIUM

`src/components/lecture/submission-overview.tsx:177,181,185,190` — Lucide icon colors (`text-red-500`, `text-orange-500`, `text-yellow-500`, `text-blue-500`) without dark mode variants. While C9-AGG-4 fixed text-label colors, the icons were missed. Small decorative icons, lower contrast impact.

**Fix:** Add `dark:text-red-400`, `dark:text-orange-400`, `dark:text-yellow-400`, `dark:text-blue-400` to respective icon classes.

---

### C10-AGG-4: [LOW] Anti-cheat dashboard user icon missing dark mode text variant

**Sources:** C10-CR-4 | **Confidence:** MEDIUM

`src/components/contest/anti-cheat-dashboard.tsx:399` — `<Users className="size-4 text-orange-500" />` without dark mode variant. Same pattern as C10-AGG-3.

**Fix:** Change to `text-orange-500 dark:text-orange-400`.

---

### C10-AGG-5: [LOW] Leaderboard trophy icon missing dark mode variant

**Sources:** C10-CR-5 | **Confidence:** LOW

`src/components/contest/leaderboard-table.tsx:84` — `<Trophy className="size-4 text-yellow-500" />` for rank 1 without dark mode variant. Decorative icon, low impact.

**Fix:** Change to `text-yellow-500 dark:text-yellow-400`.

---

### C10-AGG-6: [LOW] Language config table status badges missing dark mode variants

**Sources:** C10-CR-6 | **Confidence:** MEDIUM

`src/app/(dashboard)/dashboard/admin/languages/language-config-table.tsx:328,424,429,430` — Status badges use `text-green-600`, `text-yellow-600`, `border-green-300`, `border-yellow-300` without dark mode variants. In dark mode, 600-level text and 300-level borders may lack contrast.

**Fix:** Add `dark:text-green-400 dark:border-green-700` and `dark:text-yellow-400 dark:border-yellow-700` variants.

---

### C10-AGG-7: [LOW] File upload dialog success text missing dark mode variant

**Sources:** C10-CR-7 | **Confidence:** LOW

`src/app/(dashboard)/dashboard/admin/files/file-upload-dialog.tsx:189` — `text-green-600` without dark mode variant.

**Fix:** Change to `text-green-600 dark:text-green-400`.

---

### C10-AGG-8: [LOW] Contest join success text missing dark mode variant

**Sources:** C10-CR-8 | **Confidence:** LOW

`src/app/(public)/contests/join/contest-join-client.tsx:92` — `text-green-600` without dark mode variant.

**Fix:** Change to `text-green-600 dark:text-green-400`.

---

## Carried Deferred Items (unchanged from cycle 9)

- DEFER-22: `.json()` before `response.ok` — 60+ instances
- DEFER-23: Raw API error strings without translation — partially fixed
- DEFER-24: `migrate/import` unsafe casts — partially addressed by C2-AGG-4
- DEFER-27: Missing AbortController on polling fetches
- DEFER-28: `as { error?: string }` pattern — 22+ instances
- DEFER-29: Admin routes bypass `createApiHandler`
- DEFER-30: Recruiting validate token brute-force
- DEFER-32: Admin settings exposes DB host/port
- DEFER-33: Missing error boundaries
- DEFER-34: Hardcoded English fallback strings
- DEFER-35: Hardcoded English strings in editor title attributes
- DEFER-36: `formData.get()` cast assertions
- DEFER-43: Docker client leaks `err.message` in build responses
- DEFER-44: No documentation for timer pattern convention
- C2-AGG-9/C3-AGG-5/C4-AGG-4: `getDbNow` called redundantly — LOW, deferred
- C2-AGG-10: CountdownTimer namespace mismatch — LOW, deferred

---

## No Agent Failures

The review lane completed successfully.

---

## Gate Status

- **eslint:** PASSED (0 errors, 0 warnings)
- **tsc --noEmit:** PASSED (0 errors)
- **next build:** PASSED

---

## Plannable Tasks for This Cycle

1. **C10-AGG-1** (MEDIUM) — Pass locale to formatNumber in sidebar panel
2. **C10-AGG-2** (MEDIUM) — Add dark mode variant to sidebar panel progress bar
3. **C10-AGG-3** (LOW) — Add dark mode variants to submission overview icon colors
4. **C10-AGG-4** (LOW) — Add dark mode variant to anti-cheat dashboard user icon
5. **C10-AGG-5** (LOW) — Add dark mode variant to leaderboard trophy icon
6. **C10-AGG-6** (LOW) — Add dark mode variants to language config table status badges
7. **C10-AGG-7** (LOW) — Add dark mode variant to file upload dialog success text
8. **C10-AGG-8** (LOW) — Add dark mode variant to contest join success text
