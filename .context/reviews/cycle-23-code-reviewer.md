# Cycle 23 Code Review

**Date:** 2026-04-20
**Reviewer:** code-reviewer
**Base commit:** 86e7caf7

## Inventory of Reviewed Files

- `src/app/(control)/layout.tsx`
- `src/app/(control)/control/page.tsx`
- `src/app/(control)/control/discussions/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/app/(public)/layout.tsx`
- `src/components/layout/control-nav.tsx`
- `src/components/layout/public-header.tsx`
- `src/components/layout/app-sidebar.tsx`
- `src/lib/navigation/public-nav.ts`
- `src/lib/discussions/permissions.ts`
- `src/lib/public-route-seo.ts`
- `src/proxy.ts`
- `messages/en.json`
- `messages/ko.json`

## Findings

### CR-1: Control layout checks different capabilities than it renders nav items for [HIGH/MEDIUM]

**File:** `src/app/(control)/layout.tsx:20-26`
**Description:** The layout's gate check uses `users.view || system.settings || submissions.view_all || groups.view_all || assignments.view_status` to decide whether the user can access `/control` at all. However, the nav items rendered include links to `/dashboard/groups`, `/dashboard/admin/users`, `/dashboard/admin/languages`, `/dashboard/admin/settings` -- none of which are guaranteed by the gate check alone. For example, a user with only `assignments.view_status` passes the gate but sees links to "User Management" and "System Settings" which they may not have access to.
**Concrete failure scenario:** A custom role with only `assignments.view_status` enters `/control`, sees nav items for Users, Languages, and Settings, clicks them, and gets either a 403 or a confusing redirect. The nav items should be filtered by capability, just like `AppSidebar` does.
**Confidence:** Medium (depends on whether all instructor+ roles always have all listed capabilities)
**Fix:** Filter nav items in the ControlLayout using capability checks, similar to how `AppSidebar.filterItems()` works, or add capability checks per nav item.

### CR-2: Stale `publicShell.nav.workspace` i18n key is dead code [MEDIUM/HIGH]

**File:** `messages/en.json:2622`, `messages/ko.json` (same line)
**Description:** The key `publicShell.nav.workspace` still exists in both locale files, but no source code references `nav.workspace` (confirmed by grep). It was replaced by `nav.dashboard` in prior cycles but the key was never removed.
**Concrete failure scenario:** The stale key adds confusion for translators and developers. If someone mistakenly uses `t("nav.workspace")` they get an outdated label.
**Confidence:** High
**Fix:** Remove `publicShell.nav.workspace` from both `en.json` and `ko.json`.

### CR-3: Control layout duplicates nav item labels from the `nav` namespace but uses `controlShell` for descriptions [MEDIUM/MEDIUM]

**File:** `src/app/(control)/layout.tsx:48-57`
**Description:** The control layout's nav items mix two i18n namespaces: `tNav("groups")` and `tNav("userManagement")` from the `nav` namespace for labels, but `tShell("nav.groupsDescription")` from `controlShell` for descriptions. This creates a fragmented translation surface where the same concept (e.g., "groups") has its label in one namespace and description in another.
**Concrete failure scenario:** When migrating control routes into the dashboard, these split-namespace references must be consolidated. Keeping them separate increases migration risk.
**Confidence:** Medium
**Fix:** When merging control into dashboard, consolidate the `controlShell.nav.*Description` keys into either the `nav` or `publicShell` namespace.

### CR-4: `PublicHeader.getDropdownItems` uses hardcoded string labels instead of i18n keys [MEDIUM/MEDIUM]

**File:** `src/components/layout/public-header.tsx:76-93`
**Description:** The dropdown items use string labels like `"dashboard"`, `"problems"`, `"groups"`, `"mySubmissions"`, `"contests"`, `"profile"`, `"admin"`. These are then looked up at render time via `tShell(\`nav.${item.label}\`)`. While this works, the strings are not type-checked against the i18n namespace. Adding or renaming a key in `publicShell.nav` without updating the corresponding hardcoded string here would silently produce a raw key leak.
**Concrete failure scenario:** If `publicShell.nav.mySubmissions` is renamed to `publicShell.nav.submissions`, the dropdown would render the raw key `nav.mySubmissions` to users.
**Confidence:** Medium
**Fix:** Either type the label strings against the `publicShell.nav` key set, or move the dropdown item definitions into the shared `public-nav.ts` module alongside the existing nav builders.

## Verified Safe

- `PaginationControls` is now a synchronous client component (cycle 22 fix confirmed).
- `PublicLayout` correctly uses shared `getPublicNavItems` / `getPublicNavActions` helpers.
- `DashboardLayout` correctly renders `PublicHeader` with capability-based dropdown filtering.
- All three route groups `(public)`, `(dashboard)`, `(control)` have proper `NO_INDEX_METADATA` for non-public pages.
