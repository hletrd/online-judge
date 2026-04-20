# Cycle 6 Architect Review

**Date:** 2026-04-20
**Base commit:** 528cdf29

## Findings

### ARCH-1: Systemic `new Date()` in server component temporal comparisons — 4 remaining pages [MEDIUM/HIGH]

**Files:**
- `src/app/(dashboard)/dashboard/contests/[assignmentId]/page.tsx:188`
- `src/app/(dashboard)/dashboard/problems/[id]/page.tsx:159,187`
- `src/app/(dashboard)/dashboard/groups/[id]/page.tsx:304`
- `src/app/(dashboard)/dashboard/contests/page.tsx:95`

**Description:** The codebase has `getDbNow()` and `getDbNowUncached()` utilities for DB-sourced time, and previous cycles fixed 6 API routes and the recruit page. However, 4 dashboard server components still use `new Date()` for temporal comparisons. This is an architectural consistency issue — the pattern has been established (use DB time for all security-relevant temporal comparisons) but not systematically applied to server components.

The most critical are the contest detail page and problem page, where `new Date()` is used for access-control-adjacent decisions (blocking problem viewing before contest start, blocking submission after deadline).

**Failure scenario:** Clock drift between app server and DB server causes inconsistent access control in server-rendered pages, even though API routes correctly use DB time.
**Fix:** Systematically replace `new Date()` with `getDbNow()` in all server components that make temporal comparisons for access control or status display.
**Confidence:** HIGH

### ARCH-2: `submittedAt` insert value inconsistency with `NOW()` enforcement [LOW/LOW]

**File:** `src/app/api/v1/submissions/route.ts:317`
**Description:** The submission deadline check on line 298 uses `NOW()` in SQL, but the actual `submittedAt` value inserted on line 317 uses `new Date()`. This means the stored timestamp could differ from the DB server's time. While this doesn't affect access control (which uses `NOW()`), it means the stored submission time and the enforcement time are from different clocks.
**Fix:** Consider using the schema's `DEFAULT` for `submittedAt` or capturing `NOW()` from the transaction.
**Confidence:** LOW

## Verified Safe

- `getDbNow()` / `getDbNowUncached()` are well-designed with proper error handling.
- The React.cache() deduplication pattern for `getDbNow()` is appropriate for server components.
- The `createApiHandler` middleware pattern provides consistent auth/CSRF/rate-limit across 83 routes.
- The 22 raw handlers all have documented reasons for not using the standard handler.
