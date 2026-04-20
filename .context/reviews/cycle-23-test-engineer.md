# Cycle 23 Test Engineer Review

**Date:** 2026-04-20
**Reviewer:** test-engineer
**Base commit:** 86e7caf7

## Inventory of Reviewed Test Files

- `tests/component/control-nav.test.tsx`
- `tests/component/discussion-moderation-list.test.tsx`
- `tests/component/public-header.test.tsx`
- `tests/component/app-sidebar.test.tsx`
- `tests/e2e/public-shell.spec.ts`
- `tests/component/pagination-controls.test.tsx`

## Findings

### TE-1: No test coverage for control layout capability gating [MEDIUM/MEDIUM]

**File:** `src/app/(control)/layout.tsx:20-28`
**Description:** The control layout has a 5-capability OR gate that determines whether a user can access `/control`. There are no tests verifying that:
1. A user with only `assignments.view_status` can access `/control`.
2. A user with none of the 5 capabilities gets redirected to `/dashboard`.
3. The `canModerate` flag correctly shows/hides the discussions nav item.
**Concrete failure scenario:** A regression in the capability gate logic (e.g., removing one of the OR conditions) goes undetected.
**Confidence:** Medium
**Fix:** Add unit tests for the control layout's capability gate logic. When the control group is merged into dashboard, these tests should cover the merged route instead.

### TE-2: No E2E coverage for `/control` routes [MEDIUM/MEDIUM]

**File:** `tests/e2e/` directory
**Description:** There are no E2E spec files for `/control` or `/control/discussions`. The `public-shell.spec.ts` covers public routes, and various admin specs cover `/dashboard/admin/*`, but the control panel has no dedicated smoke test.
**Concrete failure scenario:** A regression in the control layout (e.g., broken redirect, missing capability check) is not caught by CI.
**Confidence:** Medium
**Fix:** Add at least a smoke E2E test for `/control` that verifies the control panel renders for an admin user and redirects an unauthorized user. When the route is merged into dashboard, update the test accordingly.

### TE-3: `control-nav.test.tsx` exists but tests an orphan component [LOW/MEDIUM]

**File:** `tests/component/control-nav.test.tsx`
**Description:** The `ControlNav` component test exists and likely passes, but the component will be removed when the control route group is merged into dashboard. The test should be tracked for removal or migration.
**Concrete failure scenario:** After the merge, the test file becomes dead code that references a deleted component, causing import errors.
**Confidence:** Medium
**Fix:** When removing `ControlNav`, also remove or migrate `tests/component/control-nav.test.tsx`.

## Verified Safe

- `pagination-controls.test.tsx` was updated in cycle 22 to test the synchronous client component contract.
- `public-header.test.tsx` covers the dropdown rendering for authenticated users.
- `app-sidebar.test.tsx` covers capability-based filtering of sidebar items.
