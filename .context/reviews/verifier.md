# Verifier Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** verifier
**Base commit:** f55836d0

## V-1: Verify double `.json()` anti-pattern — CONFIRMED in 3 files [MEDIUM/HIGH]

**Files verified:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:273+277` — CONFIRMED
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:67+71` — CONFIRMED
- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx:335+339` — CONFIRMED

Each file calls `response.json().catch(...)` twice on the same Response object. In all three cases, the first call is inside an `if (!response.ok)` block followed by a `throw`, preventing the second call from executing. However, this is the error-first anti-pattern explicitly documented as incorrect in `src/lib/api/client.ts:44-52`.

**Evidence:** Read each file directly. The pattern is consistent across all three:
1. `if (!response.ok) { const errorBody = await response.json().catch(() => ({})); throw new Error(...) }`
2. `const data = await response.json().catch(() => ({ data: {} }))`

---

## V-2: Verify cycle-25 fixes — ALL VERIFIED

- AGG-1 (default error handlers): Verified `getErrorMessage` defaults return `tCommon("error")` with `console.error` in `create-problem-form.tsx`, `assignment-form-dialog.tsx`, `create-group-dialog.tsx`, `edit-group-dialog.tsx`, `role-editor-dialog.tsx`, `role-delete-dialog.tsx`, `problem-set-form.tsx`, `group-members-manager.tsx`.
- AGG-2 (compiler-client i18n): Verified `toast.error(t("runFailed"))` at line 279 without raw description. Verified `String(rawError)` wrapping at line 273.
- AGG-3 (quick-stats typeof): Verified `typeof x === "number" && Number.isFinite(x)` pattern at lines 65-68.
- AGG-4 (parseInt): Verified `parseInt(v, 10)` at line 185 in `contest-replay.tsx`.
- AGG-5 (separate stats fetch): Verified `fetchStats` is separate from `fetchInvitations` in `recruiting-invitations-panel.tsx`.

---

## V-3: `compiler-client.tsx` catch block still shows raw error in inline display [LOW/MEDIUM]

**File:** `src/components/code/compiler-client.tsx:292-296`

The catch block: `const errorMessage = err instanceof Error ? err.message : "Network error"`. This `errorMessage` is passed to `updateTestCase` for the inline error panel. While the toast at line 298 correctly uses `t("networkError")`, the inline display shows the raw `error.message`. This is a partial implementation of the AGG-2 fix from cycle 25.

**Fix:** Change line 292 to use `t("networkError")` for the inline display as well.
