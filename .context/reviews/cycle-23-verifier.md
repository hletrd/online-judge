# Cycle 23 Verifier Review

**Date:** 2026-04-20
**Reviewer:** verifier
**Base commit:** 86e7caf7

## Findings

### V-1: Control layout gate is broader than the nav items it renders [MEDIUM/MEDIUM]

**File:** `src/app/(control)/layout.tsx:20-28`
**Description:** The layout gate `canAccessControl` checks for 5 capabilities (`users.view`, `system.settings`, `submissions.view_all`, `groups.view_all`, `assignments.view_status`). However, the nav items rendered include "Groups" (needs `groups.view_all` or similar), "User Management" (needs `users.view` or higher), "Languages" (needs `system.settings`), and "System Settings" (needs `system.settings`). The `assignments.view_status` capability passes the gate but none of the nav items are gated by it -- the user sees all 5 nav items regardless. The nav items should be conditionally rendered based on the user's capabilities.
**Concrete failure scenario:** A user with only `assignments.view_status` passes the control gate and sees 5 nav items, 4 of which link to pages they may not be authorized for.
**Confidence:** Medium
**Fix:** Add per-item capability checks to the nav items in the control layout, consistent with `AppSidebar`'s pattern.

### V-2: Stale `workspace` i18n key in publicShell [MEDIUM/HIGH]

**File:** `messages/en.json:2622`
**Description:** Verified that the key `publicShell.nav.workspace` ("Workspace") is defined but never referenced in any `.tsx` or `.ts` file. The only active workspace-related reference was eliminated in cycle 22 (commit 97c4544b). This is dead data.
**Concrete failure scenario:** No runtime impact, but it is dead code that should be cleaned up to prevent confusion.
**Confidence:** High
**Fix:** Remove from both locale files.

## Verified Safe

- `PaginationControls` is now synchronous and uses `useTranslations` (cycle 22 fix confirmed in `src/components/pagination-controls.tsx`).
- Home page (`src/app/page.tsx`) no longer uses `nav.workspace` label (cycle 22 fix confirmed).
- 404 page (`src/app/not-found.tsx`) no longer uses `nav.workspace` label.
- Dashboard layout uses `publicShell` namespace for nav labels, not `controlShell` or `workspaceShell`.
- `tsc --noEmit` passes with zero errors.
- `npm run lint` passes with 0 errors (17 warnings only).
