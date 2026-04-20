# Cycle 23 Critic Review

**Date:** 2026-04-20
**Reviewer:** critic
**Base commit:** 86e7caf7

## Findings

### CRI-1: Control route group is an orphan with no clear entry point in the top navbar [HIGH/HIGH]

**Files:** `src/app/(control)/layout.tsx`, `src/components/layout/public-header.tsx`
**Description:** The `(control)` route group is not accessible from any public-facing navigation element. The `PublicHeader` dropdown includes "Admin" (pointing to `/dashboard/admin`) but there is no link to `/control` anywhere in the top navbar or sidebar. The only way to reach `/control` is by knowing the URL. This defeats the purpose of having a dedicated control panel -- if users cannot discover it, it may as well not exist, or its functionality should be folded into the dashboard where it is discoverable.
**Concrete failure scenario:** An instructor who previously used `/control` for discussion moderation cannot find it from the dashboard. They must type the URL manually.
**Confidence:** High
**Fix:** Either add a "Control" link to the dropdown/sidebar, or merge the control routes into the dashboard where they are discoverable. The latter aligns with the migration plan (Phase 4).

### CRI-2: `publicShell.nav.workspace` key is stale dead code in both locale files [MEDIUM/HIGH]

**File:** `messages/en.json:2622`, `messages/ko.json:2622`
**Description:** The i18n key `publicShell.nav.workspace` with value "Workspace" exists in both locale files but is no longer referenced by any source code. All usages were migrated to `nav.dashboard` in prior cycles, but the old key was never cleaned up.
**Concrete failure scenario:** A developer seeing the key assumes "Workspace" is still an active nav label and may re-introduce it by mistake. Translators waste effort maintaining it.
**Confidence:** High
**Fix:** Remove `publicShell.nav.workspace` from both `en.json` and `ko.json`.

### CRI-3: Control home page links to dashboard routes, making the control panel a redirect hub with no unique value [MEDIUM/MEDIUM]

**File:** `src/app/(control)/control/page.tsx:33-72`
**Description:** The control home page is a card grid where every card links to a `/dashboard/...` route: `/dashboard/groups`, `/dashboard/admin/users`, `/dashboard/admin/languages`, `/dashboard/admin/settings`. The only unique content is the discussion moderation card (for users with `community.moderate`). Everything else is a link to pages that are already accessible from the `AppSidebar` admin section. The control panel adds a redundant navigation layer.
**Concrete failure scenario:** User navigates to `/control`, clicks "User Management", and lands on `/dashboard/admin/users` -- which they could have reached directly from the sidebar. The extra hop adds cognitive load.
**Confidence:** Medium
**Fix:** Merge the control panel's unique functionality (discussion moderation) into the dashboard. The card-link pattern can be incorporated into the dashboard home page or the admin section.
