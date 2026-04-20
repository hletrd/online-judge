# Cycle 27 Aggregate Review

**Date:** 2026-04-20
**Base commit:** ca3459dd
**Review artifacts:** `cycle-27-code-reviewer.md`, `cycle-27-security-reviewer.md`, `cycle-27-perf-reviewer.md`, `cycle-27-architect.md`, `cycle-27-critic.md`, `cycle-27-debugger.md`, `cycle-27-verifier.md`, `cycle-27-test-engineer.md`, `cycle-27-tracer.md`, `cycle-27-designer.md`

## Deduped Findings (sorted by severity then signal)

### AGG-1: Recruit page uses `new Date()` for expiry/deadline comparisons — clock-skew inconsistency with API [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-1), security-reviewer (SEC-1), architect (ARCH-1), critic (CRI-1), debugger (DBG-1), verifier (V-1), tracer (TR-1), test-engineer (TE-1)
**Files:** `src/app/(auth)/recruit/[token]/page.tsx:33,89,167`
**Description:** The recruit page compares `invitation.expiresAt < new Date()` and `assignment.deadline < new Date()` using the app server's local clock. The API route `src/app/api/v1/recruiting/validate/route.ts` correctly uses `SQL NOW()` for the same comparisons (line 36: `${recruitingInvitations.expiresAt} > NOW()`) to avoid clock skew between the app server and DB server. The API fix was implemented in commit b42a7fe4, but the server-rendered page was not updated.
**Concrete failure scenario:** If the app server clock drifts ahead of the DB server clock, a recruit page could show "expired" while the API still considers the invitation valid (or vice versa). A candidate could see a "valid" invitation on the page but get "expired" when they try to start the exam.
**Fix:** Fetch DB server time (e.g., `SELECT NOW()`) alongside the invitation data and use it for all temporal comparisons on the page instead of `new Date()`.
**Cross-agent signal:** 8 of 10 agents flagged this independently — very high signal.

### AGG-2: Recruit page `toLocaleString()` uses server default locale instead of user locale [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-3), critic (CRI-2), verifier (V-2), tracer (TR-2), designer (DES-1)
**Files:** `src/app/(auth)/recruit/[token]/page.tsx:218`
**Description:** `new Date(assignment.deadline).toLocaleString()` formats the date using the server's default locale, not the user's preferred locale. The app is internationalized with next-intl and supports Korean and English locales.
**Concrete failure scenario:** Korean users see deadline in English locale format (e.g., "4/20/2026, 11:00:00 PM" instead of "2026. 4. 20. 오후 11:00:00").
**Fix:** Use `@/lib/datetime` formatting utilities or next-intl date formatter instead of raw `toLocaleString()`.

### AGG-3: SSE events route uses `user!` non-null assertion across closure boundary [LOW/LOW]

**Flagged by:** code-reviewer (CR-2), debugger (DBG-2)
**Files:** `src/app/api/v1/submissions/[id]/events/route.ts:319`
**Description:** `const viewerId = user!.id;` uses a non-null assertion because TypeScript cannot infer `user` is non-null across a closure boundary. While the comment explains the reasoning, a safer pattern would be to capture `user.id` in a local variable before entering the closure.
**Concrete failure scenario:** If the SSE handler is refactored such that `user` could be null, the non-null assertion silently passes the null check and throws at runtime instead of producing a compile-time error.
**Fix:** Capture `const viewerId = user?.id;` before the closure.

### AGG-4: Inconsistent use of `createApiHandler` across 22 route handlers [LOW/MEDIUM]

**Flagged by:** architect (ARCH-2)
**Files:** 22 raw route handlers in `src/app/api/`
**Description:** 22 route handlers manually implement auth/CSRF/rate-limit logic instead of using `createApiHandler`. While some have legitimate reasons (SSE streaming, judge token auth, multipart form data), others (backup, restore, migrate/import, files POST) duplicate the middleware pattern. This creates maintenance risk: if the auth pattern changes, 22 files must be updated instead of 1.
**Concrete failure scenario:** A future security fix applied to `createApiHandler` is missed in one of the 22 manual routes.
**Fix:** Migrate routes that can use `createApiHandler`. For those that cannot, document the reason.

### AGG-5: SSE connection tracking eviction uses O(n) linear scan [LOW/LOW]

**Flagged by:** perf-reviewer (PERF-1), security-reviewer (SEC-2)
**Files:** `src/app/api/v1/submissions/[id]/events/route.ts:44-55`
**Description:** When `connectionInfoMap.size >= MAX_TRACKED_CONNECTIONS` (1000), the eviction loop iterates all entries to find the oldest. This is O(n) but bounded by the cap of 1000 entries and the periodic cleanup timer.
**Concrete failure scenario:** Under extreme connection churn, each new connection that triggers eviction requires scanning up to 1000 entries. Acceptable performance for the cap size.
**Fix:** No immediate action required — the current design is adequate for the scale.

### AGG-6: Recruit page makes 3 DB queries in 2 sequential rounds instead of 1 [LOW/LOW]

**Flagged by:** perf-reviewer (PERF-2)
**Files:** `src/app/(auth)/recruit/[token]/page.tsx:112-185`
**Description:** After the cached invitation lookup, the page makes: (1) assignment query (line 112), then (2) problem count + languages in parallel (line 178). Query 1 could be parallelized with queries 2 and 3.
**Concrete failure scenario:** Minor latency increase on recruit page loads.
**Fix:** Low priority — restructure to run all 3 queries in a single `Promise.all`.

### AGG-7: No test coverage for recruit page clock-skew behavior or SSE connection cleanup [LOW/MEDIUM]

**Flagged by:** test-engineer (TE-1, TE-2)
**Files:** `tests/unit/recruit-page-metadata.test.ts`, `src/app/api/v1/submissions/[id]/events/route.ts`
**Description:** No test verifies that the recruit page uses DB-sourced time for temporal comparisons. No test verifies SSE connection cleanup behavior.
**Fix:** Add targeted tests for the temporal comparison logic and SSE connection tracking.

## Verified Safe / No Regression Found

- Auth flow is robust with Argon2id, timing-safe dummy hash, rate limiting, and proper token invalidation.
- No `dangerouslySetInnerHTML` without sanitization.
- No `console.log` in production code (only one instance in a code template string — safe).
- No `as any` type casts.
- No `@ts-ignore` or `@ts-expect-error`.
- Only 2 eslint-disable directives, both with justification comments.
- No silently swallowed catch blocks.
- Environment variables are properly validated in production.
- CSRF protection is in place for server actions.
- Rate limiting has two-tier strategy (sidecar + PostgreSQL with SELECT FOR UPDATE) preventing TOCTOU races.
- Recruiting token flow uses atomic SQL transactions for claim validation.
- Korean letter-spacing remediation is comprehensive — all headings and labels are properly locale-conditional.
- Previous cycle-26 fixes are all confirmed working (recruit test, ESLint config, React.cache, tracking comments).

## Agent Failures

None. All review perspectives completed successfully.
