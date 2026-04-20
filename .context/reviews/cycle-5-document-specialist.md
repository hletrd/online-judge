# Document Specialist — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** document-specialist

## Findings

### DOC-1: `getDbNow()` JSDoc does not document fallback behavior [LOW/MEDIUM]

**File:** `src/lib/db-time.ts:3-13`

**Description:** The JSDoc for `getDbNow()` explains the purpose (avoid clock skew) and the caching behavior (React.cache() deduplication), but does not mention the fallback behavior on line 16: `return row?.now ?? new Date()`. If the DB query returns null, the function falls back to `new Date()`, which is the exact behavior the utility was designed to avoid. This is a code-doc mismatch.

**Fix:** Either:
1. Document the fallback behavior in the JSDoc and explain when it would trigger, or
2. Remove the fallback by throwing an error when the DB query returns null (preferred).

**Confidence:** HIGH

---

### DOC-2: `access-codes.ts` comment says "transaction-consistent time" but uses `new Date()` [LOW/MEDIUM]

**File:** `src/lib/assignments/access-codes.ts:127`

**Description:** The comment on line 127 says "Block join after contest deadline (using transaction-consistent time)" but the actual code uses `const now = new Date()` on line 128, which is app-server time, not transaction-consistent time. This is a doc-code mismatch that could mislead future developers into thinking the time is DB-sourced.

**Fix:** Either update the comment to accurately describe the behavior, or fix the code to actually use DB-sourced time within the transaction.

**Confidence:** HIGH

---

## Verified Safe

- `escapeLikePattern` JSDoc correctly documents the escape order and the requirement to use `ESCAPE '\\'` clause.
- API route handler patterns are well-documented with comments explaining design decisions.
- The `isAdmin()` usage in assignment routes has clear documentation explaining the rationale.
