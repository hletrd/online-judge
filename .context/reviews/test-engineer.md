# Test Engineer Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** test-engineer
**Base commit:** f55836d0

## TE-1: No tests for double `.json()` anti-pattern regression [MEDIUM/MEDIUM]

**Files:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx`
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx`
- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx`

There are no tests that verify the "parse once, then branch" pattern is used. If a developer accidentally introduces the double `.json()` anti-pattern (calling `.json()` twice on the same Response), there is no test to catch it. This is important because the anti-pattern was fixed in other files but these three were missed.

**Fix:** Add unit tests that mock `fetch` to return error responses and verify the component handles them correctly without throwing "body already consumed" errors. Alternatively, add a lint rule that detects double `.json()` calls on the same variable.

---

## TE-2: No tests for `handleResetAccountPassword` behavior [LOW/MEDIUM]

**File:** `src/components/contest/recruiting-invitations-panel.tsx`

There are no tests verifying that `handleResetAccountPassword` correctly calls the API and shows the appropriate toast. This is the only mutation handler in the component without test coverage.

**Fix:** Add integration tests for the password reset flow.

---

## TE-3: Carried test coverage gaps from previous cycles

- TE-1 (cycle 25): No unit tests for `getErrorMessage` default case behavior — still open
- TE-2 (cycle 25): No tests for compiler-client error display behavior — still open
- TE-3 (cycle 25): No tests for contest-quick-stats data validation logic — still open
