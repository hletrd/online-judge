# Verifier Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** verifier
**Base commit:** 4b9d48f0

## V-1: `anti-cheat-dashboard.tsx` `formatDetailsJson` not using i18n — confirmed inconsistent [MEDIUM/HIGH]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:91-97`
**Confidence:** HIGH

Verified that the dashboard's `formatDetailsJson` only pretty-prints JSON while the timeline version uses `t()` with i18n keys. The i18n keys (`detailTargetLabel`, `detailTargets.code-editor`, etc.) exist in both `en.json` and `ko.json`. The dashboard component already uses `useTranslations("contests.antiCheat")` at line 100 — the `t` function is available but not passed to `formatDetailsJson`.

**Evidence:** Line 91-97 shows `function formatDetailsJson(raw: string): string { try { return JSON.stringify(JSON.parse(raw), null, 2); } catch { return raw; } }` — no `t` parameter, no i18n keys. Line 550 calls `formatDetailsJson(event.details!)` without passing `t`.

---

## V-2: `role-editor-dialog.tsx` `Number(e.target.value)` for level — NaN risk confirmed [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/roles/role-editor-dialog.tsx:187`
**Confidence:** HIGH

The level input uses `Number(e.target.value)`. While the HTML `<input type="number" min={0} max={2}>` constrains most input, the `Number()` call on an empty field returns `0` (valid but unintended), and on non-numeric paste returns `NaN`. The `parseInt` pattern with fallback is the established convention in this codebase.

---

## Previously Fixed — Verified

- `participant-anti-cheat-timeline.tsx` polling resets to first page on refresh (AGG-3 fix confirmed)
- `api-keys-client.tsx` migrated to `apiFetchJson` (AGG-4 fix confirmed)
- `formatDuration` consolidated into `src/lib/formatting.ts` (AGG-7 fix confirmed)
- `code-timeline-panel.tsx` snapshot dots have `aria-label` (AGG-8 fix confirmed)
- `quick-create-contest-form.tsx` navigates to contests list when `assignmentId` missing (AGG-9 fix confirmed)
- `active-timed-assignment-sidebar-panel.tsx` has `visibilitychange` listener (AGG-6 fix confirmed)
- All cycle-20 `.catch()` guards confirmed in place (create-group-dialog, admin-config, providers, comment-section)
- All cycle-20 `parseInt` fixes confirmed (admin-config, assignment-form-dialog)
