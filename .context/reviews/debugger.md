# Debugger Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** debugger
**Base commit:** f55836d0

## DBG-1: Double `.json()` is a latent "body already consumed" bug in 3 files [MEDIUM/HIGH]

**Files:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:273,277`
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:67,71`
- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx:335,339`

**Failure mode:** If any developer refactors the error-first `.json()` pattern and accidentally removes or moves the `throw` statement, the second `.json()` call will throw `TypeError: Body already consumed` at runtime. This error would propagate up as an unhandled exception, bypassing the `getErrorMessage` mapping and potentially showing a raw error message to the user.

**Concrete scenario:** A developer changes `throw new Error(...)` to `setFormError(...)` (not throwing), and the code falls through to the second `.json()`, which throws. The catch block catches this new error but maps it through `getErrorMessage` where it does not match any known code, showing `tCommon("error")`.

**Fix:** Migrate to "parse once, then branch" pattern to eliminate the latent bug.

---

## DBG-2: `handleResetAccountPassword` missing `fetchAll()` — stale data potential [LOW/LOW]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:282-301`

After a successful password reset, the invitations list is not refreshed. While this currently does not cause visible issues (password reset does not change invitation data), if the backend adds audit logging or status changes to the reset operation, the UI would show stale data.

**Fix:** Add `fetchAll()` after the success toast for consistency with `handleRevoke` and `handleDelete`.
