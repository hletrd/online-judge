# Cycle 23 Designer Review

**Date:** 2026-04-20
**Reviewer:** designer
**Base commit:** 86e7caf7

## Findings

### DES-1: Control panel layout uses a different visual paradigm than the rest of the app [MEDIUM/HIGH]

**File:** `src/app/(control)/layout.tsx:43-67`
**Description:** The control layout uses a `grid min-h-dvh lg:grid-cols-[18rem_1fr]` layout with a left `ControlNav` sidebar and a minimal header (just ThemeToggle + LocaleSwitcher). This differs from the dashboard layout which uses `SidebarProvider` + `AppSidebar` + `PublicHeader`. The control panel has no top navbar, no breadcrumb, and no link back to the main site. This creates a disjointed user experience -- navigating between the dashboard and the control panel feels like switching between two different apps.
**Concrete failure scenario:** An admin user in the control panel has no visible way to navigate back to the dashboard or public site. They must edit the URL manually.
**Confidence:** High
**Fix:** Merge the control panel into the dashboard layout so it shares the same `PublicHeader` + `AppSidebar` navigation paradigm. The discussion moderation page can live under `/dashboard/admin/discussions` or a dedicated section.

### DES-2: Control nav sidebar has `tracking-[0.18em]` on section label that may violate Korean letter-spacing rule [LOW/MEDIUM]

**File:** `src/components/layout/control-nav.tsx:31`
**Description:** The section label uses `tracking-[0.18em]` which applies letter-spacing. Per CLAUDE.md, Korean text must use browser/font default letter-spacing. The section label "제어" in Korean would have incorrect letter-spacing applied.
**Concrete failure scenario:** Korean users see the section label with awkward letter-spacing that violates the project's typography rules.
**Confidence:** Low (the section label is a short word, visual impact is minor)
**Fix:** Make the letter-spacing conditional based on locale, similar to the pattern used in `AppSidebar` and `PublicHeader` for Korean text.

## Verified Safe

- Dashboard layout correctly uses `PublicHeader` with the shared top navbar.
- `AppSidebar` correctly conditions `tracking-wider` on locale for Korean text.
- `PublicHeader` mobile menu correctly conditions `tracking-wide` on locale.
