# Cycle 27 Tracer

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### TR-1: Causal trace: recruit page expiry check → clock skew → inconsistent user experience [MEDIUM/HIGH]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:33,89,167`
**Causal chain:**
1. User visits `/recruit/TOKEN`
2. `generateMetadata()` runs: `invitation.expiresAt < new Date()` — uses app server clock
3. Page component runs: same check at line 89
4. Page renders "valid invitation" UI
5. User clicks "Start" → calls redeem API
6. Redeem API checks: `expiresAt > NOW()` — uses DB server clock
7. If app server clock < DB server clock by more than the remaining time, the page says "valid" but the API says "expired"
8. User sees confusing error message

**Hypothesis:** The page should use DB server time, same as the API. The API fix in commit b42a7fe4 was correct but incomplete — the page was not updated.
**Fix:** Fetch DB time alongside the invitation and use it for all comparisons.
**Confidence:** HIGH

### TR-2: `toLocaleString()` locale trace — server-side date formatting uses wrong locale [LOW/MEDIUM]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:218`
**Causal chain:**
1. Server component renders recruit page
2. `new Date(assignment.deadline).toLocaleString()` runs on the server
3. Server's default locale is likely `en-US` (Node.js default)
4. Korean users see English-formatted dates
5. Inconsistent with the rest of the internationalized UI

**Fix:** Use next-intl date formatter.
**Confidence:** MEDIUM
