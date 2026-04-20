# Critic — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** critic

## Findings

### CRI-1: Clock-skew fix was applied narrowly to recruit page but not to more security-critical paths [MEDIUM/HIGH]

**Description:** The cycle 27 fix for clock-skew (AGG-1) was applied only to the recruit page. However, the same `new Date()` pattern is used in more security-critical locations:
- API key authentication (programmatic access control)
- Exam session creation (academic integrity)
- Access code redemption (contest access control)
- Submission creation (exam deadline enforcement)
- Anti-cheat event submission (contest boundary enforcement)

The recruit page is a display-only page — showing "expired" incorrectly is annoying but not a security breach. The API paths above are enforcement points where clock-skew can grant unauthorized access. The fix was applied in the wrong order of priority.

**Fix:** Prioritize `getDbNow()` adoption in API routes and server actions that enforce deadlines, not just display pages.

**Confidence:** HIGH

---

### CRI-2: `getDbNow()` fallback to `new Date()` defeats the purpose [MEDIUM/MEDIUM]

**File:** `src/lib/db-time.ts:16

**Description:** `getDbNow()` falls back to `new Date()` when the DB query returns null: `return row?.now ?? new Date()`. If the DB query fails silently (returns null), the function falls back to the exact behavior it was designed to prevent. This could mask DB connectivity issues — the function would appear to work but provide incorrect time.

**Concrete failure scenario:** A transient DB issue causes `rawQueryOne` to return null. `getDbNow()` falls back to `new Date()`, which may be skewed. All temporal comparisons using this value are now incorrect, and no error is logged or thrown.

**Fix:** Throw an error when the DB query returns null instead of silently falling back to `new Date()`. At minimum, log a warning so operators can detect the issue.

**Confidence:** MEDIUM

---

### CRI-3: SSE non-null assertion fix is incomplete [LOW/MEDIUM]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:315`

**Description:** The cycle 27 fix for the `user!.id` non-null assertion (AGG-3/M2) moved the capture but kept the `!` operator. The fix was marked as DONE but the underlying issue (non-null assertion) persists. The `!` should have been removed by moving the capture to a location where TypeScript can narrow the type.

**Fix:** Move `const viewerId = user.id` to after the null check on line 194 where TypeScript narrows `user` to non-null.

**Confidence:** MEDIUM

---

## Verified Safe

- Auth flow is robust with Argon2id, timing-safe dummy hash, rate limiting, and proper token invalidation.
- CSRF protection is comprehensive.
- No `dangerouslySetInnerHTML` without sanitization.
- No silently swallowed catch blocks.
