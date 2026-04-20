# Cycle 27 Architect Review

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### ARCH-1: Clock-skew inconsistency between server-rendered pages and API validation [MEDIUM/HIGH]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:33,89,167` vs `src/app/api/v1/recruiting/validate/route.ts:36`
**Description:** The recruit page uses `new Date()` for temporal comparisons while the API uses SQL `NOW()`. This is a layering violation: business logic for "is this invitation expired?" should use a single authoritative time source. The API correctly identified and fixed this (commit b42a7fe4), but the server-rendered page was not aligned.
**Failure scenario:** Clock drift causes the page to show a different state than the API. This violates the principle that a user should see consistent state between what the page displays and what the API enforces.
**Fix:** Introduce a shared "now" value that the page and API both use. For server components, fetch `SELECT NOW()` as part of the invitation query. For API routes, continue using SQL `NOW()`.
**Confidence:** HIGH

### ARCH-2: Inconsistent use of `createApiHandler` across route handlers [LOW/MEDIUM]

**File:** 22 raw route handlers in `src/app/api/`
**Description:** 22 route handlers use manual auth/CSRF/rate-limit logic instead of `createApiHandler`. While some have legitimate reasons (SSE streaming, judge token auth, multipart form data), others (backup, restore, migrate/import, migrate/export, files POST) manually duplicate the auth+CSRF+rate-limit pattern. This creates maintenance risk: if the pattern changes, 22 files must be updated instead of 1.
**Failure scenario:** A future security fix to the auth pattern is applied to `createApiHandler` but missed in one of the 22 manual routes.
**Fix:** For routes that can use `createApiHandler` (backup, restore, files POST), migrate to it. For routes that genuinely cannot (SSE, judge auth), document why.
**Confidence:** MEDIUM

## Verified Safe

- `createApiHandler` provides a solid middleware pattern covering auth, CSRF, rate limiting, and Zod validation.
- The handler correctly sets `Cache-Control: no-store` on all authenticated API responses.
- Recruiting context cache (AsyncLocalStorage) properly wraps the handler for DB query deduplication.
- Capability-based authorization is properly integrated with the handler.
