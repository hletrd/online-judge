# Code Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** code-reviewer
**Base commit:** f55836d0

## CR-1: Double `.json()` anti-pattern in `assignment-form-dialog.tsx:273+277` [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:273,277`

The `handleSubmit` function calls `response.json()` twice on the same Response object — once in the error branch (line 273) and once in the success branch (line 277). While the `throw` on line 274 prevents the second `.json()` from running on error, this is the error-first anti-pattern explicitly documented as "DO NOT USE" in `src/lib/api/client.ts`. It violates the codebase convention of "parse once, then branch" that was established in cycles 23-24 and applied to other files.

**Concrete risk:** If a future developer removes the `throw` or restructures the error handling, the second `.json()` call will throw "body already consumed" at runtime.

**Fix:** Parse the body once before the `if (!response.ok)` check, then branch on `response.ok`.

---

## CR-2: Double `.json()` anti-pattern in `create-group-dialog.tsx:67+71` [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:67,71`

Same pattern as CR-1. The `handleSubmit` function calls `response.json()` twice — once in the error branch (line 67) and once in the success branch (line 71). The `throw` on line 68 prevents double consumption, but this is the error-first anti-pattern documented as incorrect.

**Fix:** Parse the body once before the `if (!response.ok)` check.

---

## CR-3: Double `.json()` anti-pattern in `create-problem-form.tsx:335+339` [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx:335,339`

The `handleImageUpload` function calls `res.json()` twice — once in the error branch (line 335) and once in the success branch (line 339). Same anti-pattern as CR-1 and CR-2.

**Fix:** Parse the body once before the `if (!res.ok)` check.

---

## CR-4: `handleResetAccountPassword` inconsistent with other mutation handlers [LOW/MEDIUM]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:282-301`

`handleRevoke` (line 271) and `handleDelete` (line 311) both call `fetchAll()` after a successful mutation to refresh the invitations list and stats. `handleResetAccountPassword` does NOT call `fetchAll()` after success (line 297). While a password reset doesn't change visible invitation fields, the inconsistency suggests an omission, and if the backend adds side effects to the reset operation in the future, the UI would show stale data.

**Fix:** Add `await fetchAll()` after the success toast in `handleResetAccountPassword`, or add a comment explaining why it is intentionally omitted.

---

## CR-5: `compiler-client.tsx` catch block shows raw `error.message` in inline error display [LOW/MEDIUM]

**File:** `src/components/code/compiler-client.tsx:292-296`

The catch block constructs `errorMessage = err instanceof Error ? err.message : "Network error"` and passes it to `updateTestCase` for inline display. While the toast correctly uses `t("networkError")`, the inline error display shows the raw `error.message` (e.g., "Failed to fetch"). This is inconsistent with the cycle-25 fix (AGG-1) that changed all `getErrorMessage` defaults to never show raw error messages.

**Concrete scenario:** A network failure causes `TypeError: Failed to fetch`. The toast shows the localized "Network error", but the inline error panel below the code editor shows "Failed to fetch".

**Fix:** Use `t("networkError")` for the inline error display as well, and log the raw error to console.

---

## CR-6: `contest-replay.tsx` uses `setInterval` instead of recursive `setTimeout` [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:77-87`

The auto-play feature uses `setInterval` which can accumulate drift over time. While the interval is short (1.4s/speed), using recursive `setTimeout` would be more precise and consistent with the pattern used in `countdown-timer.tsx` and `anti-cheat-monitor.tsx` which both use `setTimeout`.

**Fix:** Replace `setInterval` with recursive `setTimeout` for consistency and precision.
