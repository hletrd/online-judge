# Cycle 27 Code Reviewer

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### CR-1: Recruit page uses `new Date()` for deadline comparison — clock skew risk [MEDIUM/HIGH]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:33,89,167`
**Description:** The recruit page compares `invitation.expiresAt < new Date()` and `assignment.deadline < new Date()` using the app server's local clock. The API route `src/app/api/v1/recruiting/validate/route.ts` correctly uses `SQL NOW()` for the same comparison (line 36: `${recruitingInvitations.expiresAt} > NOW()`) to avoid clock skew between the app server and DB server. The server-rendered page does not follow this pattern.
**Failure scenario:** If the app server clock drifts ahead of the DB server clock, a recruit page could show "expired" while the API still considers the invitation valid (or vice versa). The inconsistency was documented in commit b42a7fe4 for the API route but the server page was not updated.
**Fix:** Use a server-provided timestamp or SQL-level comparison for the page's expiry/deadline checks. At minimum, fetch `SELECT NOW()` alongside the invitation data, or pass a `now` parameter from the server render.
**Confidence:** HIGH

### CR-2: SSE events route has non-null assertion on `user` across closure boundary [LOW/MEDIUM]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:319`
**Description:** `const viewerId = user!.id;` uses a non-null assertion because TypeScript cannot infer that `user` is non-null across the closure boundary of `sendTerminalResult()`. While the comment explains the reasoning, a safer pattern would be to capture `user.id` in a local variable before the closure.
**Failure scenario:** If the closure is somehow invoked after `user` becomes null (unlikely in current flow), this would throw at runtime instead of getting a controlled failure.
**Fix:** Capture `const viewerId = user?.id;` at the top of the stream start handler and use that in closures.
**Confidence:** MEDIUM

### CR-3: Recruit page `toLocaleString()` is locale-unaware for deadline display [LOW/MEDIUM]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:218`
**Description:** `new Date(assignment.deadline).toLocaleString()` uses the server's default locale for date formatting in a server component. Since this is a Korean-locale-aware app (next-intl), the deadline display should use the user's locale.
**Failure scenario:** Users see the deadline in the wrong locale format (e.g., "4/20/2026, 11:00:00 PM" instead of "2026. 4. 20. 오후 11:00:00").
**Fix:** Use `formatDateTime` from `@/lib/datetime` or the next-intl formatter instead of raw `toLocaleString()`.
**Confidence:** MEDIUM

## Verified Safe

- All 83 API routes using `createApiHandler` have proper auth, CSRF, and rate limiting middleware.
- The 22 raw route handlers all implement their own auth checks (judge IP/token auth, cron secret, user session).
- No `as any` type casts found in the codebase.
- No `@ts-ignore` or `@ts-expect-error` found.
- Only 2 `eslint-disable` directives, both with justification comments.
- `dangerouslySetInnerHTML` is used in only 2 places, both properly sanitized (`safeJsonForScript` and `sanitizeHtml` with DOMPurify).
- Error boundaries use `console.error` only for unhandled errors (appropriate).
- Only `console.log` usage is in a code template string (safe).
- `_total` destructuring ESLint warning was properly fixed in cycle 26.
- `React.cache()` deduplication is properly implemented for recruit page invitation lookup.
- Korean letter-spacing is properly locale-conditional across all components with tracking classes.
