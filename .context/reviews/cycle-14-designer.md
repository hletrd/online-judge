# Cycle 14 Designer Report

**Base commit:** 74d403a6
**Reviewer:** designer
**Scope:** UI/UX review — accessibility, responsive design, i18n, Korean letter-spacing

---

## CR14-D1 — [LOW] PublicHeader dropdown missing "contests" link — navigation gap for authenticated users on public pages

- **Confidence:** MEDIUM
- **Files:** `src/components/layout/public-header.tsx:68-93`
- **Evidence:** The dropdown menu for authenticated users includes: dashboard, problems (if canCreateProblems), groups (if canViewAllGroups), submissions, profile, admin (if canAdminSystem). It does NOT include "contests". The AppSidebar includes contests. A student viewing a public page who wants to access their contests must click "Dashboard" first, then find the contests link in the sidebar. This adds an extra navigation step for a common student action.
- **Suggested fix:** Add a "contests" entry to `getDropdownItems` (no capability check needed — all authenticated users can see contests). Place it after "submissions" and before "profile".

## CR14-D2 — [LOW] "tracking-wide" class on mobile menu "DASHBOARD" label — Korean i18n risk (carried from D16)

- **Confidence:** LOW
- **Files:** `src/components/layout/public-header.tsx:328`
- **Evidence:** The "DASHBOARD" heading in the mobile menu uses `tracking-wide` which is acceptable for English uppercase text but would violate CLAUDE.md's Korean letter-spacing rule if translated to Korean. Currently deferred as D16.
- **Suggested fix:** Make tracking locale-conditional when Korean i18n is implemented for this label.

## CR14-D3 — [LOW] Mobile menu sign-out button lacks visual separation from dashboard items

- **Confidence:** LOW
- **Files:** `src/components/layout/public-header.tsx:342-350`
- **Evidence:** The sign-out button has a `border-t` separator and `mt-1` spacing, but uses the same text style as dashboard items. Consider using a more distinct style (e.g., muted text, smaller font) to visually separate the destructive action from navigation items.
- **Suggested fix:** Add `text-red-500 hover:text-red-600` or similar to distinguish the sign-out action.

## Final Sweep

- Focus trap in mobile menu is properly implemented (Tab/Shift+Tab wrapping, Escape to close).
- ARIA attributes are well-managed (aria-expanded, aria-controls, aria-label).
- Skip-to-content link is present in both layouts.
- Dark/light mode toggle is available in the header.
- Locale switcher is accessible.
- Korean letter-spacing rule is followed (no custom tracking on Korean text).
