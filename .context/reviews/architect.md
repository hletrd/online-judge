# Architectural Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** architect
**Base commit:** 4b9d48f0

## ARCH-1: `anti-cheat-dashboard.tsx` `formatDetailsJson` is a divergent copy of the timeline version — DRY violation [MEDIUM/MEDIUM]

**Files:**
- `src/components/contest/anti-cheat-dashboard.tsx:91-97`
- `src/components/contest/participant-anti-cheat-timeline.tsx:45-59`

**Confidence:** HIGH

Two `formatDetailsJson` functions exist with different behavior. The timeline version (fixed in cycle 18) uses i18n keys to render "Target: Code editor" from `{"target": "code-editor"}`. The dashboard version only pretty-prints JSON. Both components display the same anti-cheat event details data. This violates DRY and creates an inconsistency where the same data appears differently in two views.

**Fix:** Extract a shared `formatDetailsJson(raw, t)` utility that both components import, or have the dashboard component pass `t` to its local copy.

---

## ARCH-2: `ContestsLayout` uses event delegation with hardcoded DOM queries — fragile pattern [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/contests/layout.tsx:40-43`
**Confidence:** MEDIUM

Carried from cycle 18. The layout uses `document.getElementById("main-content")` and `document.querySelector("[data-slot='sidebar']")` to attach click handlers. These DOM queries are fragile — if the IDs or data-slot attributes change, the handlers silently stop working.

**Fix:** Add a defensive check and console warning if the elements are not found. No immediate action needed.

---

## ARCH-3: Inconsistent numeric input handling — `Number()` vs `parseInt()` across forms [LOW/MEDIUM]

**Files:**
- `src/components/contest/quick-create-contest-form.tsx:133,172` — `Number()`
- `src/app/(dashboard)/dashboard/admin/roles/role-editor-dialog.tsx:187` — `Number()`
- `src/components/contest/contest-replay.tsx:166` — `Number()`
- `src/lib/plugins/chat-widget/admin-config.tsx:294,305` — `parseInt()` (correct)
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:454` — `parseInt()` (correct)

**Confidence:** HIGH

Some form inputs use `Number()` while others use `parseInt()`. The established pattern in recent fixes is `parseInt()` with fallback defaults. `Number()` can produce `NaN` from non-numeric strings and parses the entire string (e.g., `Number("12abc")` is `NaN`), while `parseInt("12abc", 10)` returns `12`.

**Fix:** Standardize all numeric form inputs to `parseInt(e.target.value, 10) || defaultValue`.

---

## Verified Safe

- `apiFetchJson` adoption is comprehensive across contest components and admin panels
- `useVisibilityPolling` is the standard polling pattern
- `copyToClipboard` utility properly centralizes clipboard logic
- Formatting utilities are well-consolidated in `src/lib/formatting.ts`
- Navigation patterns are centralized via `forceNavigate` and `public-nav`
- Auth flow uses proper session handling with `createApiHandler`
