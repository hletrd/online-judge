# Architect — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## ARCH-1: Incomplete workspace-to-public migration leaves architectural inconsistency [MEDIUM/HIGH]

**Files:** `src/app/(public)/contests/[id]/page.tsx:236`, `src/app/robots.ts:17`, `src/lib/public-route-seo.ts:107`
**Description:** The workspace-to-public migration has been declared as progressing through Phase 4, but the `/workspace` concept still exists in user-facing code. The contest detail page still has `workspaceHref` and `workspaceLabel` props, and infrastructure files (robots.ts, public-route-seo.ts) still reference the old route. This creates an architectural inconsistency: the nav system has fully migrated to "dashboard" terminology, but the contest detail page uses "workspace" terminology.
**Concrete failure scenario:** The migration appears complete from the nav/sidebar perspective but is incomplete from the contest detail page and infrastructure perspective, leading to confused developers who see both terminologies.
**Fix:** Complete the migration by updating all remaining `/workspace` references and renaming the contest detail props from `workspace*` to `dashboard*`.

## ARCH-2: `canModerateDiscussions` uses async capability lookup but admin discussions page also calls it server-side [LOW/LOW]

**Files:** `src/app/(dashboard)/dashboard/admin/discussions/page.tsx:39`, `src/lib/discussions/permissions.ts:3-6`
**Description:** The admin discussions page calls `canModerateDiscussions(session.user.role)` which does an async capability lookup. This is correct but creates an extra DB/Redis call per page load. The capability check could be done directly from the session's capabilities if they were available in the page context.
**Concrete failure scenario:** Minor performance overhead on each admin discussions page load.
**Fix:** Low priority. Could pass capabilities from the layout if available, or accept the extra lookup as a correct trade-off.

---

## Verified Safe

- The `(control)` route group has been fully merged into `(dashboard)`.
- Navigation definitions are properly centralized in `public-nav.ts`.
- `AppSidebar` correctly filters items by capability.
