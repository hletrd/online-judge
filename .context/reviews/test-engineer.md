# Test Engineer Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** test-engineer
**Base commit:** b3147a98

## Findings

### TE-1: No unit tests for `create-group-dialog.tsx` — response.json() before response.ok untested [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx`

**Description:** The create group dialog has no unit tests. The `response.json()` before `response.ok` pattern means that when the server returns non-JSON, the catch block shows a raw SyntaxError message via `getErrorMessage`. This specific failure path is untested.

**Fix:** Add unit tests covering: successful creation, non-JSON error response (502), validation error response (400 with JSON), network error.

**Confidence:** HIGH

---

### TE-2: No unit tests for `bulk-create-dialog.tsx` response handling — partial success and error paths untested [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/users/bulk-create-dialog.tsx`

**Description:** The bulk create dialog has no unit tests for the API response handling. The partial-success case (some users created, some failed) and the non-JSON error case are both untested.

**Fix:** Add unit tests covering: successful bulk creation, partial success, non-JSON error response, empty CSV, validation errors.

**Confidence:** HIGH

---

### TE-3: No unit tests for `database-backup-restore.tsx` restore path — inconsistent error handling untested [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx`

**Description:** The restore path has different error handling from the backup path (no `.json().catch()`), but this inconsistency is not caught by tests.

**Fix:** Add tests that verify both backup and restore error handling produce consistent user feedback.

**Confidence:** LOW

---

## Final Sweep

Test coverage for core hooks (useSubmissionPolling, useVisibilityPolling) remains a deferred item from cycle 1. The most impactful new test gaps are in the admin operations (bulk create, group create) and the database restore path, where the response.json() before response.ok pattern can cause confusing error messages.
