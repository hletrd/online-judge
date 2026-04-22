# Architectural Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** architect
**Base commit:** b3147a98

## Findings

### ARCH-1: `response.json()` before `response.ok` anti-pattern persists in 4 more files — centralized helper still not created [MEDIUM/HIGH]

**Files:**
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:64`
- `src/app/(dashboard)/dashboard/admin/users/bulk-create-dialog.tsx:212`
- `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx:144`
- `src/lib/plugins/chat-widget/admin-config.tsx:99`

**Description:** This is the fourth cycle where this pattern is flagged. Cycles 1-3 fixed 12+ instances. Cycle 3's aggregate (AGG-1) recommended creating a centralized `apiJson<T>()` helper. The `apiFetch` JSDoc was updated with the anti-pattern example (commit 13c84706), and a prior `apiJson` helper was added then removed (commit 25586070). Yet 4 more files still use the anti-pattern. The root cause remains: without a shared utility that enforces the correct pattern, each new component naturally writes `const data = await response.json()` before checking `response.ok`.

**Fix:** Either (a) create a typed `apiJson<T>(response)` helper that checks `response.ok` first and returns a discriminated union, then migrate these 4 files, or (b) accept the pattern and add an ESLint rule that enforces checking `response.ok` before `.json()`.

**Confidence:** HIGH

---

### ARCH-2: `database-backup-restore.tsx` has inconsistent error handling between backup and restore paths [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx:44 vs 144`

**Description:** The backup handler (line 44) correctly uses `.json().catch(() => ({}))` when parsing error bodies, but the restore handler (line 144) calls `response.json()` unconditionally before checking `response.ok`. This inconsistency within the same component suggests the restore path was added or modified after the backup path was fixed.

**Fix:** Apply the same error-handling pattern to both paths.

**Confidence:** HIGH

---

## Final Sweep

The codebase architecture is sound. The auth layer, CSRF protection, and permission system are well-layered. The `useVisibilityPolling` hook provides a good shared abstraction. The Docker execution sandbox has proper defense-in-depth. The rate-limiter circuit breaker correctly fails open. The main architectural debt is the lack of a centralized API response handler, which continues to produce the same bug pattern.
