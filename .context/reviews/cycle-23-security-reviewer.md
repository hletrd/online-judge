# Cycle 23 Security Review

**Date:** 2026-04-20
**Reviewer:** security-reviewer
**Base commit:** 86e7caf7

## Inventory of Reviewed Files

- `src/app/(control)/layout.tsx` (auth + capability gates)
- `src/app/(control)/control/page.tsx` (capability gate)
- `src/app/(control)/control/discussions/page.tsx` (capability gate)
- `src/proxy.ts` (route-level auth, CSP, HSTS)
- `src/lib/discussions/permissions.ts`
- `src/lib/public-route-seo.ts` (robots disallow)
- `src/app/robots.ts` (disallow /control)

## Findings

### SEC-1: Control layout gate allows users who can only view assignments but not admin features [MEDIUM/MEDIUM]

**File:** `src/app/(control)/layout.tsx:20-25`
**Description:** The `canAccessControl` check is an OR of 5 capabilities: `users.view`, `system.settings`, `submissions.view_all`, `groups.view_all`, `assignments.view_status`. A user with only `assignments.view_status` can enter the control panel and sees nav items for User Management, Languages, and System Settings, which they may lack capabilities for. The nav items are not filtered by capability.
**Concrete failure scenario:** A custom role with only `assignments.view_status` enters `/control`, sees "User Management" and "System Settings" links. Clicking them navigates to `/dashboard/admin/users` and `/dashboard/admin/settings` respectively. Whether those pages block the user depends on their own capability checks. If any of those pages are missing their own checks, the user sees restricted admin content.
**Confidence:** Medium
**Fix:** Filter nav items in the control layout by capability, matching the pattern used in `AppSidebar`. This prevents the user from even seeing links they cannot access.

### SEC-2: Control discussions page has defense-in-depth but the control layout gate does not check `community.moderate` [LOW/MEDIUM]

**File:** `src/app/(control)/layout.tsx:26-28` vs `src/app/(control)/control/discussions/page.tsx:39`
**Description:** The control layout checks `canModerate = capabilities.has("community.moderate")` only for the nav item, not for the gate itself. The discussions page has its own `canModerateDiscussions()` check and redirects to `/control` if the user lacks it. However, the gate only checks `canAccessControl` (the 5-capability OR). This means a user with any of those 5 capabilities can reach the discussions page URL and only then gets redirected back to `/control`. This is not a vulnerability (the page has its own check), but it is a defense-in-depth gap.
**Concrete failure scenario:** A user with `users.view` navigates to `/control/discussions` directly, the page checks `canModerateDiscussions()`, it fails, and they get redirected back to `/control`. Unnecessary request overhead but no data exposure.
**Confidence:** Medium
**Fix:** When merging control into dashboard, ensure the discussions route has its own page-level `community.moderate` check, which it already does. No immediate action needed.

## Verified Safe

- `/control` is in `robots.txt` disallow list and `ROBOTS_DISALLOWED_PATHS`.
- Proxy correctly treats `/control` as a protected route and redirects unauthenticated users to `/login`.
- CSP headers are set on all proxied responses including `/control`.
- `NO_INDEX_METADATA` is applied to the control layout.
- HSTS is set for HTTPS requests.
- Auth session cookies are cleared on invalid sessions.
