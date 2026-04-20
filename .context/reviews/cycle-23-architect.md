# Cycle 23 Architect Review

**Date:** 2026-04-20
**Reviewer:** architect
**Base commit:** 86e7caf7

## Inventory of Reviewed Files

- `src/app/(control)/layout.tsx` (control route group layout)
- `src/app/(control)/control/page.tsx` (control home)
- `src/app/(control)/control/discussions/page.tsx` (control discussions)
- `src/app/(dashboard)/layout.tsx` (dashboard layout)
- `src/app/(public)/layout.tsx` (public layout)
- `src/components/layout/control-nav.tsx` (control sidebar)
- `src/components/layout/public-header.tsx` (shared top nav)
- `src/lib/navigation/public-nav.ts` (nav config)
- `src/lib/public-route-seo.ts` (SEO route matrix)
- `src/proxy.ts` (middleware auth routing)
- `messages/en.json`, `messages/ko.json` (i18n namespaces)

## Findings

### ARCH-1: Control route group is a redundant shell that should merge into dashboard [HIGH/HIGH]

**Files:** `src/app/(control)/layout.tsx`, `src/components/layout/control-nav.tsx`
**Description:** The `(control)` route group duplicates the dashboard's pattern (auth gate, sidebar, header) but with a separate `ControlNav` component and `controlShell` i18n namespace. The control home page is just a card grid linking to dashboard routes (`/dashboard/groups`, `/dashboard/admin/users`, etc.). The only unique page is `/control/discussions`. This creates three problems:
1. **Navigation fragmentation:** Users must know to go to `/control` instead of `/dashboard/admin` for the same functionality.
2. **Code duplication:** `ControlNav` is a bespoke sidebar when `AppSidebar` already renders admin items filtered by capabilities.
3. **i18n namespace sprawl:** `controlShell` has ~50 keys that duplicate concepts already in `nav` and `publicShell`.
**Concrete failure scenario:** A new developer adds an admin feature and must decide whether it goes in `(control)` or `(dashboard)/admin`. The answer is ambiguous because both exist.
**Confidence:** High
**Fix:** Merge `(control)` into `(dashboard)`:
1. Move `/control/discussions` to `/dashboard/admin/discussions` (or `/dashboard/community/moderation`).
2. Move `/control` home card content into the existing dashboard home page or admin section.
3. Migrate `controlShell` i18n keys into `publicShell` and `nav` namespaces.
4. Remove `ControlNav` component.
5. Add `/control` -> `/dashboard` redirect in middleware or `next.config.ts`.
6. Remove the `(control)` route group directory entirely.

### ARCH-2: Three i18n namespaces for navigation creates maintenance burden [MEDIUM/HIGH]

**Files:** `messages/en.json:129-155` (`nav`), `messages/en.json:2614-2629` (`publicShell.nav`), `messages/en.json:2968-3018` (`controlShell`)
**Description:** Navigation labels are split across three namespaces:
- `nav.*` -- used by `AppSidebar` and `ControlNav` labels
- `publicShell.nav.*` -- used by `PublicHeader` top navbar
- `controlShell.nav.*` -- used only by control layout

Many keys overlap semantically (e.g., `nav.groups` vs `publicShell.nav.groups`). The `controlShell.nav.*Description` keys are unique but could live under `nav` with a `.description` suffix.
**Concrete failure scenario:** When "Groups" is renamed, it must be updated in 2-3 namespaces.
**Confidence:** High
**Fix:** Consolidate navigation i18n keys. As part of the control-to-dashboard merge, move `controlShell` keys into `nav` or `publicShell`, then delete the `controlShell` namespace.

### ARCH-3: `PublicHeader.getDropdownItems` is not in the shared navigation module [LOW/MEDIUM]

**File:** `src/components/layout/public-header.tsx:68-95`
**Description:** The dropdown items for the authenticated user are defined inside `PublicHeader` rather than in the shared `public-nav.ts` module. This means the dashboard sidebar (`AppSidebar`) and the header dropdown define their navigation items independently, with capability filtering done in two different places with slightly different logic.
**Concrete failure scenario:** A new navigation item is added to `AppSidebar` but not to `getDropdownItems`, or vice versa, causing navigation drift between the sidebar and dropdown.
**Confidence:** Medium
**Fix:** Move dropdown item definitions into `public-nav.ts` alongside `getPublicNavItems`, so both the header and sidebar share a single source of truth for navigation structure.

## Verified Safe

- Dashboard layout correctly uses `PublicHeader` with shared nav helpers.
- Public layout correctly uses `PublicHeader` with shared nav helpers.
- SEO route matrix correctly disallows `/control` from indexing.
- Middleware correctly routes `/control` as a protected path.
