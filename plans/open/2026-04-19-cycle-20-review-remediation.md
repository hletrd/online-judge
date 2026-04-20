# Cycle 20 Review Remediation Plan

**Date:** 2026-04-19
**Source:** `.context/reviews/_aggregate.md` (cycle 20 multi-agent review), code-reviewer, security-reviewer, perf-reviewer, architect, test-engineer, debugger, critic, verifier, designer
**Status:** IN PROGRESS

---

## HIGH Priority

### H1: Wire `withRecruitingContextCache` into API handler pipeline — ALS cache is dead code

- **From:** AGG-1 (code-reviewer F1, security-reviewer F1, perf-reviewer F1, architect F1, test-engineer F1, debugger F1, critic F1, verifier F1 — 8/9 agents)
- **Files:** `src/lib/api/handler.ts`, `src/lib/recruiting/request-cache.ts`
- **Status:** PENDING
- **Plan:**
  1. Read `src/lib/api/handler.ts` to understand the `createApiHandler` pattern
  2. Import `withRecruitingContextCache` from `@/lib/recruiting/request-cache`
  3. Wrap the handler execution in `createApiHandler` with `withRecruitingContextCache` so the ALS store is initialized for every API request
  4. Verify that `setCachedRecruitingContext` now actually stores data when called from API routes
  5. Verify that `getCachedRecruitingContext` returns cached data on subsequent calls within the same request
  6. Run existing tests to confirm no regressions
  7. Add an integration test that verifies cache deduplication works through the `createApiHandler` pipeline
- **Exit criterion:** `getRecruitingAccessContext` returns cached results when called multiple times within a single API request handler. The ALS cache is active for all routes using `createApiHandler`.

---

## LOW Priority

### L1: Add dev-mode warning in `setCachedRecruitingContext` when store is not active

- **From:** AGG-2 (debugger F2)
- **Files:** `src/lib/recruiting/request-cache.ts`
- **Status:** PENDING
- **Plan:**
  1. In `setCachedRecruitingContext`, after the `if (store)` check, add an `else` branch
  2. In the `else` branch, log a warning if `NODE_ENV !== "production"`: "[request-cache] Cannot cache recruiting context — no active ALS store. Ensure withRecruitingContextCache is called in the request pipeline."
  3. This helps developers detect misconfiguration early
- **Exit criterion:** A warning is logged in development mode when `setCachedRecruitingContext` is called without an active ALS store.

### L2: Parallelize dashboard layout async blocks

- **From:** AGG-3 (perf-reviewer F2, architect F3)
- **Files:** `src/app/(dashboard)/layout.tsx`
- **Status:** PENDING
- **Plan:**
  1. Move `getResolvedSystemSettings` and `isInstructorOrAboveAsync` into the first `Promise.all` block
  2. Keep `getActiveTimedAssignmentsForSidebar` in a second block since it depends on `canBypassTimedAssignmentPanel`
  3. Verify the layout renders correctly with the parallelized data fetching
- **Exit criterion:** Dashboard layout data fetching is parallelized where possible, reducing page load latency by ~50-100ms.

### L3: Consider hiding breadcrumb header on mobile viewports

- **From:** AGG-4 (designer F1)
- **Files:** `src/app/(dashboard)/layout.tsx`
- **Status:** PENDING
- **Plan:**
  1. Add `hidden md:flex` to the breadcrumb header container in the dashboard layout
  2. Verify that breadcrumbs are still visible on desktop and hidden on mobile
  3. Check that mobile navigation still works without breadcrumbs
- **Exit criterion:** Breadcrumb header is hidden on mobile viewports, reducing chrome height by ~44px on small screens.

### L4: Add integration test for ALS cache in API handler pipeline

- **From:** AGG-5 (test-engineer F1, F2)
- **Files:** `tests/unit/recruiting/request-cache.test.ts` or new `tests/integration/` file
- **Status:** PENDING
- **Plan:**
  1. Create a test that simulates an API request handler using `createApiHandler`
  2. Call `getRecruitingAccessContext` twice within the handler
  3. Verify the second call returns the cached result (no redundant DB queries)
  4. This test ensures the ALS cache is properly wired into the request pipeline
- **Exit criterion:** Integration test verifies cache deduplication works through the `createApiHandler` pipeline.

---

## Deferred Items

| Finding | Severity | Reason | Exit Criterion |
|---------|----------|--------|----------------|
| AGG-3(c19) (`updateRecruitingInvitation` uses `Record<string, unknown>`) | LOW | Same as previous cycle — no runtime impact; function is only called from one API route | Next time `recruiting-invitations.ts` is significantly modified |
| AGG-8(c19) (`canAccessProblem` per-item checks not batched) | LOW | The batched `getAccessibleProblemIds` already exists; individual checks work correctly | Re-open if list endpoints report performance issues under load |

---

## Workspace-to-Public Migration Progress

- Phase 1: COMPLETE
- Phase 2: COMPLETE
- Phase 3: IN PROGRESS (this cycle: L3 — consider hiding breadcrumb on mobile; remaining: evaluate control route merge)
- Phase 4: PENDING (deferred — route consolidation)
