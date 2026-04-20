# Cycle 23 Debugger Review

**Date:** 2026-04-20
**Reviewer:** debugger
**Base commit:** 86e7caf7

## Findings

### DBG-1: Control layout capability gate mismatch could cause confusing redirect loops [MEDIUM/MEDIUM]

**File:** `src/app/(control)/layout.tsx:28-29`
**Description:** If `canAccessControl` is false, the layout redirects to `/dashboard`. But the control discussions page (line 41) also redirects to `/control` if `canModerateDiscussions` is false. This means: if a user has `community.moderate` but NOT any of the 5 `canAccessControl` capabilities, they cannot enter `/control` at all, even though they should be able to reach `/control/discussions`. This is because the layout gate runs before the page-level check.
**Concrete failure scenario:** A custom role with ONLY `community.moderate` capability tries to access `/control/discussions`. The layout redirects them to `/dashboard` before the page ever renders. The user can never reach the discussion moderation tool.
**Confidence:** Medium
**Fix:** Add `community.moderate` to the `canAccessControl` OR condition in the control layout, or restructure the gate to check per-route capabilities. Better yet, merge the control routes into dashboard where capability filtering is already granular.

### DBG-2: Stale workspace i18n key will cause confusion during future migration [LOW/HIGH]

**File:** `messages/en.json:2622`
**Description:** The `publicShell.nav.workspace` key is dead code. If a developer encounters it and assumes it is active, they may build new features against it, only to discover it is never rendered. This is not a runtime bug but a latent maintenance hazard.
**Confidence:** High
**Fix:** Remove the key.

## Verified Safe

- `PaginationControls` fix from cycle 22 is working correctly (sync client component).
- No async server imports in client components found in this cycle's review scope.
