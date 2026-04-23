# Test Engineer Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** test-engineer
**Base commit:** 4b9d48f0

## TE-1: No unit tests for `formatDetailsJson` in `anti-cheat-dashboard.tsx` [LOW/MEDIUM]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:91-97`
**Confidence:** HIGH

The dashboard's `formatDetailsJson` has no test coverage. When migrated to use `t()` (matching the timeline version), edge cases should be tested.

**Fix:** Add unit tests when migrating to i18n-aware version: valid JSON with target field, valid JSON without target field, malformed JSON fallback, empty object.

---

## TE-2: No component tests for `anti-cheat-dashboard.tsx` [LOW/MEDIUM]

**File:** `src/components/contest/anti-cheat-dashboard.tsx`
**Confidence:** MEDIUM

The anti-cheat dashboard component has no component tests. Key interactions to test: event loading, type/student filtering, expand/collapse details, load more pagination, similarity check trigger.

---

## TE-3: No component tests for `role-editor-dialog.tsx` [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/roles/role-editor-dialog.tsx`
**Confidence:** MEDIUM

The role editor dialog has no component tests. Key interactions to test: role creation, role editing, level input validation, capability selection.

---

## TE-4: No component tests for `contest-replay.tsx` [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx`
**Confidence:** MEDIUM

The contest replay component has no component tests. Key interactions: play/pause, speed change, slider navigation, animated row transitions.

---

## Carried Forward Test Gaps

- TE-5: `apiFetchJson` helper untested — carried from DEFER-56
- TE-6: Encryption module untested — carried from DEFER-50
- TE-7: `compiler-client.tsx` untested — carried from cycle 16
- TE-8: `invite-participants.tsx` untested — carried from cycle 16
- TE-9: `recruiter-candidates-panel.tsx` untested — carried from cycle 16
- TE-10: `access-code-manager.tsx` untested — carried from cycle 16
- TE-11: `formatDetailsJson` in `participant-anti-cheat-timeline.tsx` — carried from cycle 18 (tests should be added at same time as dashboard migration)

## Verified Safe

- Unit test suite passes all tests
- Component tests for `contest-quick-stats`, `contest-clarifications`, `contest-announcements` exist and pass
- `formatting.test.ts` covers `formatNumber`, `formatBytes`, `formatScore`, `formatDuration`
- `apiFetch` unit tests exist and pass
