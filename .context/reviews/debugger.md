# Debugger Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** debugger
**Base commit:** 4b9d48f0

## DBG-1: `anti-cheat-dashboard.tsx` `formatDetailsJson` diverges from timeline version — data displayed differently [MEDIUM/MEDIUM]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:91-97`
**Confidence:** HIGH

The dashboard's `formatDetailsJson` only pretty-prints JSON. The timeline version (fixed in cycle 18) renders the `target` field as "Target: Code editor". When an instructor looks at both views for the same student, they see different representations of the same data.

**Concrete failure:** Instructor expands event details on the anti-cheat dashboard and sees `{"target": "code-editor"}`. They then switch to the participant timeline and see "Target: Code editor" for the exact same event. The inconsistency could confuse debugging efforts.

**Fix:** Migrate the dashboard's `formatDetailsJson` to match the timeline's i18n-aware version.

---

## DBG-2: `role-editor-dialog.tsx` `Number()` on level input can produce NaN [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/roles/role-editor-dialog.tsx:187`
**Confidence:** MEDIUM

`Number(e.target.value)` on the level input. If the user pastes non-numeric text, `NaN` is set as the level. When the form is submitted, the `level` field would be `NaN`, which is truthy but not a valid number. The server-side Zod schema (`z.number().int().min(0).max(2)`) would reject it, but the error message would be confusing.

**Concrete failure:** Admin pastes "abc" into the level field. `Number("abc")` is `NaN`. Form submission sends `NaN` as level. Server returns validation error with a generic message about level not being a valid integer.

**Fix:** Use `parseInt(e.target.value, 10) || 0` and rely on server-side validation for range.

---

## DBG-3: `contest-replay.tsx` playback `setInterval` drifts in background tabs [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:77-87`
**Confidence:** LOW

The replay playback uses `setInterval` without visibility awareness. When the tab is hidden, browsers throttle intervals. On tab return, the replay may have skipped frames or finished unexpectedly.

**Concrete failure:** User starts replay at 4x speed, switches tabs for 30 seconds, returns. The replay may have finished or jumped to an unexpected snapshot due to throttled interval execution.

**Fix:** Add `visibilitychange` listener to pause playback when tab is hidden. Low severity since this is a cosmetic playback feature.

---

## Verified Safe

- All `res.json()` calls have `.catch()` guards
- No unguarded `innerHTML` assignments
- `apiFetchJson` safely handles both ok and non-ok responses
- Anti-cheat monitor properly uses refs for stable event handlers
- Countdown timer validates `Number.isFinite(data.timestamp)` before using
- `participant-anti-cheat-timeline.tsx` polling correctly resets to first page (no more offset drift)
