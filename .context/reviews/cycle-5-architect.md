# Architectural Reviewer — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** architect

## Findings

### ARCH-1: Systemic temporal inconsistency — `getDbNow()` introduced but not adopted across the codebase [MEDIUM/HIGH]

**Files:** See SEC-1 through SEC-6 in the security review for the full list of 6+ API routes/lib functions.

**Description:** The `getDbNow()` utility was introduced in cycle 27 (commit 6f6f4750) and applied to the recruit page only. However, the same clock-skew pattern persists in 6+ additional locations that make security-relevant temporal decisions. This is an architectural consistency issue: the codebase has two patterns for temporal comparisons (DB-sourced and app-server-sourced) with no clear convention about when to use which.

**Concrete failure scenario:** A future developer adds a new deadline check using `new Date()`, following the pattern of existing code, not realizing that the established convention (per `getDbNow`'s docstring) is to use DB time for all temporal comparisons.

**Fix:**
1. Adopt `getDbNow()` in all 6+ remaining API routes/lib functions that make security-relevant temporal comparisons.
2. Add a lint rule or code comment convention to prevent `new Date()` in temporal comparison contexts in API routes.
3. Consider a `getDbNowOrFallback()` that uses `React.cache()` in server component contexts and falls back to a direct query in non-React contexts (e.g., `authenticateApiKey`).

**Confidence:** HIGH

---

### ARCH-2: `getDbNow()` is only usable in React server component contexts due to `React.cache()` [LOW/MEDIUM]

**File:** `src/lib/db-time.ts:14`

**Description:** `getDbNow()` uses `React.cache()` for deduplication, which only works within a React server render context. It cannot be used in:
- `authenticateApiKey()` (called from API route middleware, not a React render)
- Server action functions that are not in a React render context
- Utility functions called from non-React contexts

For these cases, the caller would need to call `rawQueryOne("SELECT NOW()")` directly, or a separate non-cached helper is needed.

**Fix:** Add a `getDbNowUncached()` helper that calls `rawQueryOne("SELECT NOW()")` directly for use in non-React contexts. Document when to use each variant.

**Confidence:** MEDIUM

---

### ARCH-3: Inconsistent use of `createApiHandler` across route handlers (carried forward from cycle 27 DEFER-1) [LOW/MEDIUM]

**Files:** 22 raw route handlers in `src/app/api/`

**Description:** Same finding as cycle 27 AGG-4, carried forward. 22 route handlers manually implement auth/CSRF/rate-limit logic instead of using `createApiHandler`. Some have legitimate reasons (SSE streaming, judge token auth, multipart form data).

**Fix:** Migrate routes that can use `createApiHandler`. For those that cannot, document the reason.

**Confidence:** MEDIUM (carried forward from cycle 27)

---

## Verified Safe

- `escapeLikePattern` in `@/lib/db/like` is now used consistently across all LIKE/ILIKE queries — DRY issue resolved.
- `createApiHandler` pattern provides excellent consistency for auth, CSRF, rate limiting, and Zod validation.
- Capability model with `resolveCapabilities()` is well-designed and extensible for custom roles.
- Audit event system is comprehensive and well-structured.
- `isAdmin()` sync helper usage is documented with rationale.
