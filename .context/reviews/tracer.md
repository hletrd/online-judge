# Tracer Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** tracer
**Base commit:** b3147a98

## Findings

### TR-1: Causal trace of `response.json()` before `response.ok` in `bulk-create-dialog.tsx` — SyntaxError propagates to generic catch, hides partial results [MEDIUM/HIGH]

**Trace path:** `handleSubmit` -> `apiFetch("/api/v1/users/bulk")` -> server returns 502 with HTML -> `response.json()` throws SyntaxError -> catch block on line 222 -> `toast.error(tCommon("error"))` -> admin sees "Error"

**Description:** The SyntaxError from `response.json()` on a non-JSON body bypasses the intended error path (lines 214-217 which extract `data.error`). For a bulk operation, the server may have partially succeeded before returning the error. The admin gets a generic "Error" toast and has no visibility into which users were created.

**Fix:** Check `response.ok` before calling `.json()`. On error, use `.json().catch(() => ({}))` to extract error details.

**Confidence:** HIGH

---

### TR-2: Causal trace of `create-group-dialog.tsx` SyntaxError path — raw "SyntaxError" shown to user [MEDIUM/MEDIUM]

**Trace path:** `handleSubmit` -> `apiFetch("/api/v1/groups")` -> server returns 502 with HTML -> `response.json()` throws SyntaxError -> catch on line 74 -> `getErrorMessage(error)` -> default case returns `error.message` -> toast shows "SyntaxError" or JSON parse error string

**Description:** The `getErrorMessage` function maps known error codes to i18n keys, but the default case on line 43 returns `error.message` verbatim. When `response.json()` throws SyntaxError, the Error object's message is "SyntaxError" or a JSON parse error description. This raw string is shown to the user in a toast.

**Fix:** Check `response.ok` before `.json()`, and change `getErrorMessage` default case to return a generic i18n key for SyntaxError instances.

**Confidence:** HIGH

---

### TR-3: Causal trace of `database-backup-restore.tsx` restore path — `.json()` throws on non-JSON error, different behavior from backup path [MEDIUM/MEDIUM]

**Trace path:** `handleRestore` -> `apiFetch` -> server returns non-JSON error -> `response.json()` throws SyntaxError -> catch shows generic error toast

**Description:** Tracing both paths in the same component: the backup handler (line 44) correctly uses `.json().catch(() => ({}))` and shows a specific error from the response body. The restore handler (line 144) calls `.json()` unconditionally, which throws SyntaxError on non-JSON responses. The same operation type (database admin action) has different error behavior depending on which path is taken.

**Fix:** Unify both paths to use `.json().catch(() => ({}))`.

**Confidence:** HIGH

---

## Final Sweep

The prior cycle fixes were properly traced and verified. The `submission-detail-client.tsx` retry handler uses a `.then()` chain that also skips `res.ok` check, but this is a lower-risk path since it's a manual user action. The main tracing concern is the 3 remaining files where `response.json()` before `response.ok` produces confusing error messages.
