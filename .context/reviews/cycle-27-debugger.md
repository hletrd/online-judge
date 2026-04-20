# Cycle 27 Debugger

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### DBG-1: Recruit page temporal comparison uses app server clock — diverges from DB clock [MEDIUM/HIGH]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:33,89,167`
**Description:** Three places on the recruit page compare dates using `new Date()`:
- Line 33: `invitation.expiresAt && invitation.expiresAt < new Date()` (in `generateMetadata`)
- Line 89: same check (in page component)
- Line 167: `assignment.deadline && assignment.deadline < new Date()`

The API route for the same domain logic uses `SQL NOW()` to avoid clock skew. If the app server clock drifts relative to the DB server, the page will show inconsistent state compared to what the API enforces.

**Failure scenario:** App server clock is 3 minutes behind DB server clock. An invitation expires at DB time 12:00. At DB time 12:02, the page still shows the invitation as valid (app server thinks it's 11:59). User clicks "Start" — the API rejects with "expired".
**Fix:** Use DB server time for all temporal comparisons. Fetch `NOW()` from the DB and pass it as a parameter, or perform the comparison in SQL.
**Confidence:** HIGH

### DBG-2: SSE `user!` non-null assertion could mask future bugs [LOW/LOW]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:319`
**Description:** `const viewerId = user!.id;` uses a non-null assertion. While the comment explains the reasoning, it would be safer to capture the value before entering the closure.
**Failure scenario:** If the SSE handler is refactored in a way that `user` could be null, the non-null assertion silently passes the null check and throws at runtime instead of getting a clear compile-time error.
**Fix:** Capture `const viewerId = user?.id;` before the closure.
**Confidence:** LOW

## Verified Safe

- All previous cycle bugs are confirmed fixed (recruit-page-metadata test, ESLint warnings, React.cache deduplication).
- No empty catch blocks in production code.
- Error boundaries properly log errors.
- Judge claim/poll routes handle edge cases (invalid claim token, stale claims, worker capacity).
