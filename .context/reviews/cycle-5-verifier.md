# Verifier — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** verifier

## Findings

### V-1: Clock-skew fix verification — recruit page fix confirmed, but 6+ API routes unverified [MEDIUM/HIGH]

**Description:** I verified the cycle 27 recruit page clock-skew fix (commit 6f6f4750):
- `src/app/(auth)/recruit/[token]/page.tsx` correctly imports and uses `getDbNow()` on lines 40 and 65
- `generateMetadata` and the page component both use `const now = await getDbNow()`
- `React.cache()` deduplicates the call within a single server render
- The `formatDateTimeInTimeZone` replacement for `toLocaleString()` is correct

However, the same pattern remains unaddressed in 6 API routes/lib functions that make security-relevant temporal decisions (see SEC-1 through SEC-6). The fix was applied to the least security-critical location first.

**Fix:** Apply `getDbNow()` (or equivalent) to the 6 remaining security-critical temporal comparison sites.

**Confidence:** HIGH

---

### V-2: `getDbNow()` fallback behavior is not documented or tested [LOW/MEDIUM]

**File:** `src/lib/db-time.ts:16`

**Description:** The fallback `row?.now ?? new Date()` on line 16 means that if the DB query fails, the function returns app-server time. This behavior is not documented in the JSDoc comment, which only mentions the purpose and caching behavior. Users of `getDbNow()` may not be aware that it can silently return skewed time.

**Fix:** Document the fallback behavior in the JSDoc, or better, throw an error instead of falling back.

**Confidence:** MEDIUM

---

### V-3: SSE `viewerId` fix verification — incomplete [LOW/MEDIUM]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:315`

**Description:** The cycle 27 fix moved `viewerId` capture before the `sendTerminalResult` closure but the `!` non-null assertion is still present. The cycle 27 plan marked this as DONE, but the underlying issue (non-null assertion) was not fully resolved.

**Fix:** Move `const viewerId = user.id` to after line 194 where TypeScript narrows `user` to non-null.

**Confidence:** MEDIUM

---

## Verified Safe

- Previous cycle-27 fixes confirmed working: recruit page DB time, locale-aware datetime, React.cache() deduplication.
- All LIKE/ILIKE queries use `escapeLikePattern` from `@/lib/db/like`.
- Auth flow is robust with Argon2id, timing-safe dummy hash, and proper token invalidation.
- CSRF protection is in place for server actions.
- Rate limiting has two-tier strategy preventing TOCTOU races.
