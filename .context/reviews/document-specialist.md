# Document Specialist Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** document-specialist
**Base commit:** b3147a98

## Findings

### DOC-1: `useVisibilityPolling` JSDoc still missing note about callback error handling responsibility [LOW/LOW]

**File:** `src/hooks/use-visibility-polling.ts:6-13`

**Description:** This was flagged as DOC-2 in cycle 3 but was not addressed. The JSDoc for `useVisibilityPolling` does not document the expectation that the callback function should handle its own errors (try/catch with toast). Without this documentation, developers may assume the hook handles errors, leading to unhandled rejections when the callback throws.

**Fix:** Add a note to the JSDoc: "The callback must handle its own errors. The hook does not catch errors thrown by the callback."

**Confidence:** MEDIUM

---

### DOC-2: `database-backup-restore.tsx` has no inline comment explaining the inconsistent error handling between backup and restore [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx:44 vs 144`

**Description:** The backup handler uses `.json().catch(() => ({}))` but the restore handler does not. There is no comment explaining why the patterns differ or whether this is intentional. A developer reading one path would naturally assume the other follows the same pattern.

**Fix:** Either unify the patterns, or add a comment explaining the difference.

**Confidence:** LOW

---

## Final Sweep

The `apiFetch` JSDoc was updated in a prior cycle with the anti-pattern example, which is good. The shell command validation comments in `execute.ts` are thorough and well-maintained. The rate-limiter client has excellent documentation of its circuit breaker contract. The main doc gap is the `useVisibilityPolling` callback error handling note, which was identified but not addressed in cycle 3.
