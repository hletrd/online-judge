# Cycle 23 Aggregate Review

**Date:** 2026-04-20
**Base commit:** 86e7caf7
**Review artifacts:** `cycle-23-code-reviewer.md`, `cycle-23-security-reviewer.md`, `cycle-23-architect.md`, `cycle-23-critic.md`, `cycle-23-verifier.md`, `cycle-23-test-engineer.md`, `cycle-23-perf-reviewer.md`, `cycle-23-debugger.md`, `cycle-23-designer.md`, `cycle-23-tracer.md`, `cycle-23-document-specialist.md`

## Deduped Findings (sorted by severity then signal)

### AGG-1: Control route group should be merged into dashboard -- it is a redundant navigation shell with no discoverable entry point and a capability gate bug [HIGH/HIGH]

**Flagged by:** architect (ARCH-1), critic (CRI-1, CRI-3), designer (DES-1), tracer (TR-1, TR-2), code-reviewer (CR-1), security-reviewer (SEC-1), debugger (DBG-1)  
**Files:** `src/app/(control)/layout.tsx`, `src/app/(control)/control/page.tsx`, `src/app/(control)/control/discussions/page.tsx`, `src/components/layout/control-nav.tsx`, `src/lib/navigation/public-nav.ts`, `messages/en.json:2968-3018`, `messages/ko.json:2968-3018`  
**Description:** The `(control)` route group is a standalone shell with its own layout, sidebar (`ControlNav`), and i18n namespace (`controlShell`). It has multiple problems:
1. **No discoverability:** There is no link to `/control` from any navigation element (PublicHeader, AppSidebar).
2. **Capability gate bug:** The layout gate checks `users.view || system.settings || submissions.view_all || groups.view_all || assignments.view_status` but does NOT check `community.moderate`. A user with only `community.moderate` is redirected to `/dashboard` before the discussions page can render, making the moderation tool inaccessible to that role.
3. **Redundant navigation:** The control home page is a card grid linking to `/dashboard/groups`, `/dashboard/admin/users`, etc. -- all pages already accessible from the `AppSidebar`. The only unique page is `/control/discussions`.
4. **Layout inconsistency:** The control panel uses a different visual paradigm (grid sidebar, no top navbar, no breadcrumb) than the dashboard, creating a disjointed user experience.
5. **Dead-end navigation:** Once a user clicks a link from the control panel to a dashboard route, there is no way back to `/control` except the URL bar.
**Concrete failure scenario:** A moderator with only `community.moderate` capability cannot access the discussion moderation tool. All other users who find `/control` see links to pages already in the dashboard sidebar.  
**Fix:** Merge `(control)` into `(dashboard)`:
1. Move discussion moderation to `/dashboard/admin/discussions` with a `community.moderate` capability check.
2. Migrate `controlShell` i18n keys into `publicShell` and `nav` namespaces.
3. Remove `ControlNav` component and `(control)` route group directory.
4. Add `/control` and `/control/discussions` redirects in middleware.
5. Add the discussion moderation link to `AppSidebar` (filtered by `community.moderate` capability).
6. Remove `controlShell` namespace from both locale files.

### AGG-2: Stale `publicShell.nav.workspace` i18n key is dead code in both locale files [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-2), critic (CRI-2), verifier (V-2), debugger (DBG-2)  
**Files:** `messages/en.json:2622`, `messages/ko.json:2622`  
**Description:** The key `publicShell.nav.workspace` ("Workspace") exists in both locale files but is never referenced by any source code. It was replaced by `nav.dashboard` in prior cycles but never cleaned up.  
**Concrete failure scenario:** Developers or translators see the key and assume "Workspace" is still an active nav label.  
**Fix:** Remove `publicShell.nav.workspace` from both `en.json` and `ko.json`.

### AGG-3: Control layout nav items are not filtered by user capabilities [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-1), security-reviewer (SEC-1), verifier (V-1)  
**Files:** `src/app/(control)/layout.tsx:48-57`  
**Description:** The control layout renders all nav items unconditionally: Home, Groups, User Management, Languages, System Settings. Only the Discussions item is conditionally rendered based on `canModerate`. A user with `assignments.view_status` (which passes the gate) sees links to User Management and System Settings, which they may not be authorized for.  
**Concrete failure scenario:** A limited-role user sees admin nav items they cannot access, leading to confusing 403 errors or redirects.  
**Fix:** When merging control into dashboard, this is resolved automatically since `AppSidebar` already filters by capability. If a standalone fix is needed before the merge, add per-item capability checks.

### AGG-4: Migration plan needs updating -- Phase 4 is now active, not deferred [MEDIUM/HIGH]

**Flagged by:** document-specialist (DOC-1, DOC-2)  
**Files:** `plans/open/2026-04-19-workspace-to-public-migration.md:228`  
**Description:** The migration plan labels Phase 4 as "Higher risk, defer" but the user-injected TODO explicitly requests Phase 4 work this cycle. The plan also lacks a `controlShell` key migration mapping table.  
**Concrete failure scenario:** Developers reading the plan think Phase 4 is deferred and do not work on it.  
**Fix:** Update the plan to mark Phase 4 as IN PROGRESS and document the i18n key migration mapping.

### AGG-5: `PublicHeader.getDropdownItems` uses hardcoded label strings not type-checked against i18n [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-4), architect (ARCH-3)  
**Files:** `src/components/layout/public-header.tsx:76-93`, `src/lib/navigation/public-nav.ts`  
**Description:** The dropdown items use hardcoded strings ("dashboard", "problems", "groups", etc.) that are dynamically resolved to i18n keys via `tShell(\`nav.${item.label}\`)`. These strings are not type-checked against the `publicShell.nav` key set. Additionally, the dropdown definitions are inside `PublicHeader` rather than the shared `public-nav.ts` module, causing potential drift between the header dropdown and `AppSidebar` nav items.  
**Concrete failure scenario:** A key renamed in `publicShell.nav` without updating the hardcoded string causes a raw key leak in the dropdown.  
**Fix:** Move dropdown definitions into `public-nav.ts` and consider typing the label strings against the i18n key set.

### AGG-6: `ControlNav` section label uses fixed `tracking-[0.18em]` that violates Korean letter-spacing rule [LOW/MEDIUM]

**Flagged by:** designer (DES-2)  
**Files:** `src/components/layout/control-nav.tsx:31`  
**Description:** The section label in `ControlNav` applies `tracking-[0.18em]` unconditionally. Per CLAUDE.md, Korean text must use browser/font default letter-spacing.  
**Concrete failure scenario:** Korean users see the section label with incorrect letter-spacing.  
**Fix:** Make letter-spacing conditional on locale, or remove the component entirely when merging control into dashboard.

## Verified Safe / No Regression Found

- `PaginationControls` is now a synchronous client component (cycle 22 fix confirmed).
- Home and 404 pages no longer leak `nav.workspace` (cycle 22 fix confirmed).
- Dashboard layout correctly uses `PublicHeader` with shared nav helpers and capability-based dropdown.
- `tsc --noEmit` passes with zero errors.
- `npm run lint` passes with 0 errors (17 warnings only).
- All public routes (`/practice`, `/playground`, `/contests`, `/community`, `/submissions`, `/languages`) load successfully.
- SEO route matrix correctly disallows `/control` from indexing.

## Agent Failures

None. All requested review perspectives completed successfully.
