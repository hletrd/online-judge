# Cycle 23 Tracer Review

**Date:** 2026-04-20
**Reviewer:** tracer
**Base commit:** 86e7caf7

## Findings

### TR-1: User with only `community.moderate` capability cannot reach `/control/discussions` due to layout-level gate [HIGH/MEDIUM]

**Causal trace:**
1. User navigates to `/control/discussions`
2. Proxy (`src/proxy.ts`) treats `/control` as a protected route, checks auth token, passes through
3. `(control)/layout.tsx` renders: `canAccessControl` = `users.view || system.settings || submissions.view_all || groups.view_all || assignments.view_status`
4. User has ONLY `community.moderate` -- all five checks fail
5. Layout redirects to `/dashboard` (line 29)
6. `/control/discussions` page never renders; its `canModerateDiscussions()` check is never reached

**Competing hypotheses:**
- H1: The gate is intentionally restrictive to prevent non-admin users from entering `/control` (by design).
- H2: The gate was written before `community.moderate` was added as a control capability, and the gate was never updated.

**Evidence for H2:** The control discussions page explicitly checks `canModerateDiscussions()` and renders the discussions nav item conditionally based on `canModerate`. The page was designed to be accessible to moderators. The layout gate simply does not account for this capability.

**Concrete failure scenario:** A moderator role with only `community.moderate` cannot access the discussion moderation tool at `/control/discussions`.
**Confidence:** Medium
**Fix:** Add `community.moderate` to the `canAccessControl` OR condition, or merge control routes into dashboard where per-route capability checks already work.

### TR-2: Control home page links all navigate away from `/control`, making the control panel a dead-end hub [MEDIUM/MEDIUM]

**Causal trace:**
1. User enters `/control`
2. Sees card grid with links: `/dashboard/groups`, `/dashboard/admin/users`, `/dashboard/admin/languages`, `/dashboard/admin/settings`, `/control/discussions`
3. Clicks "User Management" -> navigates to `/dashboard/admin/users`
4. User is now in the dashboard layout, which has no link back to `/control`
5. To return to the control panel, user must manually type `/control`

**Concrete failure scenario:** Users get "lost" in the dashboard after clicking a control panel link, with no way back except the URL bar.
**Confidence:** Medium
**Fix:** Merge control into dashboard, eliminating the dead-end navigation pattern entirely.
