# Critic Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** critic
**Base commit:** b3147a98

## Findings

### CRI-1: The `response.json()` before `response.ok` pattern keeps re-appearing — JSDoc warning alone is insufficient [MEDIUM/HIGH]

**Description:** This is the fourth cycle where this pattern is flagged. The JSDoc anti-pattern example was added in a prior cycle, yet 4 new instances were found this cycle (`create-group-dialog.tsx`, `bulk-create-dialog.tsx`, `database-backup-restore.tsx` restore path, `admin-config.tsx`). Documentation-only approaches do not prevent the pattern — developers copy existing code or write from habit. A structural solution (shared helper, ESLint rule, or linter plugin) is needed.

**Concrete failure scenario:** A developer adds a new API-consuming component. They read the JSDoc, forget the pattern 5 minutes later, and naturally write `const data = await response.json()` then `if (!response.ok)`. The same bug reappears.

**Fix:** Implement either a shared `apiJson<T>()` helper or an ESLint custom rule that enforces `response.ok` checks before `.json()`.

**Confidence:** HIGH

---

### CRI-2: `database-backup-restore.tsx` has inconsistent error handling within the same component [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx`

**Description:** The backup handler uses `.json().catch(() => ({}))` but the restore handler does not. Same component, different patterns. This is a code quality issue that makes maintenance harder — a developer looking at one path assumes the other follows the same pattern.

**Fix:** Unify both paths to use the same error handling pattern.

**Confidence:** HIGH

---

## Final Sweep

The codebase is in good shape overall. The fixes from prior cycles were properly implemented. The main systemic issue is the recurring `response.json()` anti-pattern, which needs a structural solution rather than continued one-file-at-a-time patches.
