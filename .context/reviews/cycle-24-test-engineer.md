# Test Engineer — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## TE-1: No test coverage for contest detail page workspace-to-dashboard link migration [MEDIUM/MEDIUM]

**Files:** `src/app/(public)/contests/[id]/page.tsx:236-237`, `src/app/(public)/_components/public-contest-detail.tsx:58-59,117-118`
**Description:** The contest detail component (`PublicContestDetail`) accepts `workspaceHref` and `workspaceLabel` props and renders a button linking to `workspaceHref`. There is no test verifying that this link points to the correct destination. If the workspace-to-dashboard migration is completed, there should be a test confirming the link targets `/dashboard` (not `/workspace`).
**Concrete failure scenario:** The contest detail link could regress back to `/workspace` without any test catching it.
**Fix:** Add a unit test for `PublicContestDetail` that verifies the workspace/dashboard button's href and label. After the migration, update the test to expect `/dashboard` as the target.

## TE-2: No test verifying robots.txt does not contain stale route entries [LOW/LOW]

**Files:** `src/app/robots.ts`, `tests/unit/robots.test.ts`
**Description:** The robots.txt generation function is tested but there is no assertion ensuring that disallow entries correspond to real routes (not redirect-only stale entries like `/workspace`).
**Concrete failure scenario:** Stale entries accumulate in robots.txt without any test to flag them.
**Fix:** Consider adding a test that cross-references disallow entries against the Next.js route configuration.

---

## Verified Safe

- The existing `robots.test.ts` does verify the `/control` route is disallowed.
- The existing `proxy.test.ts` covers the middleware matcher configuration.
