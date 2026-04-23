# Document Specialist Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** document-specialist
**Base commit:** f55836d0

## DOC-1: `apiFetchJson` JSDoc should mention the "parse once" pattern as the recommended approach [LOW/LOW]

**File:** `src/lib/api/client.ts:87-128`

The `apiFetchJson` JSDoc explains the function's behavior but does not explicitly state that it is the recommended replacement for the "parse once, then branch" pattern. Given that three files still use the error-first double `.json()` anti-pattern, adding a note about migration would help developers understand the preferred approach.

**Fix:** Add a note to the JSDoc: "Prefer `apiFetchJson` over manual `apiFetch` + `.json()` calls to avoid the error-first double `.json()` anti-pattern."

---

## DOC-2: `handleResetAccountPassword` lacks comment explaining why `fetchAll()` is not called [LOW/LOW]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:282-301`

Unlike `handleRevoke` and `handleDelete` which call `fetchAll()` after success, `handleResetAccountPassword` does not. There is no comment explaining whether this is intentional or an oversight. Adding a comment would help future developers understand the design decision.

**Fix:** Add a comment: `// No fetchAll() needed — password reset does not change visible invitation data` or `// TODO: Add fetchAll() for consistency with other mutation handlers`.
