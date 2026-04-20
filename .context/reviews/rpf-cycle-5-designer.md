# Designer / UI-UX Review -- Review-Plan-Fix Cycle 5

**Reviewer:** designer
**Base commit:** 4c2769b2

## Findings

### F1 -- PublicHeader dropdown shows admin/instructor-only items to all users (CRITICAL UX BUG)
- **Severity:** HIGH
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx:211-219, 300-312`
- **Description:** The `adminOnly` and `instructorOnly` flags on dropdown items are defined in the type but never used for filtering during rendering. Every authenticated user sees "Problems", "Groups", and "Admin" links regardless of their role. This is both a UX issue (cluttered, confusing navigation for students) and an information disclosure issue (students know admin panel exists).
- **Concrete failure:** Student logs in, sees "Admin" in dropdown, clicks it, gets 403 error. Bad user experience.
- **Suggested fix:** Filter dropdown items by role before rendering. Use the same `loggedInUser.role` check that `getDropdownItems` already uses to decide which items to include.

### F2 -- Mobile menu lacks visual grouping for authenticated navigation items
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx:300-312`
- **Description:** On desktop, authenticated items are in a dropdown with a clear trigger ("Dashboard"). On mobile, they appear as a flat list with no heading or separator. The sign-out button is mixed in with navigation links without visual distinction beyond the icon.
- **Suggested fix:** Add a small heading like "Dashboard" or a separator line above the authenticated items in the mobile menu, and visually distinguish the sign-out button (e.g., with a top border or different text color).

### F3 -- No skip-to-content link targeting verification
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `src/app/(public)/layout.tsx:22,39`
- **Description:** The layout includes `<SkipToContent>` and `<main id="main-content">`. The skip link should target `#main-content`. This works correctly as long as the `SkipToContent` component renders an anchor with `href="#main-content"`. This is a minor accessibility point worth verifying in the component implementation.
- **Suggested fix:** Verify that the `SkipToContent` component's `href` matches the main content `id`.

### F4 -- Dropdown trigger lacks `aria-haspopup` and `aria-expanded` attributes
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx:206`
- **Description:** The `DropdownMenuTrigger` at line 206 is a custom styled button that opens a dropdown menu. The base-ui DropdownMenu component may handle ARIA attributes internally, but the custom `className` styling wraps the trigger in a way that may not automatically get `aria-haspopup="menu"` and `aria-expanded`. Screen reader users may not know the button opens a menu.
- **Suggested fix:** Verify that the DropdownMenu component from base-ui/shadcn correctly sets `aria-haspopup` and `aria-expanded` on the trigger element. If not, add them manually.
