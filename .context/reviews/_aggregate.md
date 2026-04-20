# Cycle 20 Aggregate Review

**Date:** 2026-04-19
**Aggregated from:** code-reviewer, security-reviewer, perf-reviewer, architect, test-engineer, debugger, critic, verifier, designer
**Base commit:** 95f06e5b

---

## Deduped Findings

### AGG-1 — [HIGH] ALS recruiting cache is dead code — `withRecruitingContextCache` never called, N+1 DB queries persist in API routes

- **Severity:** HIGH (performance + architecture — the most critical fix from cycle 19 is non-functional)
- **Confidence:** HIGH
- **Cross-agent agreement:** code-reviewer F1, security-reviewer F1, perf-reviewer F1, architect F1, test-engineer F1, debugger F1, critic F1, verifier F1 (8/9 agents)
- **Files:** `src/lib/recruiting/request-cache.ts:67`, `src/lib/recruiting/access.ts:38,50,88`, `src/lib/api/handler.ts` (missing initialization)
- **Evidence:** The `withRecruitingContextCache` function is defined but never called from any production code. Grep confirms zero callers outside the test file. Without calling `withRecruitingContextCache.run()`, `AsyncLocalStorage.getStore()` always returns `undefined`, making `getCachedRecruitingContext` always return `undefined` and `setCachedRecruitingContext` silently no-op. The ALS cache added in cycle 19 (commit a5628451) to fix AGG-1 from cycle 19 is completely non-functional in production. The test suite passes because tests manually initialize the ALS context, giving a false sense of correctness.
- **Failure scenario:** An API route handler calls `canAccessProblem` for each item in a list of 20 problems. Each call triggers `loadRecruitingAccessContext`, which calls `getCachedRecruitingContext` (always returns undefined), queries the DB twice for recruiting context, then calls `setCachedRecruitingContext` (silently no-ops). This results in 40+ redundant DB queries — the exact problem the ALS cache was supposed to solve.
- **Suggested fix:** Wire `withRecruitingContextCache` into the API handler pipeline. The cleanest approach is to wrap the handler execution in `createApiHandler` (in `src/lib/api/handler.ts`) with the ALS context. This ensures the cache is always available for API routes without requiring changes to individual route handlers. Additionally, add a dev-mode warning log in `setCachedRecruitingContext` when the store is not active (debugger F2).

### AGG-2 — [LOW] `setCachedRecruitingContext` silently no-ops when store is not active — should warn in dev mode

- **Severity:** LOW (developer experience — masks critical integration bugs)
- **Confidence:** HIGH
- **Cross-agent agreement:** debugger F2
- **Files:** `src/lib/recruiting/request-cache.ts:51-55`
- **Evidence:** When `recruitingContextStore.getStore()` returns `undefined`, the function silently returns without setting anything. This is documented as "graceful degradation" but it masks the critical bug where the store is never initialized.
- **Suggested fix:** Add a `logger.warn` call when `store` is undefined and `NODE_ENV !== "production"`, similar to `isTrustedServerActionOrigin` in server-actions.ts.

### AGG-3 — [LOW] Dashboard layout has two sequential `Promise.all` blocks — some calls can be parallelized

- **Severity:** LOW (performance — ~50-100ms unnecessary latency on dashboard page loads)
- **Confidence:** MEDIUM
- **Cross-agent agreement:** perf-reviewer F2, architect F3
- **Files:** `src/app/(dashboard)/layout.tsx:34-48,55-64`
- **Evidence:** The first `Promise.all` block resolves `getRecruitingAccessContext`, translations, and capabilities. The second block resolves system settings and lecture mode check. `getResolvedSystemSettings` and `isInstructorOrAboveAsync` do not depend on the first block's results but are not included in it.
- **Suggested fix:** Move `getResolvedSystemSettings` and `isInstructorOrAboveAsync` into the first `Promise.all` block since they don't depend on its results. Keep `getActiveTimedAssignmentsForSidebar` in the second block since it depends on `canBypassTimedAssignmentPanel`.

### AGG-4 — [LOW] Breadcrumb sticky header adds ~44px of chrome on mobile — consider hiding on small viewports

- **Severity:** LOW (UX — 33% of viewport height consumed by chrome on small phones)
- **Confidence:** MEDIUM
- **Cross-agent agreement:** designer F1
- **Files:** `src/app/(dashboard)/layout.tsx:99-101`
- **Evidence:** On a 375px mobile viewport, the PublicHeader (~56px) + breadcrumb header (~44px) + content padding (24px) = ~124px before any content. Mobile users navigate via hamburger menu and back button, not breadcrumbs.
- **Suggested fix:** Consider adding `hidden md:block` to the breadcrumb header container on mobile, since breadcrumbs are not useful on mobile navigation patterns.

### AGG-5 — [LOW] ALS cache tests give false confidence — no integration test verifying cache is wired into request pipeline

- **Severity:** LOW (test coverage — critical integration gap)
- **Confidence:** HIGH
- **Cross-agent agreement:** test-engineer F1, F2
- **Files:** `tests/unit/recruiting/request-cache.test.ts`, `src/lib/api/handler.ts`
- **Evidence:** The unit tests pass because they manually call `withRecruitingContextCache` to set up the ALS context. No integration test verifies that the cache is actually wired into the API handler pipeline. This allowed a critical integration bug (AGG-1) to go undetected.
- **Suggested fix:** Add an integration test that verifies `getRecruitingAccessContext` returns the same context when called twice within a simulated API request handler pipeline (using `createApiHandler`).

---

## Carry-Forward Items (Unchanged from Cycle 19)

| ID | Finding | Severity | Status |
|----|---------|----------|--------|
| AGG-2(c19) | Admin import/restore `needsRehash` | LOW | **FIXED** in cycle 19 (commit bdee3c23) |
| AGG-3(c19) | `updateRecruitingInvitation` uses `Record<string, unknown>` | LOW | Deferred — no runtime impact |
| AGG-4(c19) | Server action origin bypass warning | LOW | **FIXED** in cycle 19 (commit 267fbafd) |
| AGG-6(c19) | Breadcrumb in main content instead of top navbar | LOW | **FIXED** in cycle 19 (commit a06bd712) |
| AGG-7(c19) | Mobile menu focus not restored on route change | LOW | **FIXED** in cycle 19 (commit 74560445) |
| AGG-8(c19) | `canAccessProblem` not batched for API list endpoints | LOW | Deferred — `getAccessibleProblemIds` exists as alternative |
| AGG-9(c19) | `eslint-disable` for `no-explicit-any` in users route | LOW | **FIXED** in cycle 19 (commit 401dd117) |

## Previously Deferred Items (Carried Forward)

| ID | Finding | Severity | Status |
|----|---------|----------|--------|
| A7 | Dual encryption key management | MEDIUM | Deferred — consolidation requires migration |
| A12 | Inconsistent auth/authorization patterns | MEDIUM | Deferred — existing routes work correctly |
| A2 | Rate limit eviction could delete SSE slots | MEDIUM | Deferred — unlikely with heartbeat refresh |
| A17 | JWT contains excessive UI preference data | LOW | Deferred — requires session restructure |
| A25 | Timing-unsafe bcrypt fallback | LOW | Deferred — bcrypt-to-argon2 migration in progress |
| A26 | Polling-based backpressure wait | LOW | Deferred — no production reports |
| L2(c13) | Anti-cheat LRU cache single-instance limitation | LOW | Deferred — already guarded by getUnsupportedRealtimeGuard |
| L5(c13) | Bulk create elevated roles warning | LOW | Deferred — server validates role assignments |
| D16 | `sanitizeSubmissionForViewer` unexpected DB query | LOW | Deferred — only called from one place, no N+1 risk |
| D17 | Exam session `new Date()` clock skew | LOW | Deferred — same as A19 |
| D18 | Contest replay top-10 limit | LOW | Deferred — likely intentional, requires design input |
| L6(c16) | `sanitizeSubmissionForViewer` N+1 risk for list endpoints | LOW | Deferred — re-open if added to list endpoints |
| AGG-7(c18-prev) | IOI tie sort non-deterministic within tied entries | LOW | Deferred — tied entries get same rank per IOI convention |
| AGG-8(c18-prev) | ROUND(score,2)=100 may miss edge-case ACs | LOW | Deferred — PostgreSQL ROUND is exact for decimal values |
| AGG-4(c18) | Admin route DRY violation | LOW | Deferred — all routes work correctly |
| AGG-5(c18) | updateRecruitingInvitation uses JS new Date() | LOW | Deferred — only affects distributed deployments |
| AGG-7(c18) | contest-analytics progression raw scores | LOW | Deferred — already documented in code comments |
| AGG-4(c18b) | Admin route DRY violation (same as AGG-4(c18)) | LOW | Deferred — next time admin routes are modified |
| AGG-3(c19) | updateRecruitingInvitation Record<string, unknown> | LOW | Deferred — no runtime impact |
| AGG-8(c19) | canAccessProblem not batched for list endpoints | LOW | Deferred — getAccessibleProblemIds exists as alternative |

## Agent Failures

None — all review angles completed successfully.
