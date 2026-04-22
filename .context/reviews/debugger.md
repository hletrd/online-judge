# Debugger Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** debugger
**Base commit:** b3147a98

## Findings

### DBG-1: `bulk-create-dialog.tsx` — SyntaxError on non-JSON error body masks partial creation results [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/admin/users/bulk-create-dialog.tsx:212-215`

**Description:** The bulk user creation endpoint is a partial-success operation — some users may be created even when the overall response is an error. When `response.json()` throws SyntaxError (e.g., on a 502 from proxy), the catch block on line 222 shows a generic `tCommon("error")` toast. The admin loses visibility into which users were created. This is more impactful than a single-record operation because the admin needs to know the partial state.

**Concrete failure scenario:** Admin uploads CSV with 50 users. The API creates 30 users successfully but then returns 502 due to a proxy timeout. `response.json()` throws SyntaxError. The admin sees "Error" and has no idea that 30 users were already created. They may retry the entire batch, causing duplicate users.

**Fix:** Check `response.ok` before `response.json()`. On error, try to parse the error body with `.catch()` to extract partial results.

**Confidence:** HIGH

---

### DBG-2: `create-group-dialog.tsx` — SyntaxError on non-JSON error body leads to generic error toast [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:64-68`

**Description:** Line 64 calls `response.json()` before checking `response.ok`. The catch block (line 74) shows a generic error via `getErrorMessage`. But when `response.json()` throws SyntaxError, the error is an `Error` instance with `message` equal to "SyntaxError" or a parse error string. The `getErrorMessage` function's default case returns `error.message`, which would show the raw "SyntaxError" string to the user.

**Concrete failure scenario:** Admin creates a group. API returns 502 HTML. SyntaxError thrown. Admin sees "SyntaxError" in a toast instead of a meaningful error.

**Fix:** Check `response.ok` before `response.json()`, and map SyntaxError to a generic i18n key.

**Confidence:** HIGH

---

### DBG-3: `database-backup-restore.tsx` restore path — `.json()` before `response.ok` throws SyntaxError on non-JSON error [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx:144-146`

**Description:** The restore handler calls `response.json()` on line 144 unconditionally, then checks `response.ok` on line 146. If the restore endpoint returns a non-JSON error, SyntaxError is thrown. The catch block shows a generic error, losing the server's actual error message.

**Concrete failure scenario:** Admin restores a database backup. The API returns 502 from the reverse proxy. SyntaxError thrown. The admin sees a generic error instead of the specific restore failure reason.

**Fix:** Use `.json().catch(() => ({}))` before checking `response.ok`, matching the backup handler pattern.

**Confidence:** HIGH

---

## Final Sweep

The prior cycle fixes were properly implemented. The `problem-submission-form.tsx` now correctly checks `response.ok` before `.json()` in both `handleRun` and `handleSubmit`. The discussion components all use the correct pattern. The anti-cheat timeline now uses `useVisibilityPolling`. The remaining issues are all in files that were not previously addressed.
