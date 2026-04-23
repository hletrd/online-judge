# Code Quality Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** code-reviewer
**Base commit:** 4b9d48f0

## CR-1: `anti-cheat-dashboard.tsx` `formatDetailsJson` not migrated to i18n — duplicate of fixed issue [MEDIUM/HIGH]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:91-97`
**Confidence:** HIGH

The `participant-anti-cheat-timeline.tsx` `formatDetailsJson` was migrated in cycle 18 to use `t()` with i18n keys (`detailTargetLabel`, `detailTargets.*`). However, the `anti-cheat-dashboard.tsx` still has the old version that only pretty-prints JSON. When an anti-cheat event has a `target` field (e.g., `{"target": "code-editor"}`), the dashboard shows raw JSON `{"target": "code-editor"}` while the timeline shows "Target: Code editor" (localized). This is an i18n consistency violation.

**Concrete failure:** An instructor viewing the anti-cheat dashboard sees `{"target": "code-editor"}` in expanded details, while the participant timeline shows the localized "Target: Code editor" / Korean equivalent. The same data is displayed differently in two views.

**Fix:** Migrate `formatDetailsJson` in `anti-cheat-dashboard.tsx` to accept `t` as a parameter, matching the `participant-anti-cheat-timeline.tsx` implementation. The i18n keys already exist in both `en.json` and `ko.json`.

---

## CR-2: `role-editor-dialog.tsx` uses `Number(e.target.value)` for level input — NaN risk [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/roles/role-editor-dialog.tsx:187`
**Confidence:** HIGH

The role level input uses `Number(e.target.value)` which can produce `NaN` from non-numeric input or `0` from empty string. The `level` field is constrained to 0-2 in the HTML but `Number()` does not guarantee a valid integer in range.

**Concrete failure:** If a user clears the input field, `Number("")` returns `0`, which is a valid level. But if they type non-numeric text, `Number("abc")` returns `NaN`, which could be sent to the server.

**Fix:** Use `parseInt(e.target.value, 10) || 0` and clamp to 0-2 range, matching the pattern used in admin-config and assignment-form-dialog.

---

## CR-3: `quick-create-contest-form.tsx` uses `Number(e.target.value)` for duration and points — NaN risk [LOW/LOW]

**File:** `src/components/contest/quick-create-contest-form.tsx:133,172`
**Confidence:** MEDIUM

Both `setDurationMinutes(Number(e.target.value) || 60)` and `updateProblemPoints(i, Number(e.target.value) || 100)` use `Number()`. The `|| 60` and `|| 100` fallbacks handle `NaN` (since `NaN || 60` is `60`), but `Number("12abc")` returns `NaN` rather than `12`. This differs from `parseInt` which would parse the leading digits.

**Fix:** Use `parseInt(e.target.value, 10) || 60` and `parseInt(e.target.value, 10) || 100` for consistency with other numeric inputs in the codebase.

---

## CR-4: `contest-replay.tsx` uses `Number(event.target.value)` for slider — no NaN guard [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:166`
**Confidence:** LOW

The range slider `onChange` uses `Number(event.target.value)` without guard. While HTML range inputs always return valid numbers, this is inconsistent with the established pattern.

**Fix:** Use `parseInt(event.target.value, 10)` for consistency. Low priority because HTML range inputs are inherently safe.

---

## Verified Safe

- All `res.json()` calls in client components have `.catch()` guards
- `apiFetchJson` is consistently used for polling and data-fetching patterns
- `formatDuration` properly consolidated into `src/lib/formatting.ts`
- `participant-anti-cheat-timeline.tsx` `formatDetailsJson` properly uses i18n `t()` function
- `api-keys-client.tsx` migrated to `apiFetchJson`
- No `innerHTML` assignments in the codebase
- No `as any` or `@ts-ignore` found
- Korean letter-spacing is properly conditional throughout
- Sidebar timer has visibility awareness (`visibilitychange` listener)
